"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { House, Palette, Shapes } from "lucide-react";

export type NavLink = { href: string; icon: React.ReactNode; label: string };

export const HOME_NAV: NavLink[] = [
  { href: "/themes", icon: <Palette size={12} />, label: "Themes" },
  { href: "/appearance", icon: <Shapes size={12} />, label: "Appearance" },
];
export const THEMES_NAV: NavLink[] = [
  { href: "/", icon: <House size={12} />, label: "Home" },
  { href: "/appearance", icon: <Shapes size={12} />, label: "Appearance" },
];
export const APPEARANCE_NAV: NavLink[] = [
  { href: "/", icon: <House size={12} />, label: "Home" },
  { href: "/themes", icon: <Palette size={12} />, label: "Themes" },
];
import {
  Calendar,
  calendarDate,
  createCalendarConfig,
  type CalendarAppearance,
  type ThemeFamily,
} from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarPrev,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";
import {
  saveDarkMode,
  useSavedAppearance,
  useSavedDarkMode,
  useSavedGradient,
  useSavedTheme,
} from "./calendar-preferences";

const previewConfig = createCalendarConfig();

const subscribeNoop = () => () => {};

function toCalendarDate(date: Date) {
  return calendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

type CalendarPreviewProps = {
  appearance?: CalendarAppearance;
  scheme?: "light" | "dark" | "auto";
  initialView?: Date;
  gradient?: boolean;
  initialDate?: Date | null;
  navLinks?: NavLink[];
  navTrailing?: React.ReactNode;
  theme?: ThemeFamily;
  useSavedAppearanceFallback?: boolean;
  useSavedSchemeFallback?: boolean;
  useSavedGradientFallback?: boolean;
  useSavedThemeFallback?: boolean;
  width?: string | number;
  /**
   * Vertical space reserved for the calendar. Appearances differ in height —
   * reserving the tallest one keeps content below from jumping or being
   * overlapped when the appearance changes. Pass 0 to size to content,
   * or a CSS length (e.g. "min(440px, 60dvh)") for viewport-aware reserve.
   */
  reserveHeight?: number | string;
};

export function CalendarPreview({
  appearance,
  scheme,
  initialView,
  gradient,
  initialDate,
  navLinks = HOME_NAV,
  navTrailing,
  theme,
  useSavedAppearanceFallback = true,
  useSavedSchemeFallback = true,
  useSavedGradientFallback = true,
  useSavedThemeFallback = true,
  width = "100%",
  reserveHeight = 440,
}: CalendarPreviewProps) {
  const savedAppearance = useSavedAppearance();
  const savedTheme = useSavedTheme();
  const savedGradient = useSavedGradient();
  const savedDark = useSavedDarkMode();
  const [date, setDate] = useState<Date | null>(() =>
    initialDate === undefined ? new Date() : initialDate,
  );
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const calendarAppearance = useSavedAppearanceFallback
    ? (appearance ?? savedAppearance)
    : appearance;
  const calendarTheme = useSavedThemeFallback ? (theme ?? savedTheme) : theme;
  const savedScheme = savedDark ? "dark" : "light";
  const calendarScheme = useSavedSchemeFallback
    ? (scheme ?? savedScheme)
    : (scheme ?? "auto");

  const navHeight = navLinks.length > 0 ? 36 : 0;

  if (!hydrated) {
    return (
      <div style={{ width }}>
        <div
          className="flex items-center justify-center"
          style={{ minHeight: reserveHeight || undefined }}
        >
          <div
            aria-hidden
            className="w-full animate-pulse rounded-xl bg-muted/40"
            style={{ aspectRatio: "5 / 6" }}
          />
        </div>
        {navHeight > 0 && <div style={{ height: navHeight }} />}
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center justify-center"
        style={{ minHeight: reserveHeight || undefined }}
      >
        <Calendar
          config={previewConfig}
          value={date}
          onChange={(value) => setDate(value as Date | null)}
          initialView={initialView ? toCalendarDate(initialView) : undefined}
          style={{ width }}
          theme={calendarTheme}
          appearance={calendarAppearance}
          scheme={calendarScheme}
          onSchemeChange={(next) => saveDarkMode(next === "dark")}
          gradient={
            useSavedGradientFallback ? (gradient ?? savedGradient) : gradient
          }
        >
          <CalendarToolbar>
            <CalendarToolbarPrev />
            <CalendarToolbarMonthTrigger />
            <CalendarToolbarNext />
            <CalendarToolbarYearTrigger compact />
          </CalendarToolbar>
          <CalendarDays />
        </Calendar>
      </div>
      {(navLinks.length > 0 || navTrailing) && (
        <div className="mt-2.5 flex items-center justify-center gap-2">
          {navLinks.map((link) => (
            <PageLink key={link.href} {...link} />
          ))}
          {navTrailing}
        </div>
      )}
    </div>
  );
}

function PageLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-[11px] font-medium leading-none tracking-tight text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-white"
    >
      {icon}
      {label}
    </Link>
  );
}
