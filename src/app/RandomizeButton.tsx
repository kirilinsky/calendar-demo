"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springSnappy } from "./motion";
import { APPEARANCE_IDS, saveAppearanceId, saveDarkMode, saveGradient, saveThemePreset } from "./calendar-preferences";
import { THEMES } from "./themes/themes-data";

export function RandomizeButton({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  function randomize() {
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const appearance = APPEARANCE_IDS[Math.floor(Math.random() * APPEARANCE_IDS.length)];
    saveThemePreset(theme.id);
    saveAppearanceId(appearance);
    saveGradient(Math.random() < 0.5);
    saveDarkMode(Math.random() < 0.5);
  }

  return (
    <motion.button
      type="button"
      onClick={randomize}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={reduce ? { duration: 0 } : springSnappy}
      className={`inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 px-4 text-[13px] font-semibold whitespace-nowrap sm:px-5 sm:text-sm text-white shadow-sm shadow-zinc-950/20 transition-shadow duration-300 outline-none will-change-transform hover:shadow-md hover:shadow-zinc-950/25 focus-visible:ring-2 focus-visible:ring-zinc-950/40 ${className}`}
    >
      Surprise Me ✨
    </motion.button>
  );
}
