"use client";

import { motion, type Variants } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  as?: keyof JSX.IntrinsicElements;
}

export default function AnimatedSection({
  children,
  className,
  style,
  delay = 0,
  direction = "up",
  duration = 0.7,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const offset = 36;
  const initial: Record<string, number> = { opacity: 0 };
  if (direction === "up")    { initial.y =  offset; }
  if (direction === "down")  { initial.y = -offset; }
  if (direction === "left")  { initial.x =  offset; }
  if (direction === "right") { initial.x = -offset; }

  const variants: Variants = {
    hidden:  initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}
