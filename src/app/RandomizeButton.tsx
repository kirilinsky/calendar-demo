"use client";

import { Button } from "@/components/ui/button";
import { APPEARANCE_IDS, saveAppearanceId, saveDarkMode, saveGradient, saveThemePreset } from "./calendar-preferences";
import { THEMES } from "./themes/themes-data";

export function RandomizeButton() {
  function randomize() {
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const appearance = APPEARANCE_IDS[Math.floor(Math.random() * APPEARANCE_IDS.length)];
    saveThemePreset(theme.id);
    saveAppearanceId(appearance);
    saveGradient(Math.random() < 0.5);
    saveDarkMode(Math.random() < 0.5);
  }

  return (
    <Button
      type="button"
      onClick={randomize}
      size="lg"
      className="h-12 px-8 text-sm font-semibold shadow-lg shadow-zinc-950/20"
    >
      Surprise Me ✨
    </Button>
  );
}
