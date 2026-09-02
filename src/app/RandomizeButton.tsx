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
      className={`inline-flex h-10 items-center justify-center bg-zinc-950 px-4 text-[13px] font-semibold whitespace-nowrap text-white transition-colors duration-300 outline-none will-change-transform hover:bg-[#d0021b] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:px-5 sm:text-sm ${className}`}
    >
      Surprise Me ✨
    </motion.button>
  );
}
