"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  createTheme,
  type CalendarAppearance,
  type ThemeFamily,
  type ThemeTokens,
} from "@dateforge/react-calendar";
import {
  airy,
  bubble,
  compact,
  loft,
  press,
  soft,
  square,
  zenith,
} from "@dateforge/react-calendar/appearances";
import { THEMES } from "./themes/themes-data";

const APPEARANCE_STORAGE_KEY = "dateforge:appearance";
const THEME_STORAGE_KEY = "dateforge:theme";
const GRADIENT_STORAGE_KEY = "dateforge:gradient";
const DARK_MODE_STORAGE_KEY = "dateforge:dark";
const PREFERENCE_EVENT = "dateforge:calendar-preferences";

export type AppearanceId =
  | "default"
  | "zenith"
  | "soft"
  | "compact"
  | "square"
  | "bubble"
  | "loft"
  | "airy"
  | "press";

export type SavedTheme =
  | { type: "preset"; id: string }
  | { type: "custom"; tokens: ThemeTokens };

export const DEFAULT_CUSTOM_THEME_TOKENS: ThemeTokens = {
  accent: "#1a1a1c",
  activeText: "#fff",
  todayDot: "#1a1a1c",
  backdrop: "#fff",
  tone: "#f4f4f4",
  text: "#1a1a1c",
  stroke: "#e8e8e8",
  shadow: "#1a1a1c14",
  disabled: "#a0a0a2",
  mutedText: "#6e6e6f",
  disabledText: "#686869",
  weekend: "#c62828",
  range: "#4a90d9",
  error: "#dc2626",
  focusRing: "#1a1a1c",
};

const APPEARANCE_MAP: Record<
  Exclude<AppearanceId, "default">,
  CalendarAppearance
> = {
  zenith,
  soft,
  compact,
  square,
  bubble,
  loft,
  airy,
  press,
};

export const APPEARANCE_IDS: AppearanceId[] = [
  "default",
  "zenith",
  "soft",
  "compact",
  "square",
  "bubble",
  "loft",
  "airy",
  "press",
];

const THEME_TOKEN_KEYS: Array<keyof ThemeTokens> = [
  "accent",
  "activeText",
  "todayDot",
  "backdrop",
  "tone",
  "text",
  "stroke",
  "shadow",
  "disabled",
  "mutedText",
  "disabledText",
  "weekend",
  "range",
  "error",
  "focusRing",
];

// v2 stored custom themes under the old token names; map them onto v3.
const LEGACY_TOKEN_RENAMES: Record<string, keyof ThemeTokens> = {
  highlight: "accent", // v2 highlight = brand color
};

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function readStorageValue(key: string) {
  if (!canUseStorage()) return "";

  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function notifyPreferenceChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PREFERENCE_EVENT));
}

function subscribePreferences(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFERENCE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PREFERENCE_EVENT, onChange);
  };
}

export function getAppearanceById(
  id: AppearanceId,
): CalendarAppearance | undefined {
  if (id === "default") return undefined;
  return APPEARANCE_MAP[id];
}

export function readSavedAppearanceId(): AppearanceId {
  if (!canUseStorage()) return "default";

  try {
    const saved = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    return APPEARANCE_IDS.includes(saved as AppearanceId)
      ? (saved as AppearanceId)
      : "default";
  } catch {
    return "default";
  }
}

export function saveAppearanceId(id: AppearanceId) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, id);
    notifyPreferenceChange();
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

export function readSavedAppearance(): CalendarAppearance | undefined {
  return getAppearanceById(readSavedAppearanceId());
}

export function useSavedAppearance(): CalendarAppearance | undefined {
  const id = useSyncExternalStore(
    subscribePreferences,
    () => readSavedAppearanceId(),
    () => "default" as AppearanceId,
  );

  return getAppearanceById(id);
}

function isThemeTokens(value: unknown): value is ThemeTokens {
  if (!value || typeof value !== "object") return false;
  const tokens = value as Record<string, unknown>;
  return THEME_TOKEN_KEYS.every(
    (key) =>
      typeof tokens[key] === "string" ||
      typeof DEFAULT_CUSTOM_THEME_TOKENS[key] === "string",
  );
}

function hydrateTokens(tokens: Record<string, unknown>): ThemeTokens {
  const out = { ...DEFAULT_CUSTOM_THEME_TOKENS };
  for (const [legacyKey, v3Key] of Object.entries(LEGACY_TOKEN_RENAMES)) {
    const v = tokens[legacyKey];
    if (typeof v === "string" && typeof tokens[v3Key] !== "string") {
      out[v3Key] = v;
    }
  }
  for (const key of THEME_TOKEN_KEYS) {
    const v = tokens[key];
    if (typeof v === "string") out[key] = v;
  }
  return out;
}

export function readSavedTheme(): SavedTheme | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const value = parsed as Record<string, unknown>;
    if (value.type === "preset" && typeof value.id === "string") {
      return { type: "preset", id: value.id };
    }
    if (value.type === "custom" && isThemeTokens(value.tokens)) {
      return {
        type: "custom",
        tokens: hydrateTokens(value.tokens as Record<string, unknown>),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveThemePreset(id: string) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ type: "preset", id } satisfies SavedTheme),
    );
    notifyPreferenceChange();
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

export function saveCustomTheme(tokens: ThemeTokens) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ type: "custom", tokens } satisfies SavedTheme),
    );
    notifyPreferenceChange();
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

export function resolveSavedTheme(
  saved = readSavedTheme(),
): ThemeFamily | undefined {
  if (!saved) return undefined;
  if (saved.type === "custom") return createTheme(saved.tokens);

  return THEMES.find((theme) => theme.id === saved.id)?.theme;
}

function parseSavedThemeSnapshot(snapshot: string): SavedTheme | null {
  if (!snapshot) return null;

  try {
    const parsed = JSON.parse(snapshot) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const value = parsed as Record<string, unknown>;
    if (value.type === "preset" && typeof value.id === "string") {
      return { type: "preset", id: value.id };
    }
    if (value.type === "custom" && isThemeTokens(value.tokens)) {
      return {
        type: "custom",
        tokens: hydrateTokens(value.tokens as Record<string, unknown>),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSavedTheme() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    notifyPreferenceChange();
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

export function resetAllPreferences() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    window.localStorage.removeItem(APPEARANCE_STORAGE_KEY);
    window.localStorage.removeItem(GRADIENT_STORAGE_KEY);
    window.localStorage.removeItem(DARK_MODE_STORAGE_KEY);
    notifyPreferenceChange();
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

export function useHasNonDefaultPreferences(): boolean {
  const appearanceId = useSyncExternalStore(
    subscribePreferences,
    () => readSavedAppearanceId(),
    () => "default" as AppearanceId,
  );
  const themeRaw = useSyncExternalStore(
    subscribePreferences,
    () => readStorageValue(THEME_STORAGE_KEY),
    () => "",
  );
  const gradient = useSyncExternalStore(
    subscribePreferences,
    () => readSavedGradient(),
    () => false,
  );
  return appearanceId !== "default" || themeRaw !== "" || gradient;
}

export function readSavedDarkMode(): boolean {
  if (!canUseStorage()) return false;
  try {
    return window.localStorage.getItem(DARK_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveDarkMode(dark: boolean) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(DARK_MODE_STORAGE_KEY, dark ? "1" : "0");
    notifyPreferenceChange();
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

export function useSavedDarkMode(): boolean {
  return useSyncExternalStore(
    subscribePreferences,
    () => readSavedDarkMode(),
    () => false,
  );
}

export function readSavedGradient(): boolean {
  if (!canUseStorage()) return false;
  try {
    const val = window.localStorage.getItem(GRADIENT_STORAGE_KEY);
    return val === "1";
  } catch {
    return false;
  }
}

export function saveGradient(enabled: boolean) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(GRADIENT_STORAGE_KEY, enabled ? "1" : "0");
    notifyPreferenceChange();
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

export function useSavedGradient(): boolean {
  return useSyncExternalStore(
    subscribePreferences,
    () => readSavedGradient(),
    () => false,
  );
}

export function useSavedTheme(): ThemeFamily | undefined {
  const snapshot = useSyncExternalStore(
    subscribePreferences,
    () => readStorageValue(THEME_STORAGE_KEY),
    () => "",
  );

  return useMemo(
    () => resolveSavedTheme(parseSavedThemeSnapshot(snapshot)),
    [snapshot],
  );
}
