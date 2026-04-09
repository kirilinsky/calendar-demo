import { create } from "zustand";
import { CalendarProps, CalendarTheme } from "react-calendar-datetime";

interface CalendarStateStore extends CalendarProps {
  theme: CalendarTheme;
  setProp: <K extends keyof CalendarProps>(
    key: K,
    value: CalendarProps[K],
  ) => void;
}

export const useCalendarStateStore = create<CalendarStateStore>((set) => ({
  value: new Date(),
  mode: "single",
  presets: false,
  months: true,
  years: false,
  time: true,
  timeGrid: false,
  locale: "en",
  highlightWeekends: true,
  gestures: true,
  startOfWeek: 1,
  compactYears: true,
  compactMonths: false,
  hour12: false,
  width: 480,
  theme: "carbon" as CalendarTheme,
  gradient: false,
  brutalism: false,
  showWeekNumber: false,
  twoMonthsLayout: false,
  monthsColumn: false,
  showSelectedDates: false,
  hideLimited: false,
  hideDisabled: false,
  hideWeekdays: false,
  shortMonths: false,
  showHomeButton: false,
  showClearButton: false,

  setProp: (key: string, value: any) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
}));
