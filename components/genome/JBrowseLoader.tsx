"use client";

import { useEffect, useRef } from "react";

const LOADING_FRAME_COUNT = 121;
const FPS = 30;
const FRAME_PATH = (i: number) => `/loading-frames/frame_${String(i).padStart(4, "0")}.jpg`;

export default function JBrowseLoader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 200 * dpr;
    canvas.height = 200 * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= LOADING_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      images.push(img);
    }

    function draw(idx: number) {
      const img = images[idx];
      if (!img || !img.complete || !ctx) return;

      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, 200, 200);

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(200 / iw, 200 / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (200 - dw) / 2;
      const dy = (200 - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    const start = performance.now();
    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      const frame = Math.floor(elapsed * FPS) % LOADING_FRAME_COUNT;
      draw(frame);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 130px)",
        minHeight: "600px",
        background: "var(--db-charcoal)",
        border: "var(--arcade-border) solid var(--db-cream)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "200px", height: "200px", display: "block", border: "4px solid var(--db-cream)", boxShadow: "var(--arcade-shadow)", boxSizing: "content-box" }}
      />
      <p
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "0.65rem",
          lineHeight: 1.6,
          textTransform: "uppercase",
          color: "var(--db-cyan)",
          textAlign: "center",
          marginTop: "22px",
          padding: "0 16px",
        }}
      >
        Loading Otau_3.2 Assembly
        <span className="jbrowse-loader-ellipsis">...</span>
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          lineHeight: 1.5,
          color: "var(--db-stone)",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Connecting to Cloudflare R2...
      </p>

      <style>{`
        .jbrowse-loader-ellipsis {
          display: inline-block;
          width: 4em;
          overflow: hidden;
          vertical-align: bottom;
          animation: jbrowse-loader-ellipsis-cycle 1.4s steps(4) infinite;
        }
        @keyframes jbrowse-loader-ellipsis-cycle {
          0% { width: 0; }
          100% { width: 4em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jbrowse-loader-ellipsis { animation: none; }
        }
      `}</style>
    </div>
  );
}
