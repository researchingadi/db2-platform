"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 193;
const FRAME_PATH = (i: number) => `/frames/frame_${String(i).padStart(4, "0")}.jpg`;

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIdxRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
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

        const cue = scrollCueRef.current;
        if (cue) cue.style.opacity = String(Math.max(0, 1 - clamped / 0.08));

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


        {/* Scroll indicator */}
        <div
          ref={scrollCueRef}
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
