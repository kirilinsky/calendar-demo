import { create } from "zustand";
import { CalendarProps, CalendarTheme } from "react-calendar-datetime";

interface CalendarStateStore extends CalendarProps {
  theme: CalendarTheme;
  onChangeDate: (newDate: Date) => void;
  setProp: <K extends keyof CalendarProps>(
    key: K,
    value: CalendarProps[K],
  ) => void;
}

export const useCalendarStateStore = create<CalendarStateStore>((set) => ({
  presets: false,
  months: true,
  years: false,
  date: new Date(),
  time: false,
  locale: "en-US",
  highlightWeekends: true,
  disableWeekends: false,
  gestures: false,
  startOfWeek: 1,
  compactYears: true,
  compactMonths: false,
  width: 400,
  height: "auto",
  theme: "carbon" as CalendarTheme,

  setProp: (key: string, value: any) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  onChangeDate: (newDate: Date) => set({ date: newDate }),
}));
