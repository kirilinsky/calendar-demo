export const codeSamples = {
  "quick-start": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import {
  CalendarDays,
  CalendarNav,
} from "@dateforge/react-calendar/modules";

export function DatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Calendar mode="single" value={date} onChange={setDate}>
      <CalendarNav showMonthPicker compactYears />
      <CalendarDays />
    </Calendar>
  );
}`,

  "multi-month": `<Calendar mode="range" value={range} onChange={setRange} cols={3} appearance={compact}>
  <CalendarNav col={1} showMonthPicker compactYears />
  <CalendarNav col={1} offset={1} monthLabel yearLabel />
  <CalendarNav col={1} offset={2} monthLabel yearLabel />
  <CalendarDays col={1} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={1} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={2} currentMonthOnly fixedRows={false} />
  <CalendarNav col={1} offset={3} monthLabel yearLabel />
  <CalendarNav col={1} offset={4} monthLabel yearLabel />
  <CalendarNav col={1} offset={5} monthLabel yearLabel />
  <CalendarDays col={1} offset={3} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={4} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={5} currentMonthOnly fixedRows={false} />
  <CalendarNav col={1} offset={6} monthLabel yearLabel />
  <CalendarNav col={1} offset={7} monthLabel yearLabel />
  <CalendarNav col={1} offset={8} monthLabel yearLabel />
  <CalendarDays col={1} offset={6} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={7} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={8} currentMonthOnly fixedRows={false} />
  <CalendarNav col={1} offset={9} monthLabel yearLabel />
  <CalendarNav col={1} offset={10} monthLabel yearLabel />
  <CalendarNav col={1} offset={11} monthLabel yearLabel />
  <CalendarDays col={1} offset={9} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={10} currentMonthOnly fixedRows={false} />
  <CalendarDays col={1} offset={11} currentMonthOnly fixedRows={false} />
  <CalendarSelectedDates col={3} />
</Calendar>`,

  "minimal-single-date": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>`,

  "booking-range": `<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`,

  "analytics-presets": `const analyticsPresets = [
  { label: "Last 7 days", value: -6, range: 6 },
  { label: "Last 30 days", value: -29, range: 29 },
  { label: "Next sprint", value: 0, range: 13 },
];

<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarPresets presets={analyticsPresets} />
  <CalendarNav compactMonths compactYears />
  <CalendarDays />
  <CalendarSelectedDates />
</Calendar>`,

  "date-and-time": `<Calendar mode="single" value={date} onChange={setDate} timeStep={{ minute: 5 }}>
  <CalendarNav showTime showMonthPicker />
  <CalendarDays />
  <CalendarTimeGrid />
</Calendar>`,

  "mobile-tracks": `<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarYearsTrack />
  <CalendarMonthsTrack />
  <CalendarDaysTrack bound="from" />
  <CalendarDaysTrack bound="to" />
  <CalendarSelectedDates />
</Calendar>`,

  "calendar": `<Calendar
  mode="single"           // "single" | "multiple" | "range"
  value={date}
  onChange={setDate}
  theme="auto"            // "auto" follows prefers-color-scheme; pass a theme object for custom palette
  appearance={soft}       // controls shape, spacing, radius — import from appearances/<name>
  disabled={createDisabled({ weekends: true, before: new Date() })} // lock dates by rule
  locale="en-US"          // BCP 47 — affects month names, weekday labels, time format
  minDate={new Date()}    // nothing before today is selectable
>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`,

  "calendar-nav": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarNav showMonthPicker compactYears clear home />
</Calendar>`,

  "calendar-days": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarDays highlightWeekends weekNumbers todayDot />
</Calendar>`,

  "calendar-time-grid": `<Calendar mode="single" value={date} onChange={setDate} timeStep={{ minute: 5 }}>
  <CalendarTimeGrid seconds labels="long" />
</Calendar>`,

  "calendar-presets": `import { Calendar, basicPresets } from "@dateforge/react-calendar";
import { CalendarPresets } from "@dateforge/react-calendar/modules";

<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarPresets presets={basicPresets} />
</Calendar>`,

  "calendar-selected-dates": `<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarSelectedDates allowClear allowNavigate showTime />
</Calendar>`,

  "calendar-manual-input": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarManualInput allowClear />
</Calendar>`,

  "calendar-info": `<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarDays />
  <CalendarInfo showRelative showSummary rangeStyle="duration" />
</Calendar>`,

  "calendar-days-track": `<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarDaysTrack bound="from" showMonthLabel />
  <CalendarDaysTrack bound="to" showMonthLabel />
</Calendar>`,

  "calendar-months-track": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarMonthsTrack short showYearLabel />
</Calendar>`,

  "calendar-years-track": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarYearsTrack />
</Calendar>`,

  "calendar-months-grid": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarMonthsGrid short />
</Calendar>`,

  "calendar-years-grid": `<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarYearsGrid showControls yearsPerPage={12} />
</Calendar>`,

  "disabled-dates": `import { Calendar, createDisabled } from "@dateforge/react-calendar";

const rules = createDisabled({
  weekends: true,
  before: new Date(),
  dates: [new Date(2026, 5, 10), new Date(2026, 5, 11)],
});

<Calendar mode="single" value={date} onChange={setDate} disabled={rules}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>`,

  "holiday-presets": `import { type PresetEntry } from "@dateforge/react-calendar";

const holidayPresets: PresetEntry[] = [
  // Simple — jump to a fixed date
  { label: "New Year's Day", value: new Date(2027, 0, 1) },
  { label: "Christmas", value: new Date(2026, 11, 25) },

  // Advanced — computed range
  {
    id: "holiday-season",
    label: "Holiday season",
    getValue: () => ({ from: new Date(2026, 11, 24), to: new Date(2027, 0, 2) }),
  },

  // Advanced — dynamic: always resolves to next weekend
  {
    id: "next-weekend",
    label: "Next weekend",
    getValue: () => {
      const today = new Date();
      const daysToSat = ((6 - today.getDay() + 7) % 7) || 7;
      const sat = new Date(today);
      sat.setDate(today.getDate() + daysToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
      return { from: sat, to: sun };
    },
  },
];

<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarPresets presets={holidayPresets} />
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>`,

  "monsoon-theme": `import { monsoon } from "@dateforge/react-calendar/themes/monsoon";

<Calendar theme={monsoon}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>`,

  "custom-theme": `import { Calendar, createTheme } from "@dateforge/react-calendar";

const brandTheme = createTheme({
  accent: "#10b981",
  activeText: "#2a2323",
  todayDot: "#064e3b",
  backdrop: "#ffffff",
  highlight: "#1ad980",
  tone: "#64ec1a",
  text: "#18181b",
  stroke: "#d4d4d8",
  shadow: "#18181b1f",
  disabled: "#e4e4e7",
  mutedText: "#71717a",
  disabledText: "#a1a1aa",
  weekend: "#dc2626",
  range: "#a7f3d0",
  error: "#ef4444",
});

<Calendar theme={brandTheme}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>`,

  "bubble-appearance": `import { bubble } from "@dateforge/react-calendar/appearances/bubble";

<Calendar appearance={bubble}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>`,
} as const;

export type CodeSampleKey = keyof typeof codeSamples;
