"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 193;
const FRAME_PATH = (i: number) => `/frames/frame_${String(i).padStart(4, "0")}.jpg`;

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIdxRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw(idx: number) {
      const img = imagesRef.current[idx];
      const c = canvasRef.current;
      if (!img || !img.complete || !c || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const cw = c.clientWidth;
      const ch = c.clientHeight;
      if (c.width !== cw * dpr || c.height !== ch * dpr) {
        c.width = cw * dpr;
        c.height = ch * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, cw, ch);

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    let loaded = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loaded++;
        if (i === 1) {
          draw(0);
          currentIdxRef.current = 0;
          setReady(true);
        }
        if (loaded === FRAME_COUNT) {
          setReady(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    function tick() {
      const cont = containerRef.current;
      if (cont) {
        const rect = cont.getBoundingClientRect();
        const scrollable = cont.offsetHeight - window.innerHeight;
        const p = scrollable > 0 ? -rect.top / scrollable : 0;
        const clamped = Math.min(1, Math.max(0, p));
        setProgress(clamped);

        const targetIdx = Math.round(clamped * (FRAME_COUNT - 1));
        if (targetIdx !== currentIdxRef.current) {
          draw(targetIdx);
          currentIdxRef.current = targetIdx;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    function onResize() {
      draw(Math.max(0, currentIdxRef.current));
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const zone1Opacity = Math.max(0, 1 - progress / 0.3);
  const zone2Opacity = Math.max(0, (progress - 0.65) / 0.35);
  const scrollIndicatorOpacity = Math.max(0, 1 - progress / 0.2);

  return (
    <div ref={containerRef} style={{ height: "350vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background: "var(--db-black)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%", opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }}
        />

        <div className="db-grid" style={{ position: "absolute", inset: 0, opacity: 0.14, pointerEvents: "none" }} />
        <div className="db-grain" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />

        {/* Gradient behind zone 1 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "55%",
            background:
              "linear-gradient(to top, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.4) 55%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Gradient behind zone 2 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "45%",
            height: "55%",
            background: "linear-gradient(to top, rgba(3,3,3,0.85) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Zone 1 */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            position: "absolute",
            bottom: "15%",
            left: "6%",
            maxWidth: "580px",
            opacity: zone1Opacity,
            pointerEvents: zone1Opacity < 0.05 ? "none" : "auto",
          }}
        >
          <p className="db-eyebrow" style={{ marginBottom: "16px" }}>
            Davidson Lab · Mississippi State University
          </p>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              color: "var(--db-cream)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Advancing Dung Beetle
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00f0ff, #49ffb6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Genomics
            </span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "1.05rem",
              color: "var(--db-stone)",
              maxWidth: "460px",
              lineHeight: 1.75,
              marginTop: "18px",
            }}
          >
            Comprehensive genomic resources for Onthophagus taurus, supporting
            research in evolution, ecology, and adaptation.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
            <Link href="/genome-browser" style={{ textDecoration: "none" }}>
              <motion.span
                whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(0,240,255,0.4)" }}
                style={{
                  display: "inline-block",
                  background: "var(--db-cyan)",
                  color: "#030303",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: "0.06em",
                  padding: "12px 26px",
                  borderRadius: "8px",
                }}
              >
                Explore Genome Browser
              </motion.span>
            </Link>
            <Link href="/literature" style={{ textDecoration: "none" }}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                style={{
                  display: "inline-block",
                  background: "transparent",
                  color: "var(--db-cyan)",
                  border: "1px solid rgba(0,240,255,0.4)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: "0.06em",
                  padding: "12px 26px",
                  borderRadius: "8px",
                }}
              >
                Browse Literature
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Zone 2 */}
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "6%",
            maxWidth: "320px",
            textAlign: "right",
            opacity: zone2Opacity,
            pointerEvents: zone2Opacity < 0.05 ? "none" : "auto",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--db-cyan)",
              margin: 0,
            }}
          >
            Genome · DNA · Evolution
          </p>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "2.4rem",
              color: "var(--db-cream)",
              margin: "8px 0 0",
            }}
          >
            28,456 Gene Models
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--db-stone)",
              marginTop: "8px",
            }}
          >
            Chromosome-level assembly · GCF_036711975.1
          </p>
          <Link
            href="/genome-browser"
            className="db-magnetic-link"
            style={{ justifyContent: "flex-end", marginTop: "10px" }}
          >
            Open Genome Browser →
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "var(--db-muted)",
            textTransform: "uppercase",
            opacity: scrollIndicatorOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </div>
      </div>
    </div>
  );
}
