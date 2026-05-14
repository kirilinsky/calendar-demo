"use client";

import { APPEARANCE_IDS, saveAppearanceId, saveGradient, saveThemePreset } from "./calendar-preferences";
import { THEMES } from "./themes/themes-data";

export function RandomizeButton() {
  function randomize() {
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const appearance = APPEARANCE_IDS[Math.floor(Math.random() * APPEARANCE_IDS.length)];
    saveThemePreset(theme.id);
    saveAppearanceId(appearance);
    saveGradient(Math.random() < 0.5);
  }

  return (
    <button
      type="button"
      onClick={randomize}
      className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-950 px-8 text-sm font-semibold text-white shadow-lg shadow-zinc-950/20 transition hover:bg-zinc-800 active:scale-95"
    >
      Surprise Me ✨
    </button>
  );
}
