"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { springSnappy } from "./motion";
import { APPEARANCE_IDS, saveAppearanceId, saveDarkMode, saveGradient, saveThemePreset } from "./calendar-preferences";
import { THEMES } from "./themes/themes-data";

export function RandomizeButton() {
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
    <motion.div
      className="inline-flex will-change-transform"
      whileHover={reduce ? undefined : { scale: 1.035, y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.955 }}
      transition={reduce ? { duration: 0 } : springSnappy}
    >
      <Button
        type="button"
        onClick={randomize}
        size="lg"
        className="h-12 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 px-8 text-sm font-semibold shadow-lg shadow-zinc-950/25 transition-shadow duration-300 hover:shadow-xl hover:shadow-zinc-950/30"
      >
        Surprise Me ✨
      </Button>
    </motion.div>
  );
}
