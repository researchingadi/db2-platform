"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function BeetleHeroBackground() {
  const ref = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 18, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 18, mass: 0.6 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.32]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [0.9, 0.72, 0.25]);

  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.18]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      mouseX.set(x);
      mouseY.set(y);
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseX, mouseY]);

  const beetleX = useTransform(smoothX, [-1, 1], [-28, 28]);
  const beetleRotate = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);
  const beetleY = useTransform(smoothY, [-1, 1], [-18, 18]);

  const glowX = useTransform(smoothX, [-1, 1], ["35%", "68%"]);
  const glowY = useTransform(smoothY, [-1, 1], ["25%", "58%"]);

  return (
    <div ref={ref} className="beetle-hero-bg" aria-hidden="true">
      <motion.div
        className="beetle-glow"
        style={{
          left: glowX,
          top: glowY,
        }}
      />

      <motion.div
        className="beetle-image-wrap"
        style={{
          x: beetleX,
          y: beetleY,
          rotate: beetleRotate,
          scale: imageScale,
          opacity: imageOpacity,
        }}
      >
        <img src="/media/beetle-hero.jpg" alt="" className="beetle-image" />
      </motion.div>

      <motion.div
        className="beetle-orbit beetle-orbit-one"
        style={{
          rotate: ringRotate,
          scale: ringScale,
          x: useTransform(smoothX, [-1, 1], [-18, 18]),
          y: useTransform(smoothY, [-1, 1], [-12, 12]),
        }}
      />

      <motion.div
        className="beetle-orbit beetle-orbit-two"
        style={{
          rotate: useTransform(scrollYProgress, [0, 1], [80, -220]),
          scale: useTransform(scrollYProgress, [0, 1], [1.05, 0.86]),
          x: useTransform(smoothX, [-1, 1], [22, -22]),
          y: useTransform(smoothY, [-1, 1], [14, -14]),
        }}
      />

      <motion.div
        className="genome-track-field"
        style={{
          y: imageY,
          opacity: useTransform(scrollYProgress, [0, 0.7, 1], [0.9, 0.55, 0.18]),
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleX: 0.25, opacity: 0.15 }}
            animate={{
              scaleX: [0.25, 1, 0.4],
              opacity: [0.14, 0.75, 0.24],
            }}
            transition={{
              duration: 2.6 + i * 0.11,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
            style={{
              width: `${40 + ((i * 19) % 48)}%`,
              marginLeft: `${(i * 11) % 34}%`,
            }}
          />
        ))}
      </motion.div>

      <div className="beetle-vignette" />
      <div className="db-grain beetle-grain" />
      <div className="db-scanlines beetle-scanlines" />
    </div>
  );
}