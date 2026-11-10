"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/genome-browser/otaurus", label: "Genome Browser" },
  { href: "/downloads", label: "Downloads" },
  { href: "/literature", label: "Literature" },
  { href: "/people", label: "People" },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      style={{
        borderTop: "var(--arcade-border) solid var(--db-cream)",
        background: "var(--db-black)",
      }}
    >
      {/* Link bar */}
      <nav
        aria-label="Footer"
        style={{
          borderBottom: "2px dashed rgba(244,241,232,0.18)",
          padding: "1.4rem 1.25rem",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            columnGap: "clamp(1.2rem, 2.5vw, 2.5rem)",
            rowGap: "1rem",
            fontFamily: "var(--font-pixel)",
            fontSize: "0.6rem",
            lineHeight: 1.4,
            textTransform: "uppercase",
          }}
        >
          {footerLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring"
                  aria-current={active ? "page" : undefined}
                  style={{
                    color: active ? "var(--db-cyan)" : "var(--db-stone)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Credits */}
      <div
        className="arcade-label"
        style={{
          maxWidth: "1540px",
          margin: "0 auto",
          padding: "1.75rem 1.25rem 2.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          color: "var(--db-stone)",
        }}
      >
        <span style={{ color: "var(--db-cream)" }}>DB² · Dung Beetle Database</span>
        <span>Davidson Lab · Department of Biological Sciences · Mississippi State University</span>
        <span style={{ color: "var(--db-muted)" }}>© DB² 2026</span>
      </div>
    </footer>
  );
}
