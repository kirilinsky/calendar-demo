import React from "react";

//#region src/types/themes.d.ts
declare const LIGHT_THEMES: readonly ["paper", "mintblue", "comfy", "neonlight", "larosa", "snowstorm", "solar"];
declare const DARK_THEMES: readonly ["carbon", "midnight", "sandstone", "phosphor", "dracula", "cyber", "temporal"];
type CalendarTheme = (typeof LIGHT_THEMES)[number] | (typeof DARK_THEMES)[number];
//#endregion
//#region src/types/calendar.d.ts
type StartOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface CalendarProps {
  presets?: boolean;
  months?: boolean;
  years?: boolean;
  date?: Date;
  time?: boolean;
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  jellyMode?: boolean;
  highlightWeekends?: boolean;
  disableWeekends?: boolean;
  gestures?: boolean;
  startOfWeek?: StartOfWeek;
  compactYears?: boolean;
  compactMonths?: boolean;
  onChangeDate?: (date: Date) => void;
  width?: string | number;
  height?: string | number;
  theme?: CalendarTheme;
}
//#endregion
//#region src/components/calendar/calendar.d.ts
declare const Calendar: React.FC<CalendarProps>;
//#endregion
export { Calendar, type CalendarProps, type CalendarTheme, type StartOfWeek };