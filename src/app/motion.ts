import type { Transition, Variants } from "framer-motion";

export const appleEase = [0.32, 0.72, 0, 1] as const;
export const appleEaseOut = [0.16, 1, 0.3, 1] as const;

/** Pill / indicator movement between segmented controls and tabs. */
export const springPill: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 36,
  mass: 0.8,
};

/** Press feedback and small knobs. */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 560,
  damping: 40,
  mass: 0.6,
};

/** Panels, sheets, cards settling into place. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 0.9,
};

export const easeMedium: Transition = { duration: 0.42, ease: appleEase };
export const easeFast: Transition = { duration: 0.24, ease: appleEase };

/** Container that releases its children one after another. */
export const staggerList: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.04 },
  },
};

/** Rise + defocus, the way Apple reveals content blocks. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: appleEaseOut },
  },
};

/** Crossfade used when swapping whole panels. */
export const swapPanel: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.34, ease: appleEaseOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(5px)",
    transition: { duration: 0.2, ease: appleEase },
  },
};

/** Tap scale used across every pressable surface. */
export const tap = { scale: 0.972 };
export const tapSmall = { scale: 0.94 };
