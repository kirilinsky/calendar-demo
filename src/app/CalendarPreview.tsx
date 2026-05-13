"use client";

import { useEffect, useState } from "react";
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
  type CalendarAppearance,
  type CalendarTheme,
} from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";
import { useSavedAppearance, useSavedTheme } from "./calendar-preferences";

type CalendarPreviewProps = {
  appearance?: CalendarAppearance;
  defaultViewDate?: Date;
  initialDate?: Date | null;
  navLinks?: NavLink[];
  theme?: CalendarTheme;
  useSavedAppearanceFallback?: boolean;
  useSavedThemeFallback?: boolean;
  width?: string | number;
};

export function CalendarPreview({
  appearance,
  defaultViewDate,
  initialDate,
  navLinks = HOME_NAV,
  theme,
  useSavedAppearanceFallback = true,
  useSavedThemeFallback = true,
  width = "100%",
}: CalendarPreviewProps) {
  const savedAppearance = useSavedAppearance();
  const savedTheme = useSavedTheme();
  const [date, setDate] = useState<Date | null>(() =>
    initialDate === undefined ? new Date() : initialDate,
  );
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const calendarAppearance = useSavedAppearanceFallback
    ? appearance ?? savedAppearance
    : appearance;
  const calendarTheme = useSavedThemeFallback ? theme ?? savedTheme : theme;

  const navHeight = navLinks.length > 0 ? 36 : 0;

  if (!hydrated) {
    return (
      <div style={{ width }}>
        <div
          aria-hidden
          className="animate-pulse rounded-xl bg-muted/40"
          style={{ width: "100%", aspectRatio: "5 / 6" }}
        />
        {navHeight > 0 && (
          <div style={{ height: navHeight }} />
        )}
      </div>
    );
  }

  return (
    <div>
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        width={width}
        theme={calendarTheme}
        appearance={calendarAppearance}
      >
        <CalendarNav showMonthPicker compactYears />
        <CalendarDays />
      </Calendar>
      {navLinks.length > 0 && (
        <div className="mt-2.5 flex items-center justify-center gap-2">
          {navLinks.map((link) => (
            <PageLink key={link.href} {...link} />
          ))}
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
