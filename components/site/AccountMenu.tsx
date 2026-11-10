"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

const HONORIFICS = new Set(["dr", "dr.", "prof", "prof.", "mr", "mr.", "ms", "ms.", "mrs", "mrs."]);

export function firstName(name: string | undefined | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = parts.find((p) => !HONORIFICS.has(p.toLowerCase()));
  return first ?? parts[0] ?? "Account";
}

/** Shared session state for the desktop menu and the mobile menu entries. */
export function useAccount() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const user = data?.user;
  return {
    ready: !isPending,
    user,
    isAdmin: user?.role === "admin",
    first: firstName(user?.name),
    async logOut() {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    },
  };
}

/* Desktop (≥1280px): a square icon button that opens a small dropdown. */
export default function AccountMenu() {
  const { ready, user, isAdmin, first, logOut } = useAccount();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        wrapRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = user ? `Account menu for ${first}` : "Account menu";

  return (
    <div className="nav-account" ref={wrapRef}>
      <button
        type="button"
        className="arcade-btn"
        aria-label={label}
        title={user ? first : "Log in"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "40px",
          height: "40px",
          padding: 0,
          color: user ? "var(--db-cyan)" : undefined,
        }}
      >
        <User size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {open && ready && (
        <ul className="account-menu" role="menu" ref={menuRef} aria-label={label}>
          {user ? (
            <>
              <li role="none" className="account-menu__name" aria-hidden="true">
                {first}
              </li>
              <li role="none">
                <Link role="menuitem" href="/account" className="account-menu__item">
                  ▶ Account
                </Link>
              </li>
              {isAdmin && (
                <li role="none">
                  <Link role="menuitem" href="/admin/users" className="account-menu__item">
                    ▶ Admin
                  </Link>
                </li>
              )}
              <li role="none">
                <button role="menuitem" type="button" className="account-menu__item" onClick={logOut}>
                  ▶ Log out
                </button>
              </li>
            </>
          ) : (
            <li role="none">
              <Link role="menuitem" href="/login" className="account-menu__item">
                ▶ Log in
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
