"use client";

import Link from "next/link";

const LINKS = [
  { href: "/genome-browser", label: "Genome Browser" },
  { href: "/resources",      label: "Resources"      },
  { href: "/publications",   label: "Publications"   },
  { href: "/downloads",      label: "Downloads"      },
  { href: "/people",         label: "People"         },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(26,34,64,0.6)",
      background: "rgba(4,6,15,0.95)",
      padding: "2.5rem 1.5rem",
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#e2e8f0",
            marginBottom: "4px",
          }}>
            DB<sup style={{ fontSize: "0.65em" }}>2</sup>
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "#64748b",
            letterSpacing: "0.04em",
          }}>
            Dung Beetle Database · Davidson Lab
          </div>
        </div>

        {/* Links */}
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem 1.25rem" }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                textDecoration: "none",
                fontFamily: "var(--font-sans)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#22d3ee")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#64748b")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "#475569",
        }}>
          © {new Date().getFullYear()} Davidson Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
