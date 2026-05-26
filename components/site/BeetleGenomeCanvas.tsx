"use client";

import { useEffect, useRef } from "react";

type Props = {
  progress: number;
};

export default function BeetleGenomeCanvas({ progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBeetle = (cx: number, cy: number, scale: number, t: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      ctx.strokeStyle = "rgba(244,241,232,0.28)";
      ctx.lineWidth = 1;
      ctx.fillStyle = "rgba(244,241,232,0.035)";

      ctx.beginPath();
      ctx.ellipse(0, 12, 62, 92, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, -78, 40, 46, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -120);
      ctx.bezierCurveTo(-32, -154, -82, -142, -110, -112);
      ctx.moveTo(0, -120);
      ctx.bezierCurveTo(32, -154, 82, -142, 110, -112);
      ctx.strokeStyle = "rgba(0,240,255,0.42)";
      ctx.stroke();

      ctx.strokeStyle = "rgba(244,241,232,0.16)";
      for (let i = -1; i <= 1; i += 2) {
        for (let j = 0; j < 3; j++) {
          const y = -35 + j * 38;
          ctx.beginPath();
          ctx.moveTo(i * 42, y);
          ctx.bezierCurveTo(i * 105, y - 28, i * 118, y + 42, i * 160, y + 18);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = "rgba(73,255,182,0.28)";
      for (let i = 0; i < 8; i++) {
        const y = -42 + i * 18;
        const wobble = Math.sin(t * 0.02 + i) * 5;
        ctx.beginPath();
        ctx.moveTo(-38, y);
        ctx.bezierCurveTo(-16, y + wobble, 16, y - wobble, 38, y);
        ctx.stroke();
      }

      ctx.restore();
    };

    const draw = () => {
      frame += 1;
      const parent = canvas.parentElement;
      if (!parent) return;

      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const p = progressRef.current;
      const t = frame;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, w, h);

      const gradient = ctx.createRadialGradient(w * 0.55, h * 0.42, 0, w * 0.55, h * 0.42, w * 0.6);
      gradient.addColorStop(0, "rgba(0,240,255,0.16)");
      gradient.addColorStop(0.38, "rgba(141,124,255,0.07)");
      gradient.addColorStop(1, "rgba(3,3,3,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w * 0.62, h * 0.45);

      for (let r = 90; r < Math.min(w, h) * 0.42; r += 62) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(244,241,232,${0.07 + (r % 3) * 0.012})`;
        ctx.lineWidth = 1;
        ctx.arc(0, 0, r + Math.sin(t * 0.01 + r) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 44; i++) {
        const angle = i * 0.38 + t * 0.006 + p * 3.5;
        const radius = 110 + (i % 8) * 34;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        ctx.fillStyle = i % 5 === 0 ? "rgba(73,255,182,0.75)" : "rgba(0,240,255,0.55)";
        ctx.beginPath();
        ctx.arc(x, y, i % 5 === 0 ? 2.2 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      drawBeetle(w * (0.56 + p * 0.04), h * 0.48, Math.min(w, h) / 740, t);

      ctx.save();
      ctx.globalAlpha = 0.75;
      for (let i = 0; i < 18; i++) {
        const y = h * 0.18 + i * 18;
        const x = w * 0.08;
        const len = 120 + Math.sin(t * 0.025 + i) * 38 + p * 70;
        ctx.fillStyle =
          i % 3 === 0
            ? "rgba(0,240,255,0.42)"
            : i % 3 === 1
            ? "rgba(73,255,182,0.34)"
            : "rgba(244,241,232,0.18)";
        ctx.fillRect(x, y, len, 2);
      }
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(0,240,255,0.3)";
      ctx.lineWidth = 1;
      const scanY = ((t * 1.4 + p * h * 1.8) % (h + 120)) - 60;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}