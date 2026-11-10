"use client";

import { MotionConfig } from "framer-motion";

/*
 * Makes framer-motion animations inside it honour prefers-reduced-motion.
 * framer-motion has no "use client" directive, so server-component pages wrap
 * their animated content in this instead of using MotionConfig directly.
 */
export default function ReducedMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
