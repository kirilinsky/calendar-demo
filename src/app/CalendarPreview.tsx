"use client";

import { useState } from "react";
import {
  Calendar,
  useToday,
  type CalendarAppearance,
  type CalendarTheme,
} from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";
import { useSavedAppearance, useSavedTheme } from "./calendar-preferences";

type CalendarPreviewProps = {
  appearance?: CalendarAppearance;
  defaultViewDate?: Date;
  initialDate?: Date | null;
  theme?: CalendarTheme;
  useSavedAppearanceFallback?: boolean;
  useSavedThemeFallback?: boolean;
  width?: string | number;
};

export function CalendarPreview({
  appearance,
  defaultViewDate,
  initialDate = null,
  theme,
  useSavedAppearanceFallback = true,
  useSavedThemeFallback = true,
  width = "100%",
}: CalendarPreviewProps) {
  const today = useToday();
  const savedAppearance = useSavedAppearance();
  const savedTheme = useSavedTheme();
  const [date, setDate] = useState<Date | null>(initialDate);

  const calendarDate = date ?? today;
  const calendarAppearance = useSavedAppearanceFallback
    ? appearance ?? savedAppearance
    : appearance;
  const calendarTheme = useSavedThemeFallback ? theme ?? savedTheme : theme;

  return (
    <Calendar
      mode="single"
      value={calendarDate}
      onChange={setDate}
      defaultViewDate={defaultViewDate}
      width={width}
      theme={calendarTheme}
      appearance={calendarAppearance}
    >
      <CalendarNav showMonthPicker compactYears />
      <CalendarDays />
    </Calendar>
  );
}
