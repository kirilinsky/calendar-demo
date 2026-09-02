"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { appleEaseOut, staggerList } from "./motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  /** Animate when the block scrolls into view instead of on mount. */
  inView?: boolean;
  /** Soft focus-in. Disable for text that must stay razor sharp on slow devices. */
  blur?: boolean;
  /** Slight scale-up, the way Apple lands hero elements. */
  scale?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  y = 12,
  duration = 0.62,
  className,
  inView = false,
  blur = true,
  scale = false,
}: RevealProps) {
  const reduce = useReducedMotion();

  const hidden = {
    opacity: 0,
    y,
    ...(blur ? { filter: "blur(8px)" } : {}),
    ...(scale ? { scale: 0.985 } : {}),
  };
  const shown = {
    opacity: 1,
    y: 0,
    ...(blur ? { filter: "blur(0px)" } : {}),
    ...(scale ? { scale: 1 } : {}),
  };

  const motionProps = inView
    ? { whileInView: shown, viewport: { once: true, amount: 0.35 } }
    : { animate: shown };

  return (
    <motion.div
      initial={reduce ? false : hidden}
      {...motionProps}
      transition={{ duration, delay, ease: appleEaseOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Releases its <RevealItem> children one after another.
 * Use instead of hand-tuned per-child delays.
 */
export function RevealGroup({
  children,
  className,
  inView = false,
}: {
  children: ReactNode;
  className?: string;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : staggerList}
      initial="hidden"
      {...(inView
        ? { whileInView: "show" as const, viewport: { once: true, amount: 0.3 } }
        : { animate: "show" as const })}
    >
      {children}
    </motion.div>
  );
}

const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.62, ease: appleEaseOut } },
};

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : item}>
      {children}
    </motion.div>
  );
}
