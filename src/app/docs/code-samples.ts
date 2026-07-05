export const codeSamples = {
  "quick-start": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";

// Compiled once at module scope — unit "day", mode "single" by default.
const config = createCalendarConfig();

export function DatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Calendar
      config={config}
      value={date}
      onChange={(value) => setDate(value as Date | null)}
    >
      <CalendarToolbar>
        <CalendarToolbarPrev />
        <CalendarToolbarMonthTrigger />
        <CalendarToolbarNext />
        <CalendarToolbarYearTrigger compact />
      </CalendarToolbar>
      <CalendarDays />
    </Calendar>
  );
}`,

  "multi-month": `const config = createCalendarConfig({ mode: "range" });

<Calendar config={config} value={range} onChange={handleChange} cols={3} appearance={compact}>
  {/* offset 0 — only calendar with prev/next and year trigger */}
  <CalendarToolbar col={1} offset={0}>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  {/* offsets 1–11 — month + year labels only, no arrows */}
  <CalendarToolbar col={1} offset={1}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarToolbar col={1} offset={2}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarDays col={1} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={1} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={2} showOutsideDays={false} fixedWeeks={false} />
  <CalendarToolbar col={1} offset={3}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarToolbar col={1} offset={4}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarToolbar col={1} offset={5}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarDays col={1} offset={3} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={4} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={5} showOutsideDays={false} fixedWeeks={false} />
  <CalendarToolbar col={1} offset={6}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarToolbar col={1} offset={7}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarToolbar col={1} offset={8}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarDays col={1} offset={6} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={7} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={8} showOutsideDays={false} fixedWeeks={false} />
  <CalendarToolbar col={1} offset={9}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarToolbar col={1} offset={10}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarToolbar col={1} offset={11}><CalendarToolbarMonthLabel /><CalendarToolbarYearLabel /></CalendarToolbar>
  <CalendarDays col={1} offset={9} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={10} showOutsideDays={false} fixedWeeks={false} />
  <CalendarDays col={1} offset={11} showOutsideDays={false} fixedWeeks={false} />
  <CalendarSelectedDates col={3} />
</Calendar>`,

  "minimal-single-date": `const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`,

  "booking-range": `const config = createCalendarConfig({ mode: "range" });

// value: { start: Date; end: Date } | null
<Calendar config={config} value={range} onChange={handleChange}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`,

  "analytics-presets": `import { type PresetInput } from "@dateforge/react-calendar";

const config = createCalendarConfig({ mode: "range" });

const analyticsPresets: PresetInput[] = [
  { label: "Last 7 days", value: -6, range: 6 },
  { label: "Last 30 days", value: -29, range: 29 },
  { label: "Next sprint", value: 0, range: 13 },
];

<Calendar config={config} value={range} onChange={handleChange}>
  <CalendarPresets presets={analyticsPresets} />
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates />
</Calendar>`,

  "date-and-time": `const config = createCalendarConfig({
  withTime: true,
  defaultTime: { hour: 10, minute: 30 },
});

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarTime />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarTimeWheel />
</Calendar>`,

  "mobile-tracks": `const config = createCalendarConfig({ mode: "range" });

<Calendar config={config} value={range} onChange={handleChange}>
  <CalendarYearsTrack />
  <CalendarMonthsTrack />
  <CalendarDaysTrack bound="from" />
  <CalendarDaysTrack bound="to" />
  <CalendarSelectedDates />
</Calendar>`,

  "calendar": `import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";

// Behavior lives in the config — compiled once, shared by every module.
const config = createCalendarConfig({
  mode: "single",          // "single" | "multiple" | "range" | "multi-range"
  unit: "day",             // "day" | "week" | "month"
  locale: "en-US",         // BCP 47 — month names, weekday labels, week start
  min: new Date(),         // nothing before today is selectable
  disabled: { weekends: true },
});

<Calendar
  config={config}
  value={date}
  onChange={(value, details) => setDate(value as Date | null)}
  theme="dracula"          // built-in name, or an imported ThemeFamily object
  appearance={soft}        // built-in name, imported object, or createAppearance()
  scheme="auto"            // "auto" | "light" | "dark"
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`,

  "calendar-nav": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarHome />
    <CalendarToolbarClear />
  </CalendarToolbar>
</Calendar>`,

  "calendar-days": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarDays highlightWeekends weekNumbers todayDot />
</Calendar>`,

  "calendar-time-grid": `const config = createCalendarConfig({ withTime: true });

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarTimeWheel seconds labels="long" step={{ minute: 5 }} />
</Calendar>`,

  "calendar-presets": `import { Calendar, commonPresets, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarPresets } from "@dateforge/react-calendar/modules";

const config = createCalendarConfig({ mode: "range" });

<Calendar config={config} value={range} onChange={handleChange}>
  <CalendarPresets presets={commonPresets} />
</Calendar>`,

  "calendar-selected-dates": `<Calendar config={rangeConfig} value={range} onChange={handleChange}>
  <CalendarSelectedDates allowClear allowNavigate showTime />
</Calendar>`,

  "calendar-manual-input": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarManualInput allowClear />
</Calendar>`,

  "calendar-info": `<Calendar config={rangeConfig} value={range} onChange={handleChange}>
  <CalendarDays />
  <CalendarInfo showRelative showSummary rangeStyle="duration" />
</Calendar>`,

  "calendar-days-track": `<Calendar config={rangeConfig} value={range} onChange={handleChange}>
  <CalendarDaysTrack bound="from" showMonthLabel />
  <CalendarDaysTrack bound="to" showMonthLabel />
</Calendar>`,

  "calendar-months-track": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarMonthsTrack short showYearLabel />
</Calendar>`,

  "calendar-years-track": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarYearsTrack />
</Calendar>`,

  "calendar-months-grid": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarMonthsGrid short />
</Calendar>`,

  "calendar-years-grid": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarYearsGrid showControls yearsPerPage={12} />
</Calendar>`,

  "disabled-dates": `import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";

const config = createCalendarConfig({
  disabled: {
    weekends: true,
    before: new Date(),
    dates: [new Date(2026, 5, 10), new Date(2026, 5, 11)],
  },
});

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`,

  "holiday-presets": `import { type PresetInput } from "@dateforge/react-calendar";

const holidayPresets: PresetInput[] = [
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
    getValue: ({ now }) => {
      const daysToSat = ((6 - now.getDay() + 7) % 7) || 7;
      const sat = new Date(now);
      sat.setDate(now.getDate() + daysToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
      return { from: sat, to: sun };
    },
  },
];

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarPresets presets={holidayPresets} />
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`,

  "monsoon-theme": `import { monsoon } from "@dateforge/react-calendar/themes";

<Calendar config={config} theme={monsoon}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>

{/* Or by name — every built-in family works as a string */}
<Calendar config={config} theme="monsoon" />`,

  "custom-theme": `import { Calendar, createTheme } from "@dateforge/react-calendar";

// Shared tokens apply to both variants.
// light / dark keys override per variant.
const brandTheme = createTheme({
  accent:  "#1ad980",
  range:   "#a7f3d0",
  weekend: "#dc2626",
  light: {
    backdrop: "#ffffff",
    text:     "#18181b",
    tone:     "#f0fdf4",
    stroke:   "#d4d4d8",
  },
  dark: {
    backdrop: "#0a1a12",
    text:     "#f0fdf4",
    tone:     "#14532d",
    stroke:   "#166534",
  },
});

<Calendar config={config} theme={brandTheme}>  {/* scheme="auto" — follows the OS */}
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>

<Calendar config={config} theme={brandTheme} scheme="dark" />   {/* always dark variant */}
<Calendar config={config} theme={brandTheme} scheme="light" />  {/* always light variant */}`,

  "bubble-appearance": `import { bubble } from "@dateforge/react-calendar/appearances";

<Calendar config={config} appearance={bubble}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>

{/* Or by name */}
<Calendar config={config} appearance="bubble" />`,

  "calendar-months-wheel": `<Calendar config={rangeConfig} value={range} onChange={handleChange}>
  <CalendarMonthsWheel showLabel showReset />
</Calendar>`,

  "calendar-years-wheel": `<Calendar config={rangeConfig} value={range} onChange={handleChange}>
  <CalendarYearsWheel showLabel showReset />
</Calendar>`,

  "theme-toggle": `import { nebula } from "@dateforge/react-calendar/themes";

<Calendar config={config} theme={nebula} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarThemeToggle />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`,

  "per-module-themes": `import { snow } from "@dateforge/react-calendar/themes";

// Calendar = snow (light). Toolbar overrides to noir dark.
// CalendarInfo overrides to nebula. Days inherit snow from Calendar.
// Modules take a STRING theme name (+ optional scheme); objects stay on the root.
<Calendar config={config} theme={snow} scheme="light" value={date} onChange={handleChange}>
  <CalendarToolbar theme="noir" scheme="dark">
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarInfo theme="nebula" showSummary showRelative />
</Calendar>`,

  "calendar-lunar": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarLunar />
</Calendar>`,

  "prebuilt": `import { useState } from "react";
import {
  SimpleCalendar,
  DatePicker,
  MonthPicker,
  MultiMonthCalendar,
} from "@dateforge/react-calendar/prebuilt";

const [date, setDate] = useState<Date | null>(null);

// Plain-Date props — no config, no composition
<SimpleCalendar value={date} onChange={setDate} />          // header + day grid
<DatePicker onChange={setDate} />                           // typed input + grid + Today jump
<MonthPicker onChange={setMonth} />                         // year stepper + 12-month grid
<MultiMonthCalendar months={6} cols={3} mode="range" />     // 6-month range board`,

  "prebuilt-simple": `import { useState } from "react";
import { SimpleCalendar } from "@dateforge/react-calendar/prebuilt";

const [date, setDate] = useState<Date | null>(null);

// The default calendar: month/year navigation header + day grid.
<SimpleCalendar value={date} onChange={setDate} />

// Same shared props everywhere: locale, min/max, disabled, readOnly,
// theme, appearance, gradient, scheme, and a config escape hatch.
<SimpleCalendar
  defaultValue={new Date()}
  locale="de-DE"
  min={new Date()}
  theme="noir"
  appearance="zenith"
/>`,

  "prebuilt-datepicker": `import { useState } from "react";
import { DatePicker } from "@dateforge/react-calendar/prebuilt";

const [date, setDate] = useState<Date | null>(null);

// Typed, segment-based input above the grid, plus a Today jump —
// keyboard-first entry with the grid as fallback.
<DatePicker value={date} onChange={setDate} disabled={{ weekends: true }} />`,

  "prebuilt-monthpicker": `import { useState } from "react";
import { MonthPicker } from "@dateforge/react-calendar/prebuilt";

const [month, setMonth] = useState<Date | null>(null);

// Year-stepping header + 12-month grid (unit: "month" under the hood).
// Picking a month selects the whole month, reported as its first day.
<MonthPicker value={month} onChange={setMonth} />`,

  "prebuilt-multimonth": `import { MultiMonthCalendar } from "@dateforge/react-calendar/prebuilt";

// 3/6/12 consecutive months in a grid, generated on the fly.
// One shared selection spans the whole board — ranges drag across months.
<MultiMonthCalendar
  months={6}
  cols={3}
  mode="range"
  startMonth={new Date(2026, 6, 1)}
  onChange={(range, details) => console.log(range, details.reason)}
/>`,

  "week-selection": `const config = createCalendarConfig({ unit: "week" });

// One click selects the whole week.
// value: { start: Date; end: Date } | null
<Calendar config={config} value={week} onChange={(value) => setWeek(value as { start: Date; end: Date } | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays weekNumbers />
</Calendar>`,

  "multi-range": `const config = createCalendarConfig({ mode: "multi-range", maxRanges: 3 });

// value: { start: Date; end: Date }[]
<Calendar config={config} value={ranges} onChange={(value) => setRanges(value as { start: Date; end: Date }[])}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear allowClearPerChip />
</Calendar>`,

  "exclude-business-days": `const config = createCalendarConfig({
  mode: "range",
  exclude: { weekends: true },           // cut from emitted spans, still spannable
  excludedEndpointPolicy: "snap-inward", // or "reject"
});

<Calendar
  config={config}
  value={range}
  onChange={(value, details) => {
    setRange(value as { start: Date; end: Date } | null);
    // value = the logical span the user drew;
    // details.segments = the surviving business-day segments
    console.log(details.segments);
  }}
>
  <CalendarDays />
  <CalendarSelectedDates allowClear />
</Calendar>`,

  "time-window": `const config = createCalendarConfig({
  withTime: true,
  defaultTime: { hour: 9 },   // applied to a freshly picked day
  minTime: { hour: 9 },       // inclusive wall-clock floor for every day
  maxTime: { hour: 18 },      // inclusive ceiling — drums and steppers gate to it
});

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarDays />
  <CalendarTimeWheel labels="short" />
</Calendar>`,

  "time-zone": `const config = createCalendarConfig({
  timeZone: "Asia/Tokyo", // IANA zone — "today" resolves in Tokyo, not the browser zone
});

// The today dot, CalendarToolbarHome, and presetToday all agree on
// what "today" means, even across the date line.
<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarDays />
</Calendar>`,

  "labels-registry": `<Calendar
  config={config}
  labels={{
    clear: "Clear booking date",
    calendarNavigation: "Booking date navigation",
    previousMonth: "Show previous booking month",
    nextMonth: "Show next booking month",
    removeSelectedDate: "Remove booking date",
  }}
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  {/* module-level overrides win over root labels */}
  <CalendarDays weekNumbers weekLabel="ISO week" />
  <CalendarSelectedDates allowClear clearLabel="Clear all booking dates" />
</Calendar>`,

  "week-numbers": `<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarDays
    weekNumbers                {/* ISO week-number column */}
    weekdayFormat="narrow"     {/* "M" instead of "Mon" */}
    showOutsideDays={false}    {/* hide neighbour-month days */}
    fixedWeeks={false}         {/* rows shrink to the month */}
  />
</Calendar>`,

  "scheme-control": `const [scheme, setScheme] = useState<"light" | "dark">("light");

// Controlled: the toolbar toggle calls onSchemeChange instead of flipping
// internal state — keep it in sync with your app-level dark mode.
<Calendar config={config} scheme={scheme} onSchemeChange={setScheme}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarThemeToggle />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`,
} as const;

export type CodeSampleKey = keyof typeof codeSamples;
