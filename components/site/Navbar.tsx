"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/",               label: "Home"      },
  { href: "/genome-browser", label: "Browser"   },
  { href: "/resources",      label: "Resources" },
  { href: "/publications",   label: "Papers"    },
  { href: "/people",         label: "People"    },
  { href: "/downloads",      label: "Downloads" },
];

/* ── Per-character roll animation ─────────────────────────────────────────── */
function RollText({ text }: { text: string }) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", height: "1.15em", position: "relative" }}>
      {/* Layer 1 — current text, slides up on hover */}
      <motion.span
        variants={{}}
        style={{ display: "inline-flex" }}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={`top-${i}`}
            variants={{ rest: { y: "0%" }, hover: { y: "-110%" } }}
            transition={{ duration: 0.32, delay: i * 0.02, ease: [0.25, 0.4, 0.25, 1] }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
      {/* Layer 2 — cyan ghost, slides in from below */}
      <motion.span
        variants={{}}
        style={{ display: "inline-flex", position: "absolute", left: 0, top: 0, color: "#22d3ee" }}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={`bot-${i}`}
            variants={{ rest: { y: "110%" }, hover: { y: "0%" } }}
            transition={{ duration: 0.32, delay: i * 0.02, ease: [0.25, 0.4, 0.25, 1] }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: "background 0.35s, border-color 0.35s, box-shadow 0.35s",
          background: scrolled ? "rgba(4,6,15,0.9)" : "transparent",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(26,34,64,0.6)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "0 1.5rem", height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <div style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg, #22d3ee, #818cf8)",
                borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 700, color: "#04060f",
                fontFamily: "var(--font-mono)",
              }}>
                D²
              </div>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#e2e8f0",
                letterSpacing: "-0.02em",
              }}>
                DB<sup style={{ fontSize: "0.6em", verticalAlign: "super" }}>2</sup>
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2px" }} className="hidden md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                  {/* whileHover="hover" propagates to RollText children via variant context */}
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-sans)",
                      fontWeight: active ? 600 : 400,
                      background: active ? "rgba(34,211,238,0.07)" : "transparent",
                      cursor: "pointer",
                      color: active ? "#22d3ee" : "#64748b",
                    }}
                  >
                    <RollText text={link.label} />
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* ── CTA ── */}
          <div className="hidden md:flex">
            <Link href="/genome-browser" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(34,211,238,0.28)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "rgba(34,211,238,0.07)",
                  border: "1px solid rgba(34,211,238,0.22)",
                  color: "#22d3ee",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Launch Browser
              </motion.button>
            </Link>
          </div>

          {/* ── Hamburger ── */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={
                  open
                    ? i === 0 ? { rotate: 45, y: 10 }
                    : i === 1 ? { opacity: 0 }
                    : { rotate: -45, y: -10 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                style={{ display: "block", width: "20px", height: "1.5px", background: "#64748b", borderRadius: "1px", transformOrigin: "center" }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "64px", left: 0, right: 0,
              zIndex: 49,
              background: "rgba(4,6,15,0.97)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(26,34,64,0.6)",
              padding: "1rem 1.5rem 1.5rem",
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  style={{
                    display: "block", padding: "12px 0",
                    color: pathname === link.href ? "#22d3ee" : "#64748b",
                    textDecoration: "none",
                    fontSize: "1rem",
                    fontWeight: pathname === link.href ? 600 : 400,
                    fontFamily: "var(--font-sans)",
                    borderBottom: "1px solid rgba(26,34,64,0.4)",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
