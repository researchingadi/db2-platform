"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/genome-browser/otaurus", label: "Genome Browser" },
  { href: "/distribution", label: "Distribution" },
  { href: "/resources", label: "Resources" },
  { href: "/downloads", label: "Downloads" },
  { href: "/datasets", label: "Datasets" },
  { href: "/blast", label: "BLAST" },
  { href: "/literature", label: "Literature" },
  { href: "/people", label: "People" },
];

function NavLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4em",
        whiteSpace: "nowrap",
        color: active ? "var(--db-cyan)" : "var(--db-stone)",
      }}
    >
      <span
        aria-hidden="true"
        className={active ? "blink" : undefined}
        style={{
          display: "inline-block",
          width: "0.9em",
          visibility: active ? "visible" : "hidden",
        }}
      >
        ▶
      </span>
      {label}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "linear" }}
        style={{
          position: "fixed",
          inset: "0 0 auto 0",
          height: "var(--nav-height)",
          zIndex: 80,
          borderBottom: scrolled
            ? "var(--arcade-border) solid var(--db-cream)"
            : "var(--arcade-border) solid transparent",
          boxShadow: scrolled ? "0 6px 0 #000" : "none",
          background: scrolled ? "var(--db-black)" : "rgba(3,3,3,0.35)",
        }}
      >
        <div
          style={{
            height: "100%",
            maxWidth: "1540px",
            margin: "0 auto",
            padding: "0 1.25rem",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            gap: 0,
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
            >
              <Image
                src="/media/header.jpg"
                alt="DungBase DB²"
                width={2400}
                height={821}
                priority
                className="nav-logo"
              />
            </motion.div>
          </Link>

          <nav className="nav-links">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                >
                  <NavLabel label={link.label} active={active} />
                </Link>
              );
            })}
          </nav>

          {/* Visibility classes sit on wrappers: .arcade-btn sets its own display */}
          <div className="nav-cta">
            <Link
              href="/genome-browser/otaurus"
              className="arcade-btn arcade-btn--cta"
              style={{ height: "44px", whiteSpace: "nowrap" }}
            >
              Launch
            </Link>
          </div>

          <div className="nav-burger">
            <button
              className="arcade-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={open}
              style={{
                width: "44px",
                height: "44px",
                padding: 0,
                fontSize: "0.8rem",
              }}
            >
              {open ? "×" : "≡"}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2, ease: "linear" }}
            style={{
              position: "fixed",
              top: "var(--nav-height)",
              left: 0,
              right: 0,
              zIndex: 70,
              maxHeight: "calc(100dvh - var(--nav-height))",
              overflowY: "auto",
              background: "var(--db-black)",
              borderBottom: "var(--arcade-border) solid var(--db-cream)",
              boxShadow: "0 6px 0 #000",
              padding: "1.75rem 1.2rem 1.2rem",
            }}
          >
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    display: "block",
                    padding: "1rem 0",
                    textDecoration: "none",
                    fontFamily: "var(--font-pixel)",
                    fontSize: "0.65rem",
                    lineHeight: 1.4,
                    textTransform: "uppercase",
                    borderBottom: "2px dashed rgba(244,241,232,0.18)",
                  }}
                >
                  <NavLabel label={link.label} active={active} />
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
