"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Clipboard, Palette, Sparkles } from "lucide-react";
import {
  Calendar,
  calendarDate,
  createAppearance,
  createCalendarConfig,
  createDisabled,
  createTheme,
  type CalendarDate,
  type PresetInput,
} from "@dateforge/react-calendar";
import {
  CalendarDays,
  CalendarDaysTrack,
  CalendarInfo,
  CalendarManualInput,
  CalendarMonthsGrid,
  CalendarMonthsTrack,
  CalendarPresets,
  CalendarSelectedDates,
  CalendarYearsGrid,
  CalendarYearsTrack,
} from "@dateforge/react-calendar/modules";
import type { DayRenderState } from "@dateforge/react-calendar/modules/days";
import {
  DatePicker,
  MonthPicker,
  MultiMonthCalendar,
  SimpleCalendar,
} from "@dateforge/react-calendar/prebuilt";
import { CalendarLunar } from "@dateforge/react-calendar/modules/lunar";
import { CalendarMonthsWheel } from "@dateforge/react-calendar/modules/months-wheel";
import { CalendarTimeWheel } from "@dateforge/react-calendar/modules/time";
import {
  CalendarToolbar,
  CalendarToolbarClear,
  CalendarToolbarClock,
  CalendarToolbarGroup,
  CalendarToolbarHome,
  CalendarToolbarLabel,
  CalendarToolbarMonthLabel,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarPrev,
  CalendarToolbarThemeToggle,
  CalendarToolbarYearLabel,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";
import {
  bubble,
  compact,
  loft,
  soft,
  square,
} from "@dateforge/react-calendar/appearances";
import {
  aurora,
  chalk,
  fjord,
  graphite,
  industrial,
  meadow,
  nebula,
  mint,
  prism,
  riso,
  snow,
  temporal,
  velvet,
} from "@dateforge/react-calendar/themes";
import { InstallSnippet } from "../InstallSnippet";
import { ScrollToTop } from "../ScrollToTop";
import { SiteHeader } from "../SiteHeader";

type RangeValue = { start: Date; end: Date } | null;

const emptyRange = (): RangeValue => null;

const MEETING_ZONES = [
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Berlin", tz: "Europe/Berlin" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
] as const;

// ── renderDay helpers (from compositions/days-render-day stories) ─────────────

// Deterministic per-day pseudo-random in [0, 1) — same date always yields the
// same value so demos are stable across reloads. renderDay hands us the
// library's CalendarDate ({ year, month, day }, month 1-12).
const seededRandom = (d: CalendarDate): number => {
  const seed = d.year * 10000 + d.month * 100 + d.day;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const dayContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  width: "100%",
  height: "100%",
  fontSize: 11,
  lineHeight: 1.1,
};

const dayNumberStyle = (state: DayRenderState): React.CSSProperties => ({
  fontWeight: state.today || state.selected ? 700 : 500,
  fontSize: 13,
});

// Out-of-month cells: render only the day number. The Calendar's built-in
// outside-day styling handles the muted text color.
const renderOtherMonth = (date: CalendarDate, state: DayRenderState) => (
  <span style={dayContainerStyle}>
    <span style={dayNumberStyle(state)}>{date.day}</span>
  </span>
);

// Weather — emoji icon per day
const WEATHER_ICONS = ["☀️", "⛅", "☁️", "🌧", "⛈", "❄️"] as const;
const weatherFor = (date: CalendarDate) =>
  WEATHER_ICONS[Math.floor(seededRandom(date) * WEATHER_ICONS.length)];

// Heatmap — activity intensity
const heatColor = (intensity: number): string => {
  const alpha = Math.min(0.85, 0.08 + intensity * 0.7);
  return `rgba(34, 139, 60, ${alpha})`;
};

// Ticket prices — green cheap, red expensive
const priceFor = (date: CalendarDate): number => {
  const base = 79;
  const noise = seededRandom(date);
  const dow = new Date(date.year, date.month - 1, date.day).getDay();
  const isWeekend = dow === 0 || dow === 6;
  return Math.round(base + noise * 220 + (isWeekend ? 60 : 0));
};

// Event dots — 1-3 dots on specific days
const EVENT_DAYS = new Set([3, 7, 14, 18, 22, 27]);
const eventCount = (date: CalendarDate): number => {
  if (!EVENT_DAYS.has(date.day)) return 0;
  return 1 + Math.floor(seededRandom(date) * 3);
};

export default function ExamplesPage() {
  const [basicDate, setBasicDate] = useState<Date | null>(null);
  const [pinnedDate, setPinnedDate] = useState<Date | null>(null);
  const [stayRange, setStayRange] = useState<RangeValue>(emptyRange);
  // Seed a range so the from/to bound tracks show different dates right away —
  // with an empty selection both bounds fall back to the shared view date.
  const [flightRange, setFlightRange] = useState<RangeValue>(() => {
    const today = startOfDay(new Date());
    return { start: addDays(today, 7), end: addDays(today, 14) };
  });
  const [twoMonthRange, setTwoMonthRange] = useState<RangeValue>(emptyRange);
  const [reportRange, setReportRange] = useState<RangeValue>(emptyRange);
  const [singlePresetDate, setSinglePresetDate] = useState<Date | null>(null);
  const [holidayRange, setHolidayRange] = useState<Date[]>([]);
  const [brandDate, setBrandDate] = useState<Date | null>(null);
  const [moduleThemeDate, setModuleThemeDate] = useState<Date | null>(null);
  const [denseRange, setDenseRange] = useState<RangeValue>(emptyRange);
  const [vacationRange, setVacationRange] = useState<RangeValue>(emptyRange);
  const [sprintRange, setSprintRange] = useState<RangeValue>(emptyRange);
  const [blackoutRange, setBlackoutRange] = useState<RangeValue>(emptyRange);
  const [deliveryDates, setDeliveryDates] = useState<Date[]>([]);
  const [dropDate, setDropDate] = useState<Date | null>(null);
  const [appointment, setAppointment] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  });
  const [globalMeeting, setGlobalMeeting] = useState<Date | null>(null);
  const [manualDate, setManualDate] = useState<Date | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(new Date(1994, 5, 14));
  const [archiveYear, setArchiveYear] = useState<Date | null>(null);
  const [campaignMonth, setCampaignMonth] = useState<Date | null>(null);
  const [meetingTime, setMeetingTime] = useState<Date | null>(null);
  const [weatherDate, setWeatherDate] = useState<Date | null>(null);
  const [heatmapDate, setHeatmapDate] = useState<Date | null>(null);
  const [priceDate, setPriceDate] = useState<Date | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [prebuiltDate, setPrebuiltDate] = useState<Date | null>(null);
  const [pickerDate, setPickerDate] = useState<Date | null>(null);
  const [pickedMonth, setPickedMonth] = useState<Date | null>(null);
  const [weekSpan, setWeekSpan] = useState<RangeValue>(null);
  const [shiftRanges, setShiftRanges] = useState<{ start: Date; end: Date }[]>(
    [],
  );
  const [bizRange, setBizRange] = useState<RangeValue>(null);
  const [bizSegments, setBizSegments] = useState<number | null>(null);
  const [deDate, setDeDate] = useState<Date | null>(null);
  const [schemeDate, setSchemeDate] = useState<Date | null>(null);
  const [drumDate, setDrumDate] = useState<Date | null>(null);
  const [slotTime, setSlotTime] = useState<Date | null>(null);
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const launchDate = useMemo(() => new Date(2026, 8, 9), []);
  const sixMonthDates = useMemo(
    () => [
      new Date(2026, 4, 8),
      new Date(2026, 4, 17),
      new Date(2026, 5, 4),
      new Date(2026, 5, 22),
      new Date(2026, 6, 9),
      new Date(2026, 6, 28),
      new Date(2026, 7, 13),
      new Date(2026, 7, 26),
      new Date(2026, 8, 10),
      new Date(2026, 8, 24),
      new Date(2026, 9, 6),
      new Date(2026, 9, 21),
    ],
    [],
  );

  const today = useMemo(() => startOfDay(new Date()), []);
  const noPast = useMemo(() => createDisabled({ before: today }), [today]);
  const weekdaysOnly = useMemo(
    () => createDisabled({ weekends: true, before: today }),
    [today],
  );
  const blackout = useMemo(
    () =>
      createDisabled({
        weekends: true,
        before: today,
        ranges: [{ from: addDays(today, 8), to: addDays(today, 12) }],
        dates: [addDays(today, 15)],
      }),
    [today],
  );
  const dropDisabled = useMemo(
    () =>
      createDisabled({
        dates: [new Date(2026, 6, 12), new Date(2026, 6, 15)],
        weekdays: [0, 6],
      }),
    [],
  );
  // Range mode accepts only range-kind presets (value + range, or getValue
  // returning { from, to }); plain date presets render disabled there.
  const stayPresets = useMemo<PresetInput[]>(
    () => [
      { label: "Tonight", value: 0, range: 1 },
      {
        id: "next-weekend",
        label: "Weekend",
        getValue: ({ now }) => {
          const sat = new Date(now);
          const daysToSat = (6 - sat.getDay() + 7) % 7 || 7;
          sat.setDate(sat.getDate() + daysToSat);
          const sun = new Date(sat);
          sun.setDate(sat.getDate() + 1);
          return { from: sat, to: sun };
        },
      },
      { label: "Week stay", value: 0, range: 6 },
      { label: "Two weeks", value: 0, range: 13 },
    ],
    [],
  );
  const analyticsPresets = useMemo<PresetInput[]>(
    () => [
      { label: "Today", value: 0, range: 0 },
      { label: "Last 7 days", value: -6, range: 6 },
      { label: "Last 30 days", value: -29, range: 29 },
      { label: "Quarter", value: new Date(2026, 0, 1), range: 89 },
    ],
    [],
  );
  const sprintPresets = useMemo<PresetInput[]>(
    () => [
      { label: "Current sprint", value: 0, range: 13 },
      { label: "Next sprint", value: 14, range: 13 },
      { label: "Release week", value: 28, range: 6 },
    ],
    [],
  );
  const supportPresets = useMemo<PresetInput[]>(
    () => [
      { label: "Today", value: 0 },
      { label: "Tomorrow", value: 1 },
      { label: "In 3 days", value: 3 },
      {
        id: "next-monday",
        label: "Next Monday",
        getValue: ({ now }) => {
          const date = new Date(now);
          const delta = (8 - date.getDay()) % 7 || 7;
          date.setDate(date.getDate() + delta);
          return date;
        },
      },
    ],
    [],
  );
  const holidayPresets = useMemo<PresetInput[]>(
    () => [
      {
        id: "new-year",
        label: "New Year",
        getValue: ({ now }) => {
          const year =
            now.getMonth() > 0 || now.getDate() > 1
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 0, 1);
          return date;
        },
      },
      {
        id: "independence-day",
        label: "Independence Day",
        getValue: ({ now }) => {
          const year =
            now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 4)
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 6, 4);
          return date;
        },
      },
      {
        id: "christmas-day",
        label: "Christmas Day",
        getValue: ({ now }) => {
          const year =
            now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 25)
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 11, 25);
          return date;
        },
      },
      {
        id: "thanksgiving-day",
        label: "Thanksgiving",
        getValue: ({ now }) => {
          const year =
            now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
          const date = nthWeekdayOfMonth(year, 10, 4, 4);
          return date;
        },
      },
      {
        id: "christmas-eve",
        label: "Christmas Eve",
        getValue: ({ now }) => {
          const year =
            now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 24)
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 11, 24);
          return date;
        },
      },
      {
        id: "black-friday",
        label: "Black Friday",
        getValue: ({ now }) => {
          const year =
            now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
          const date = nthWeekdayOfMonth(year, 10, 4, 4);
          date.setDate(date.getDate() + 1);
          return date;
        },
      },
    ],
    [],
  );
  const brandTheme = useMemo(
    () =>
      createTheme({
        accent: "#7c3aed",
        focusRing: "#ede9fe",
        range: "#ddd6fe",
        weekend: "#db2777",
        light: {
          backdrop: "#faf5ff",
          tone: "#f3e8ff",
          text: "#3b0764",
          stroke: "#e9d5ff",
        },
        dark: {
          backdrop: "#1a0b2e",
          tone: "#2e1065",
          text: "#f5f3ff",
          stroke: "#4c1d95",
        },
      }),
    [],
  );

  // v3.2: a createTheme object can go straight on a module, not just the root.
  const railTheme = useMemo(
    () =>
      createTheme({
        accent: "#f97316",
        range: "#fed7aa",
        light: {
          backdrop: "#1c1917",
          tone: "#292524",
          text: "#fafaf9",
          stroke: "#44403c",
        },
        dark: {
          backdrop: "#0c0a09",
          tone: "#1c1917",
          text: "#fafaf9",
          stroke: "#292524",
        },
      }),
    [],
  );
  const denseAppearance = useMemo(
    () =>
      createAppearance({
        radius: "5px",
        spacing: "0.42em",
        fontSize: "13px",
        dayHeight: "2.2em",
        transition: "120ms ease",
      }),
    [],
  );

  const singleCfg = useMemo(() => createCalendarConfig(), []);
  const rangeCfg = useMemo(() => createCalendarConfig({ mode: "range" }), []);
  const multipleCfg = useMemo(
    () => createCalendarConfig({ mode: "multiple" }),
    [],
  );
  const rangeNoPastCfg = useMemo(
    () => createCalendarConfig({ mode: "range", disabled: noPast }),
    [noPast],
  );
  const sixMonthCfg = useMemo(
    () => createCalendarConfig({ mode: "multiple", readOnly: true }),
    [],
  );
  const deliveryCfg = useMemo(
    () =>
      createCalendarConfig({
        mode: "multiple",
        maxDates: 4,
        disabled: weekdaysOnly,
      }),
    [weekdaysOnly],
  );
  const dropCfg = useMemo(
    () =>
      createCalendarConfig({
        min: new Date(2026, 6, 10),
        max: new Date(2026, 6, 18),
        disabled: dropDisabled,
      }),
    [dropDisabled],
  );
  const appointmentCfg = useMemo(
    () => createCalendarConfig({ withTime: true, disabled: weekdaysOnly }),
    [weekdaysOnly],
  );
  const vacationCfg = useMemo(
    () =>
      createCalendarConfig({
        mode: "range",
        disabled: weekdaysOnly,
        minSpan: 2,
        maxSpan: 21,
      }),
    [weekdaysOnly],
  );
  const invoiceCfg = useMemo(
    () =>
      createCalendarConfig({
        locale: "de-DE",
        min: new Date(2026, 4, 1),
        max: new Date(2026, 7, 31),
      }),
    [],
  );
  const archiveCfg = useMemo(
    () =>
      createCalendarConfig({
        min: new Date(2018, 0, 1),
        max: new Date(2030, 11, 31),
      }),
    [],
  );
  const timeCfg = useMemo(() => createCalendarConfig({ withTime: true }), []);
  const globalCfg = useMemo(
    () =>
      createCalendarConfig({
        withTime: true,
        hour12: true,
        timeZone: "America/New_York",
        disabled: noPast,
      }),
    [noPast],
  );
  const blackoutCfg = useMemo(
    () => createCalendarConfig({ mode: "range", disabled: blackout }),
    [blackout],
  );
  const readOnlyCfg = useMemo(
    () => createCalendarConfig({ readOnly: true }),
    [],
  );
  const weekCfg = useMemo(() => createCalendarConfig({ unit: "week" }), []);
  const slotCfg = useMemo(
    () => createCalendarConfig({ withTime: true, defaultTime: { hour: 9 } }),
    [],
  );
  const multiRangeCfg = useMemo(
    () => createCalendarConfig({ mode: "multi-range", maxRanges: 3 }),
    [],
  );
  const bizCfg = useMemo(
    () =>
      createCalendarConfig({
        mode: "range",
        exclude: { weekends: true },
        excludedEndpointPolicy: "snap-inward",
      }),
    [],
  );
  const deCfg = useMemo(() => createCalendarConfig({ locale: "de-DE" }), []);

  return (
    <main className="min-h-screen bg-[#fbfbfd] text-zinc-950">
      <div className="mx-auto w-full px-5 py-4 sm:px-8 xl:px-10">
        <div className="mx-auto max-w-6xl">
          <SiteHeader />

          <section className="py-10 text-center sm:py-12">
            <p className="text-sm font-medium text-zinc-500">Examples</p>
            <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl lg:max-w-none lg:whitespace-nowrap">
              Likely one of these fits your case.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              These are just starting points. Mix the modules however you like —
              booking, dashboards, forms, scheduling, whatever your product
              needs. Storybook is the open playground; this page is finished
              recipes you can copy and tweak.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <InstallSnippet />
            </div>

            <nav
              aria-label="Jump to examples by keyword"
              className="mx-auto mt-8 max-w-4xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Browse by keyword
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {getTagNav().map(({ tag, slug }) => (
                  <a
                    key={tag}
                    href={`#${slug}`}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </nav>
          </section>
        </div>

        <div className="-mx-5 flex flex-col gap-5 sm:mx-auto sm:max-w-[1720px]">
          <ExampleCard
            title="SimpleCalendar"
            useWhen="You need a working date picker in one line, today."
            demonstrates={`The flagship prebuilt: navigation header + day grid, plain-Date props. Same shared props everywhere — \`locale\`, \`min\`/\`max\`, \`disabled\`, \`theme\`, \`appearance\`, \`scheme\`, \`gradient\`.`}
            code={`import { SimpleCalendar } from "@dateforge/react-calendar/prebuilt";

const [date, setDate] = useState<Date | null>(null);

<SimpleCalendar value={date} onChange={setDate} />

// Dress it up without composing anything:
<SimpleCalendar
  defaultValue={new Date()}
  min={new Date()}
  theme="noir"
  appearance="zenith"
  gradient
/>`}
          >
            <SimpleCalendar value={prebuiltDate} onChange={setPrebuiltDate} />
          </ExampleCard>

          <ExampleCard
            title="DatePicker"
            useWhen="Forms where users type the date as often as they click it."
            demonstrates={`Prebuilt with a typed, segment-based input above the grid plus a Today jump — keyboard-first entry, grid as fallback.`}
            code={`import { DatePicker } from "@dateforge/react-calendar/prebuilt";

const [date, setDate] = useState<Date | null>(null);

<DatePicker value={date} onChange={setDate} />

// Rules work the same as everywhere else:
<DatePicker onChange={setDate} disabled={{ weekends: true }} />

// Clear button in the input is on by default — opt out:
<DatePicker onChange={setDate} allowClear={false} />`}
          >
            <DatePicker value={pickerDate} onChange={setPickerDate} />
          </ExampleCard>

          <ExampleCard
            title="MonthPicker"
            useWhen="Billing periods, campaign months, or season selectors."
            demonstrates={`Prebuilt month selector: year-stepping header + 12-month grid (\`unit: "month"\` under the hood). Picking a month selects the whole month, reported as its first day.`}
            code={`import { MonthPicker } from "@dateforge/react-calendar/prebuilt";

const [month, setMonth] = useState<Date | null>(null);

// onChange reports the first day of the picked month (or null).
<MonthPicker value={month} onChange={setMonth} />`}
          >
            <MonthPicker value={pickedMonth} onChange={setPickedMonth} />
          </ExampleCard>

          <ExampleCard
            wide
            title="Quarter board"
            useWhen="Roadmaps, quarters, or long bookings that need several months at once."
            demonstrates={`\`MultiMonthCalendar\` — a 3-month range board generated from one prop set; one shared selection drags across months.`}
            appearance="compact"
            code={`import { MultiMonthCalendar } from "@dateforge/react-calendar/prebuilt";

<MultiMonthCalendar
  months={3}
  cols={3}
  mode="range"
  startMonth={new Date(2026, 6, 1)}
/>`}
          >
            <MultiMonthCalendar
              months={3}
              cols={3}
              mode="range"
              startMonth={new Date(2026, 6, 1)}
            />
          </ExampleCard>

          <ExampleCard
            title="The basics"
            useWhen="You're starting a new flow and just need a working date picker."
            demonstrates="Bare minimum composition — Calendar shell + nav + days + selected dates."
            code={`const [basicDate, setBasicDate] = useState<Date | null>(new Date());

const config = createCalendarConfig();

<Calendar config={config} value={basicDate} onChange={(value) => setBasicDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear={false} />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={basicDate}
              onChange={(value) => setBasicDate(value as Date | null)}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear={false} />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Week picker"
            useWhen="Timesheets, weekly reports, or anything that snaps to whole weeks."
            demonstrates={`\`unit: "week"\` — one click selects the whole week and emits a \`{ start, end }\` span.`}
            theme="fjord"
            appearance="soft"
            code={`const config = createCalendarConfig({ unit: "week" });
const [week, setWeek] = useState<{ start: Date; end: Date } | null>(null);

<Calendar config={config} value={week} onChange={(value) => setWeek(value as { start: Date; end: Date } | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays weekNumbers />
  <CalendarInfo showSummary rangeStyle="duration" />
</Calendar>`}
          >
            <Calendar
              config={weekCfg}
              value={weekSpan}
              onChange={(value) => setWeekSpan(value as RangeValue)}
              theme={fjord}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays weekNumbers />
              <CalendarInfo showSummary rangeStyle="duration" />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Shift blocks"
            useWhen="Rotas, maintenance windows, or anything collecting several separate ranges."
            demonstrates={`\`mode: "multi-range"\` with \`maxRanges\` — several \`{ start, end }\` spans, chips with per-span removal.`}
            theme="industrial"
            appearance="compact"
            code={`const config = createCalendarConfig({ mode: "multi-range", maxRanges: 3 });
const [shifts, setShifts] = useState<{ start: Date; end: Date }[]>([]);

<Calendar config={config} value={shifts} onChange={(value) => setShifts(value as { start: Date; end: Date }[])}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear allowClearPerChip allowNavigate />
</Calendar>`}
          >
            <Calendar
              config={multiRangeCfg}
              value={shiftRanges}
              onChange={(value) =>
                setShiftRanges(value as { start: Date; end: Date }[])
              }
              theme={industrial}
              appearance={compact}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear allowClearPerChip allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Business days"
            useWhen="SLAs, delivery estimates, or any flow counting working days only."
            demonstrates={`\`exclude: { weekends: true }\` — weekends stay spannable but are cut from the emitted value; \`details.segments\` reports the working-day blocks.`}
            theme="meadow"
            appearance="soft"
            code={`const config = createCalendarConfig({
  mode: "range",
  exclude: { weekends: true },           // cut from emitted spans
  excludedEndpointPolicy: "snap-inward", // or "reject"
});

const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
const [segments, setSegments] = useState<number | null>(null);

<Calendar
  config={config}
  value={range}
  onChange={(value, details) => {
    setRange(value as { start: Date; end: Date } | null);
    setSegments(details.segments?.length ?? null);
  }}
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays highlightWeekends />
  <CalendarInfo showSummary rangeStyle="days" />
</Calendar>

{segments !== null && <p>{segments} working-day block(s) in the selection</p>}`}
          >
            <Calendar
              config={bizCfg}
              value={bizRange}
              onChange={(value, details) => {
                setBizRange(value as RangeValue);
                setBizSegments(details.segments?.length ?? null);
              }}
              theme={meadow}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays highlightWeekends />
              <CalendarInfo showSummary rangeStyle="days" />
            </Calendar>
            <p
              aria-live="polite"
              className="mt-3 text-center text-sm font-medium text-zinc-600"
            >
              {bizSegments !== null
                ? `${bizSegments} working-day block${bizSegments === 1 ? "" : "s"} in the selection`
                : "Drag a range across a weekend"}
            </p>
          </ExampleCard>

          <ExampleCard
            title="German locale + labels"
            useWhen="Localized products where every visible and screen-reader string must match the language."
            demonstrates={`\`locale\` drives names/digits/week start via Intl; the \`labels\` registry localizes every aria-label in one place.`}
            theme="chalk"
            appearance="square"
            code={`const config = createCalendarConfig({ locale: "de-DE" });

<Calendar
  config={config}
  value={date}
  onChange={(value) => setDate(value as Date | null)}
  labels={{
    clear: "Löschen",
    previousMonth: "Vorheriger Monat",
    nextMonth: "Nächster Monat",
    selectMonth: "Monat wählen",
    selectYear: "Jahr wählen",
  }}
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays weekNumbers weekLabel="KW" weekdayFormat="narrow" />
</Calendar>`}
          >
            <Calendar
              config={deCfg}
              value={deDate}
              onChange={(value) => setDeDate(value as Date | null)}
              labels={{
                clear: "Löschen",
                previousMonth: "Vorheriger Monat",
                nextMonth: "Nächster Monat",
                selectMonth: "Monat wählen",
                selectYear: "Jahr wählen",
              }}
              theme={chalk}
              appearance={square}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays weekNumbers weekLabel="KW" weekdayFormat="narrow" />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Controlled scheme"
            useWhen="The calendar must follow your app's own light/dark state."
            demonstrates={`Controlled \`scheme\` + \`onSchemeChange\` — the built-in toggle reports the next scheme instead of flipping itself.`}
            theme="velvet"
            appearance="loft"
            code={`const config = createCalendarConfig();
const [scheme, setScheme] = useState<"light" | "dark">("light");

<Calendar
  config={config}
  value={date}
  onChange={(value) => setDate(value as Date | null)}
  scheme={scheme}
  onSchemeChange={setScheme}
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarThemeToggle />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={schemeDate}
              onChange={(value) => setSchemeDate(value as Date | null)}
              scheme={scheme}
              onSchemeChange={setScheme}
              theme={velvet}
              appearance={loft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarThemeToggle />
              </CalendarToolbar>
              <CalendarDays />
            </Calendar>
            <p className="mt-3 text-center text-sm font-medium text-zinc-600">
              App-side scheme: <span className="font-semibold">{scheme}</span>
            </p>
          </ExampleCard>

          <ExampleCard
            title="Pinned toolbar actions"
            useWhen="A crowded toolbar that must stay tidy at any width."
            demonstrates={`The default toolbar is a wrapping flex row — overflow wraps to the next line instead of escaping the container. \`CalendarToolbarGroup push="end"\` pins the actions to the inline end regardless of what shares the row.`}
            theme="graphite"
            code={`const config = createCalendarConfig();
const [date, setDate] = useState<Date | null>(null);

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarYearTrigger />
    <CalendarToolbarNext />
    {/* Rides the right edge; wraps as one unit when space runs out */}
    <CalendarToolbarGroup push="end">
      <CalendarToolbarHome />
      <CalendarToolbarClear />
      <CalendarToolbarThemeToggle />
    </CalendarToolbarGroup>
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={pinnedDate}
              onChange={(value) => setPinnedDate(value as Date | null)}
              theme={graphite}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarGroup push="end">
                  <CalendarToolbarHome />
                  <CalendarToolbarClear />
                  <CalendarToolbarThemeToggle />
                </CalendarToolbarGroup>
              </CalendarToolbar>
              <CalendarDays />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Stay booking"
            useWhen="Lodging or short-stay rentals where guests pick check-in and check-out."
            demonstrates="Range mode with disabled past dates, quick-stay presets, a nights counter via CalendarInfo, and an animated summary."
            appearance="soft"
            code={`const [stayRange, setStayRange] = useState<{ start: Date; end: Date } | null>(null);

const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, []);

// Range mode wants range-kind presets: value + range, or getValue
// returning { from, to }. Plain date presets show up disabled here.
const stayPresets = useMemo<PresetInput[]>(
  () => [
    { label: "Tonight", value: 0, range: 1 },
    {
      id: "next-weekend",
      label: "Weekend",
      getValue: ({ now }) => {
        const sat = new Date(now);
        const daysToSat = (6 - sat.getDay() + 7) % 7 || 7;
        sat.setDate(sat.getDate() + daysToSat);
        const sun = new Date(sat);
        sun.setDate(sat.getDate() + 1);
        return { from: sat, to: sun };
      },
    },
    { label: "Week stay", value: 0, range: 6 },
    { label: "Two weeks", value: 0, range: 13 },
  ],
  [],
);

const config = createCalendarConfig({ mode: "range", disabled: noPast });

<Calendar config={config} value={stayRange} onChange={(value) => setStayRange(value as { start: Date; end: Date } | null)} appearance={soft}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarHome />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarPresets presets={stayPresets} />
  <CalendarInfo showSummary rangeStyle="duration" />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`}
          >
            <Calendar
              config={rangeNoPastCfg}
              value={stayRange}
              onChange={(value) => setStayRange(value as RangeValue)}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarYearTrigger compact />
                <CalendarToolbarHome />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarPresets presets={stayPresets} />
              <CalendarInfo showSummary rangeStyle="duration" />
              <CalendarSelectedDates allowClear allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            wide
            title="Flight search"
            useWhen="Booking flow needing departure and return without a full second month grid."
            demonstrates={`Split bound tracks (\`bound="from"\` / \`bound="to"\`) for compact range selection across two columns.`}
            theme="temporal"
            appearance="compact"
            code={`// Seed a range — with an empty selection both bound tracks
// fall back to the shared view date and look identical.
const [flightRange, setFlightRange] = useState<{ start: Date; end: Date } | null>(() => {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  const end = new Date();
  end.setDate(end.getDate() + 14);
  return { start, end };
});

const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, []);

const config = createCalendarConfig({ mode: "range", disabled: noPast });

<Calendar config={config} value={flightRange} onChange={(value) => setFlightRange(value as { start: Date; end: Date } | null)} theme={temporal} appearance={compact}>
  {/* Labels follow the range bounds — same dates the tracks below edit */}
  <CalendarToolbar col="full" cols={2}>
    <CalendarToolbarGroup col={1}>
      <CalendarToolbarLabel>Departure</CalendarToolbarLabel>
      <CalendarToolbarMonthLabel bound="from" />
      <CalendarToolbarYearLabel bound="from" />
    </CalendarToolbarGroup>
    <CalendarToolbarGroup col={1}>
      <CalendarToolbarLabel>Return</CalendarToolbarLabel>
      <CalendarToolbarMonthLabel bound="to" />
      <CalendarToolbarYearLabel bound="to" />
      <CalendarToolbarClear />
    </CalendarToolbarGroup>
  </CalendarToolbar>
  <CalendarMonthsTrack bound="from" short />
  <CalendarDaysTrack bound="from" />
  <CalendarMonthsTrack bound="to" short />
  <CalendarDaysTrack bound="to" />
  <CalendarSelectedDates col="full" allowClear />
</Calendar>`}
          >
            <Calendar
              config={rangeNoPastCfg}
              value={flightRange}
              onChange={(value) => setFlightRange(value as RangeValue)}
              theme={temporal}
              appearance={compact}
              style={{ width: "100%" }}
              cols={2}
            >
              <CalendarToolbar col="full" cols={2}>
                <CalendarToolbarGroup col={1}>
                  <CalendarToolbarLabel>Departure</CalendarToolbarLabel>
                  <CalendarToolbarMonthLabel bound="from" />
                  <CalendarToolbarYearLabel bound="from" />
                </CalendarToolbarGroup>
                <CalendarToolbarGroup col={1}>
                  <CalendarToolbarLabel>Return</CalendarToolbarLabel>
                  <CalendarToolbarMonthLabel bound="to" />
                  <CalendarToolbarYearLabel bound="to" />
                  <CalendarToolbarClear />
                </CalendarToolbarGroup>
              </CalendarToolbar>
              <CalendarMonthsTrack col={1} bound="from" />
              <CalendarMonthsTrack col={1} bound="to" />
              <CalendarDaysTrack col={1} bound="from" />
              <CalendarDaysTrack col={1} bound="to" />
              <CalendarSelectedDates col="full" />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Two-month stay search"
            useWhen="Desktop booking with side-by-side months and a single shared range."
            demonstrates={`\`cols={2}\` with two \`CalendarDays\` (offset 0 and 1) and one continuous range value.`}
            theme="snow"
            appearance="soft"
            code={`const [twoMonthRange, setTwoMonthRange] = useState<{ start: Date; end: Date } | null>(null);

const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, []);

const config = createCalendarConfig({ mode: "range", disabled: noPast });

<Calendar config={config} value={twoMonthRange} onChange={(value) => setTwoMonthRange(value as { start: Date; end: Date } | null)} cols={2}>
  <CalendarToolbar col="full">
    <CalendarToolbarPrev />
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
    <CalendarToolbarMonthLabel offset={1} />
    <CalendarToolbarYearLabel offset={1} />
    <CalendarToolbarNext />
  </CalendarToolbar>
  <CalendarDays col={1} />
  <CalendarDays offset={1} col={1} />
  <CalendarSelectedDates col="full" allowClear allowNavigate />
</Calendar>`}
            wide
          >
            <Calendar
              config={rangeNoPastCfg}
              value={twoMonthRange}
              onChange={(value) => setTwoMonthRange(value as RangeValue)}
              theme={snow}
              appearance={soft}
              cols={2}
              style={{ width: "100%" }}
            >
              <CalendarToolbar col="full">
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarMonthLabel offset={1} />
                <CalendarToolbarYearLabel offset={1} />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays col={1} />
              <CalendarDays offset={1} col={1} />
              <CalendarSelectedDates col="full" allowClear allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Six-month availability"
            useWhen="Showing read-only open slots across half a year."
            demonstrates={`Read-only multiple-mode with a 3-column 6-month grid and \`defaultViewDate\`.`}
            theme="industrial"
            appearance="compact"
            code={`const sixMonthDates = useMemo(
  () => [
    new Date(2026, 4, 8),
    new Date(2026, 4, 17),
    new Date(2026, 5, 4),
    new Date(2026, 5, 22),
    new Date(2026, 6, 9),
    new Date(2026, 6, 28),
    new Date(2026, 7, 13),
    new Date(2026, 7, 26),
    new Date(2026, 8, 10),
    new Date(2026, 8, 24),
    new Date(2026, 9, 6),
    new Date(2026, 9, 21),
  ],
  [],
);

const config = createCalendarConfig({ mode: "multiple", readOnly: true });

<Calendar config={config} value={sixMonthDates} initialView={calendarDate(2026, 5, 1)} cols={3} appearance={compact}>
  <CalendarToolbar col={1}>
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
  </CalendarToolbar>
  <CalendarToolbar col={1} offset={1}>
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
  </CalendarToolbar>
  <CalendarToolbar col={1} offset={2}>
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
  </CalendarToolbar>
  <CalendarDays col={1} />
  <CalendarDays offset={1} col={1} />
  <CalendarDays offset={2} col={1} />
  <CalendarToolbar col={1} offset={3}>
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
  </CalendarToolbar>
  <CalendarToolbar col={1} offset={4}>
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
  </CalendarToolbar>
  <CalendarToolbar col={1} offset={5}>
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
  </CalendarToolbar>
  <CalendarDays offset={3} col={1} />
  <CalendarDays offset={4} col={1} />
  <CalendarDays offset={5} col={1} /> 
</Calendar>`}
            wide
          >
            <Calendar
              config={sixMonthCfg}
              value={sixMonthDates}
              initialView={calendarDate(2026, 5, 1)}
              theme={industrial}
              appearance={compact}
              cols={3}
              style={{ width: "100%" }}
            >
              <CalendarToolbar col={1}>
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={1}>
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={2}>
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
              </CalendarToolbar>
              <CalendarDays col={1} />
              <CalendarDays offset={1} col={1} />
              <CalendarDays offset={2} col={1} />
              <CalendarToolbar col={1} offset={3}>
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={4}>
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={5}>
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
              </CalendarToolbar>
              <CalendarDays offset={3} col={1} />
              <CalendarDays offset={4} col={1} />
              <CalendarDays offset={5} col={1} />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Delivery slots"
            useWhen="Letting users pick several non-contiguous delivery dates with capacity."
            demonstrates={`Multiple mode with \`maxDates\`, weekend + past disable rule, animated selected list.`}
            theme="mint"
            appearance="soft"
            code={`const [deliveryDates, setDeliveryDates] = useState<Date[]>([]);

const weekdaysOnly = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ weekends: true, before: today });
}, []);

const config = createCalendarConfig({
  mode: "multiple",
  maxDates: 4,
  disabled: weekdaysOnly,
});

<Calendar config={config} value={deliveryDates} onChange={(value) => setDeliveryDates(value as Date[])}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger compact />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              config={deliveryCfg}
              value={deliveryDates}
              onChange={(value) => setDeliveryDates(value as Date[])}
              theme={mint}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarYearTrigger compact />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Limited drop window"
            useWhen="Launch signup with only a handful of valid days."
            demonstrates={`\`hideOutOfRange\` + \`min/maxDate\` + \`createDisabled\` for a tightly bounded picker.`}
            theme="riso"
            appearance="compact"
            code={`const [dropDate, setDropDate] = useState<Date | null>(null);

const dropDisabled = useMemo(
  () =>
    createDisabled({
      dates: [new Date("2026-07-12"), new Date("2026-07-15")],
      weekdays: [0, 6],
    }),
  [],
);

const config = createCalendarConfig({
  min: new Date("2026-07-10"),
  max: new Date("2026-07-18"),
  disabled: dropDisabled,
});

<Calendar
  config={config}
  value={dropDate}
  onChange={(value) => setDropDate(value as Date | null)}
  initialView={calendarDate(2026, 7, 10)}
>
  <CalendarToolbar>
    <CalendarToolbarMonthLabel />
    <CalendarToolbarYearLabel />
    <CalendarToolbarClock />
  </CalendarToolbar>
  <CalendarDays hideOutOfRange fixedWeeks={false} />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              config={dropCfg}
              value={dropDate}
              onChange={(value) => setDropDate(value as Date | null)}
              initialView={calendarDate(2026, 7, 10)}
              theme={riso}
              appearance={compact}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarClock />
              </CalendarToolbar>
              <CalendarDays hideOutOfRange fixedWeeks={false} />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Appointment booking"
            useWhen="Doctor, salon, or restaurant reservations needing date and time in one step."
            demonstrates={`Single mode + \`CalendarTimeWheel\` + nav with \`showTime\`.`}
            theme="aurora"
            appearance="loft"
            code={`const [appointment, setAppointment] = useState<Date | null>(null);

const weekdaysOnly = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ weekends: true, before: today });
}, []);

const config = createCalendarConfig({ withTime: true, disabled: weekdaysOnly });

<Calendar gradient config={config} value={appointment} onChange={(value) => setAppointment(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarTimeWheel />
  <CalendarSelectedDates allowClear showTime />
</Calendar>`}
          >
            <Calendar
              config={appointmentCfg}
              value={appointment}
              gradient
              onChange={(value) => setAppointment(value as Date | null)}
              theme={aurora}
              appearance={loft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarTimeWheel />
              <CalendarSelectedDates allowClear showTime />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Analytics dashboard"
            useWhen="Filtering reports by familiar ranges (Today / Last 7 / Quarter)."
            demonstrates={`Range mode + \`CalendarPresets\` with relative offsets + animated summary.`}
            theme="graphite"
            code={`const [reportRange, setReportRange] = useState<{ start: Date; end: Date } | null>(null);

// range: 0 → a single-day range, so "Today" stays clickable in range mode
const analyticsPresets = [
  { label: "Today", value: 0, range: 0 },
  { label: "Last 7 days", value: -6, range: 6 },
  { label: "Last 30 days", value: -29, range: 29 },
];

const config = createCalendarConfig({ mode: "range" });

<Calendar config={config} value={reportRange} onChange={(value) => setReportRange(value as { start: Date; end: Date } | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarPresets presets={analyticsPresets} />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`}
          >
            <Calendar
              config={rangeCfg}
              value={reportRange}
              onChange={(value) => setReportRange(value as RangeValue)}
              theme={graphite}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarPresets presets={analyticsPresets} />
              <CalendarSelectedDates allowClear allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Support quick dates"
            useWhen={`Reminders or follow-ups where "Tomorrow" or "Next Monday" covers most cases.`}
            demonstrates={`Single mode with custom presets, including dynamic ones via \`getValue\`.`}
            theme="mint"
            appearance="soft"
            code={`const [singlePresetDate, setSinglePresetDate] = useState<Date | null>(null);

const supportPresets = useMemo<PresetInput[]>(
  () => [
    { label: "Today", value: 0 },
    { label: "Tomorrow", value: 1 },
    { label: "In 3 days", value: 3 },
    {
      id: "next-monday",
      label: "Next Monday",
      getValue: ({ now }) => {
        const date = new Date(now);
        const delta = (8 - date.getDay()) % 7 || 7;
        date.setDate(date.getDate() + delta);
        return date;
      },
    },
  ],
  [],
);

const config = createCalendarConfig();

<Calendar config={config} value={singlePresetDate} onChange={(value) => setSinglePresetDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarPresets presets={supportPresets} />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={singlePresetDate}
              onChange={(value) => setSinglePresetDate(value as Date | null)}
              theme={mint}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarPresets presets={supportPresets} />
              <CalendarSelectedDates allowClear allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Holiday planner"
            useWhen="Marketing or seasonal planning around fixed and computed holidays."
            demonstrates="Multiple mode with advanced custom presets (Christmas, Thanksgiving, Black Friday)."
            theme="snow"
            appearance="compact"
            code={`const [holidayRange, setHolidayRange] = useState<Date[]>([]);

function nthWeekdayOfMonth(year: number, month: number, weekday: number, occurrence: number) {
  const date = new Date(year, month, 1);
  const delta = (weekday - date.getDay() + 7) % 7;
  date.setDate(1 + delta + (occurrence - 1) * 7);
  return date;
}

const holidayPresets = useMemo<PresetInput[]>(
  () => [
    {
      id: "new-year",
      label: "New Year",
      getValue: ({ now }) => {
        const year =
          now.getMonth() > 0 || now.getDate() > 1
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 0, 1);
        return date;
      },
    },
    {
      id: "independence-day",
      label: "Independence Day",
      getValue: ({ now }) => {
        const year =
          now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 4)
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 6, 4);
        return date;
      },
    },
    {
      id: "christmas-day",
      label: "Christmas Day",
      getValue: ({ now }) => {
        const year =
          now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 25)
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 11, 25);
        return date;
      },
    },
    {
      id: "thanksgiving-day",
      label: "Thanksgiving",
      getValue: ({ now }) => {
        const year = now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
        const date = nthWeekdayOfMonth(year, 10, 4, 4);
        return date;
      },
    },
    {
      id: "christmas-eve",
      label: "Christmas Eve",
      getValue: ({ now }) => {
        const year =
          now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 24)
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 11, 24);
        return date;
      },
    },
    {
      id: "black-friday",
      label: "Black Friday",
      getValue: ({ now }) => {
        const year = now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
        const date = nthWeekdayOfMonth(year, 10, 4, 4);
        date.setDate(date.getDate() + 1);
        return date;
      },
    },
  ],
  [],
);

const config = createCalendarConfig({ mode: "multiple" });

<Calendar config={config} value={holidayRange} onChange={(value) => setHolidayRange(value as Date[])} cols={2}>
  <CalendarPresets presets={holidayPresets} />
  <CalendarDays />
  <CalendarMonthsGrid col={1} />
  <CalendarYearsGrid col={1} />
  <CalendarSelectedDates col={2} allowClear allowNavigate />
</Calendar>`}
            medium
          >
            <Calendar
              config={multipleCfg}
              value={holidayRange}
              onChange={(value) => setHolidayRange(value as Date[])}
              theme={snow}
              appearance={compact}
              cols={2}
              style={{ width: "100%" }}
            >
              <CalendarPresets presets={holidayPresets} />
              <CalendarDays />
              <CalendarMonthsGrid col={1} />
              <CalendarYearsGrid col={1} />
              <CalendarSelectedDates col={2} allowClear allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Brand theme picker"
            useWhen="Branded checkout or onboarding where the picker has to match a custom palette in both light and dark."
            demonstrates={`\`createTheme\` with shared tokens plus \`light\`/\`dark\` variants, and a built-in theme toggle to flip between them.`}
            theme="custom"
            appearance="soft"
            code={`const [brandDate, setBrandDate] = useState<Date | null>(null);

// Shared tokens apply to both variants; light/dark override per mode.
const brandTheme = useMemo(
  () =>
    createTheme({
      accent: "#7c3aed",
      focusRing: "#ede9fe",
      range: "#ddd6fe",
      weekend: "#db2777",
      light: { backdrop: "#faf5ff", tone: "#f3e8ff", text: "#3b0764", stroke: "#e9d5ff" },
      dark: { backdrop: "#1a0b2e", tone: "#2e1065", text: "#f5f3ff", stroke: "#4c1d95" },
    }),
  [],
);

const config = createCalendarConfig();

<Calendar config={config} value={brandDate} onChange={(value) => setBrandDate(value as Date | null)} theme={brandTheme}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarThemeToggle />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={brandDate}
              onChange={(value) => setBrandDate(value as Date | null)}
              theme={brandTheme}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarYearTrigger compact />
                <CalendarToolbarThemeToggle />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Branded preset rail"
            useWhen="A neutral calendar that still has to carry one branded surface — a dark preset rail, a colored info strip, a toolbar in product colors."
            demonstrates={`Per-module \`theme\` taking a \`createTheme\` family object (v3.2) instead of only a built-in family name — the module gets inline \`--c-*\` vars while the rest of the calendar keeps the root theme.`}
            theme="snow + custom module"
            appearance="soft"
            medium
            code={`const [moduleThemeDate, setModuleThemeDate] = useState<Date | null>(null);

// Module theme is ModuleTheme = string | ThemeFamily.
const railTheme = useMemo(
  () =>
    createTheme({
      accent: "#f97316",
      range: "#fed7aa",
      light: { backdrop: "#1c1917", tone: "#292524", text: "#fafaf9", stroke: "#44403c" },
      dark: { backdrop: "#0c0a09", tone: "#1c1917", text: "#fafaf9", stroke: "#292524" },
    }),
  [],
);

const config = createCalendarConfig();
const supportPresets: PresetInput[] = [
  { label: "Today", value: 0 },
  { label: "Tomorrow", value: 1 },
  { label: "In 3 days", value: 3 },
];

// Root stays snow; only the presets rail and info strip take railTheme.
<Calendar
  config={config}
  value={moduleThemeDate}
  onChange={(value) => setModuleThemeDate(value as Date | null)}
  theme={snow}
  scheme="light"
  cols={2}
>
  <CalendarToolbar col={2}>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarPresets presets={supportPresets} theme={railTheme} />
  <CalendarDays />
  <CalendarInfo col={2} theme={railTheme} showSummary showRelative />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={moduleThemeDate}
              onChange={(value) => setModuleThemeDate(value as Date | null)}
              theme={snow}
              scheme="light"
              appearance={soft}
              cols={2}
              style={{ width: "100%" }}
            >
              <CalendarToolbar col={2}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarYearTrigger compact />
              </CalendarToolbar>
              <CalendarPresets presets={supportPresets} theme={railTheme} />
              <CalendarDays />
              <CalendarInfo col={2} theme={railTheme} showSummary showRelative />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Dense product filter"
            useWhen="Compact dashboards where calendar rhythm needs to match dense data UI."
            demonstrates={`\`createAppearance\` with custom radius, spacing, font size, and \`dayRatio\`.`}
            theme="graphite"
            appearance="custom"
            code={`const [denseRange, setDenseRange] = useState<{ start: Date; end: Date } | null>(null);

const denseAppearance = useMemo(
  () =>
    createAppearance({
      radius: "5px",
      spacing: "0.42em",
      fontSize: "13px",
      dayHeight: "2.2em",
      transition: "120ms ease",
    }),
  [],
);

const config = createCalendarConfig({ mode: "range" });

<Calendar config={config} value={denseRange} onChange={(value) => setDenseRange(value as { start: Date; end: Date } | null)} appearance={denseAppearance}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              config={rangeCfg}
              value={denseRange}
              onChange={(value) => setDenseRange(value as RangeValue)}
              theme={graphite}
              appearance={denseAppearance}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Vacation request"
            useWhen="HR-style time off with min and max length rules."
            demonstrates={`Range mode with \`minRangeDays\` / \`maxRangeDays\`, weekday-only rule, and \`CalendarInfo\` showing the duration as the user drags.`}
            theme="riso"
            appearance="square"
            code={`const [vacationRange, setVacationRange] = useState<{ start: Date; end: Date } | null>(null);

const weekdaysOnly = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ weekends: true, before: today });
}, []);

const config = createCalendarConfig({
  mode: "range",
  disabled: weekdaysOnly,
  minSpan: 2,
  maxSpan: 21,
});

<Calendar
  config={config}
  value={vacationRange}
  onChange={(value) => setVacationRange(value as { start: Date; end: Date } | null)}
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarInfo showSummary rangeStyle="duration" />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              config={vacationCfg}
              value={vacationRange}
              onChange={(value) => setVacationRange(value as RangeValue)}
              theme={riso}
              appearance={square}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarYearTrigger compact />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarInfo showSummary rangeStyle="duration" />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Sprint planning"
            useWhen="Engineering planning around current sprint, next sprint, release week."
            demonstrates="Range mode with custom-length presets (offset + range)."
            theme="industrial"
            code={`const [sprintRange, setSprintRange] = useState<{ start: Date; end: Date } | null>(null);

const sprintPresets = [
  { label: "Current sprint", value: 0, range: 13 },
  { label: "Next sprint", value: 14, range: 13 },
  { label: "Release week", value: 28, range: 6 },
];

const config = createCalendarConfig({ mode: "range" });

<Calendar config={config} value={sprintRange} onChange={(value) => setSprintRange(value as { start: Date; end: Date } | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarPresets presets={sprintPresets} />
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>`}
          >
            <Calendar
              config={rangeCfg}
              value={sprintRange}
              onChange={(value) => setSprintRange(value as RangeValue)}
              theme={industrial}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarPresets presets={sprintPresets} />
              <CalendarDays />
              <CalendarSelectedDates allowClear allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Invoice due date"
            useWhen="Billing form where users want to type or pick the date with a strict allowed window."
            demonstrates={`\`CalendarManualInput\` paired with the picker, \`locale\`, and min/max dates.`}
            theme="snow"
            appearance="soft"
            code={`const [manualDate, setManualDate] = useState<Date | null>(null);

const config = createCalendarConfig({
  locale: "de-DE",
  min: new Date("2026-05-01"),
  max: new Date("2026-08-31"),
});

<Calendar
  config={config}
  value={manualDate}
  onChange={(value) => setManualDate(value as Date | null)}
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarManualInput allowClear />
</Calendar>`}
          >
            <Calendar
              config={invoiceCfg}
              value={manualDate}
              onChange={(value) => setManualDate(value as Date | null)}
              theme={snow}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarManualInput allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Archive year browser"
            useWhen="Annual reports, archives, or timeline filters that only need year navigation."
            demonstrates={`Solo \`CalendarYearsGrid\` with \`onYearSelect\` driving external state.`}
            theme="graphite"
            appearance="compact"
            code={`const [archiveYear, setArchiveYear] = useState<Date | null>(null);

<>
  <Calendar
    config={createCalendarConfig({
      min: new Date("2018-01-01"),
      max: new Date("2030-12-31"),
    })}
    initialView={calendarDate(2026, 1, 1)}
  >
    <CalendarYearsGrid
      yearsPerPage={12}
      onYearSelect={(year: number) => setArchiveYear(new Date(year, 0, 1))}
    />
  </Calendar>
  {archiveYear && <p>Browsing archive · {archiveYear.getFullYear()}</p>}
</>`}
          >
            <Calendar
              config={archiveCfg}
              initialView={calendarDate(2026, 1, 1)}
              theme={graphite}
              appearance={compact}
              style={{ width: "100%" }}
            >
              <CalendarYearsGrid
                yearsPerPage={12}
                onYearSelect={(year: number) => setArchiveYear(new Date(year, 0, 1))}
              />
            </Calendar>
            <p
              aria-live="polite"
              className="mt-3 text-center text-sm font-medium text-zinc-600"
            >
              {archiveYear
                ? `Browsing archive · ${archiveYear.getFullYear()}`
                : "Pick a year to browse the archive"}
            </p>
          </ExampleCard>

          <ExampleCard
            title="Campaign month picker"
            useWhen="Lightweight season, campaign, or billing-period selectors."
            demonstrates={`Solo \`CalendarMonthsGrid\` with \`onMonthSelect\` driving external state.`}
            theme="temporal"
            appearance="soft"
            code={`const [campaignMonth, setCampaignMonth] = useState<Date | null>(null);

<>
  <Calendar
    config={createCalendarConfig({
      min: new Date("2026-01-01"),
      max: new Date("2026-12-31"),
    })}
    initialView={calendarDate(2026, 5, 1)}
    gradient
  >
    <CalendarMonthsGrid
      short
      onMonthSelect={(year: number, month: number) =>
                  setCampaignMonth(new Date(year, month - 1, 1))
                }
    />
  </Calendar>
  {campaignMonth && (
    <p>
      Campaign ·{" "}
      {campaignMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
    </p>
  )}
</>`}
          >
            <Calendar
              config={singleCfg}
              initialView={calendarDate(2026, 5, 1)}
              gradient
              theme={temporal}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarMonthsGrid
                short
                onMonthSelect={(year: number, month: number) =>
                  setCampaignMonth(new Date(year, month - 1, 1))
                }
              />
            </Calendar>
            <p
              aria-live="polite"
              className="mt-3 text-center text-sm font-medium text-zinc-600"
            >
              {campaignMonth
                ? `Campaign · ${campaignMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}`
                : "Pick a month to plan the campaign"}
            </p>
          </ExampleCard>

          <ExampleCard
            title="Time slot picker"
            useWhen="Slot pickers, reminders, or any flow where the date is fixed and only time matters."
            demonstrates={`Solo \`CalendarTimeWheel\` with \`timeStep={{ minute: 10 }}\` for snapped slots.`}
            theme="aurora"
            appearance="loft"
            code={`const [meetingTime, setMeetingTime] = useState<Date | null>(null);

<>
  <Calendar
    config={createCalendarConfig({ withTime: true })}
    value={meetingTime}
    onChange={(value) => setMeetingTime(value as Date | null)}
  >
    <CalendarTimeWheel />
  </Calendar>
  {meetingTime && (
    <p>
      Slot ·{" "}
      {meetingTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  )}
</>`}
          >
            <Calendar
              config={timeCfg}
              value={meetingTime}
              onChange={(value) => setMeetingTime(value as Date | null)}
              theme={aurora}
              appearance={loft}
              style={{ width: "100%" }}
            >
              <CalendarTimeWheel />
            </Calendar>
            <p
              aria-live="polite"
              className="mt-3 text-center text-sm font-medium text-zinc-600"
            >
              {meetingTime
                ? `Slot · ${meetingTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                : "Pick a time slot"}
            </p>
          </ExampleCard>

          <ExampleCard
            title="Global meeting time"
            useWhen="Scheduling one slot that teammates in different time zones can read at a glance."
            demonstrates={`\`timeZone\` + \`hour12\` on the calendar, with the same instant rendered in four cities.`}
            theme="aurora"
            appearance="loft"
            code={`const ZONES = [
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Berlin", tz: "Europe/Berlin" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
];

const [globalMeeting, setGlobalMeeting] = useState<Date | null>(null);

const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, []);

const config = createCalendarConfig({
  withTime: true,
  hour12: true,
  timeZone: "America/New_York",
  disabled: noPast,
});

<Calendar
  config={config}
  value={globalMeeting}
  onChange={(value) => setGlobalMeeting(value as Date | null)}
>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarClear />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarTimeWheel />
</Calendar>

{globalMeeting && (
  <ul>
    {ZONES.map((z) => (
      <li key={z.tz}>
        <span>{z.city}</span>
        <span>
          {globalMeeting.toLocaleString("en-US", {
            timeZone: z.tz,
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </li>
    ))}
  </ul>
)}`}
          >
            <Calendar
              config={globalCfg}
              value={globalMeeting}
              onChange={(value) => setGlobalMeeting(value as Date | null)}
              theme={aurora}
              appearance={loft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarTimeWheel />
            </Calendar>
            <div className="mt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Same moment around the world
              </div>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {MEETING_ZONES.map((zone) => {
                  const date = globalMeeting
                    ? globalMeeting.toLocaleDateString("en-US", {
                        timeZone: zone.tz,
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : null;
                  const time = globalMeeting
                    ? globalMeeting.toLocaleTimeString("en-US", {
                        timeZone: zone.tz,
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : null;
                  return (
                    <li
                      key={zone.tz}
                      className="rounded-xl border border-zinc-200 bg-white px-2 py-1 text-left shadow-sm"
                    >
                      <div className="text-[10px] uppercase tracking-wide text-zinc-400">
                        {zone.city}
                      </div>
                      <div className="mt-1 whitespace-nowrap text-sm font-semibold text-zinc-900 tabular-nums">
                        {time ?? "—"}
                      </div>
                      <div className="whitespace-nowrap text-xs text-zinc-500">
                        {date ?? ""}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </ExampleCard>

          <ExampleCard
            title="Profile birthday"
            useWhen="Older dates where jumping years and months matters more than a month grid."
            demonstrates={`Track-based UI (\`CalendarYearsTrack\`, \`CalendarMonthsTrack\`, \`CalendarDaysTrack\`).`}
            theme="midnight"
            appearance="bubble"
            code={`const [birthday, setBirthday] = useState<Date | null>(new Date(1994, 5, 14));

const config = createCalendarConfig();

<Calendar config={config} value={birthday} onChange={(value) => setBirthday(value as Date | null)} appearance={bubble}>
  <CalendarYearsTrack />
  <CalendarMonthsTrack short />
  <CalendarDaysTrack />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={birthday}
              onChange={(value) => setBirthday(value as Date | null)}
              theme={nebula}
              appearance={bubble}
              style={{ width: "100%" }}
            >
              <CalendarYearsTrack />
              <CalendarMonthsTrack short />
              <CalendarDaysTrack />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Blackout calendar"
            useWhen="Operations calendars with weekends, maintenance windows, and exact blackout dates."
            demonstrates={`Range mode with composite \`createDisabled\` (weekends + before + ranges + dates).`}
            theme="snow"
            appearance="square"
            code={`const [blackoutRange, setBlackoutRange] = useState<{ start: Date; end: Date } | null>(null);

// Everything matching a rule renders greyed out and unclickable:
// past days, weekends, the maintenance window, the exact date.
const blackout = createDisabled({
  weekends: true,
  before: new Date(),
  ranges: [{ from: new Date("2026-06-10"), to: new Date("2026-06-14") }],
  dates: [new Date("2026-06-20")],
});

const config = createCalendarConfig({ mode: "range", disabled: blackout });

<Calendar config={config} value={blackoutRange} onChange={(value) => setBlackoutRange(value as { start: Date; end: Date } | null)}>
  <CalendarToolbar>
    <CalendarToolbarMonthTrigger compact />
    <CalendarToolbarPrev unit="year" />
    <CalendarToolbarYearTrigger />
    <CalendarToolbarNext unit="year" />
    <CalendarToolbarHome />
  </CalendarToolbar>
  <CalendarDays highlightWeekends />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              config={blackoutCfg}
              value={blackoutRange}
              onChange={(value) => setBlackoutRange(value as RangeValue)}
              theme={snow}
              appearance={square}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarMonthTrigger compact />
                <CalendarToolbarPrev unit="year" />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext unit="year" />
                <CalendarToolbarHome />
              </CalendarToolbar>
              <CalendarDays highlightWeekends />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Launch day"
            useWhen="Locked launches, archive screens, or confirmed bookings."
            demonstrates={`\`readOnly\` flag plus \`allowNavigate\` on the selected dates display.`}
            theme="snow"
            appearance="soft"
            code={`const launchDate = new Date(2026, 8, 9);

const config = createCalendarConfig({ readOnly: true });

<Calendar config={config} value={launchDate}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthLabel />
    <CalendarToolbarNext />
    <CalendarToolbarYearLabel />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarSelectedDates allowNavigate />
</Calendar>`}
          >
            <Calendar
              config={readOnlyCfg}
              value={launchDate}
              theme={snow}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowNavigate />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Month wheel + day grid"
            useWhen="Compact pickers where month is spun via drum, day selected via grid."
            demonstrates={`\`cols={2}\`, arrows navigate by year, wheel handles month, YearTrigger compact at right.`}
            theme="temporal"
            appearance="soft"
            wide
            code={`const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)} cols={2}>
  <CalendarToolbar col={2}>
    <CalendarToolbarPrev unit="year" />
    <CalendarToolbarYearTrigger  />
    <CalendarToolbarNext unit="year" />
  </CalendarToolbar>
  <CalendarMonthsWheel col={1} showLabel />
  <CalendarDays col={1} />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={basicDate}
              onChange={(value) => setBasicDate(value as Date | null)}
              cols={2}
              theme={temporal}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar col={2}>
                <CalendarToolbarPrev unit="year" />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext unit="year" />
              </CalendarToolbar>
              <CalendarMonthsWheel col={1} showLabel />
              <CalendarDays col={1} />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Drum triggers in toolbar"
            useWhen="Compact headers where month and year are spun in a wheel popup instead of grids."
            demonstrates={`\`compact\` on \`CalendarToolbarMonthTrigger\` / \`CalendarToolbarYearTrigger\` — the popup becomes an iOS-style drum picker.`}
            theme="velvet"
            appearance="bubble"
            code={`const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    {/* compact = drum-style wheel picker in the popup */}
    <CalendarToolbarMonthTrigger compact />
    <CalendarToolbarYearTrigger compact />
    <CalendarToolbarNext />
  </CalendarToolbar>
  <CalendarDays />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={drumDate}
              onChange={(value) => setDrumDate(value as Date | null)}
              theme={velvet}
              appearance={bubble}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger compact />
                <CalendarToolbarYearTrigger compact />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Quarter-hour slots"
            useWhen="Call bookings or service slots that snap to 15-minute steps."
            demonstrates={`\`CalendarTimeWheel step={{ minute: 15 }}\` — the minutes drum only offers 00 / 15 / 30 / 45; \`defaultTime\` seeds the first pick.`}
            theme="prism"
            appearance="soft"
            code={`const config = createCalendarConfig({
  withTime: true,
  defaultTime: { hour: 9 },
});

<Calendar config={config} value={slot} onChange={(value) => setSlot(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarTimeWheel step={{ minute: 15 }} labels="short" />
  <CalendarSelectedDates showTime />
</Calendar>`}
          >
            <Calendar
              config={slotCfg}
              value={slotTime}
              onChange={(value) => setSlotTime(value as Date | null)}
              theme={prism}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarTimeWheel step={{ minute: 15 }} labels="short" />
              <CalendarSelectedDates showTime />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Lunar phase strip"
            useWhen="Astrology apps, farming calendars, tide trackers, or any domain where lunar phase is meaningful."
            demonstrates={`\`CalendarLunar\` below the day grid — display-only, no interaction.`}
            theme="nebula"
            appearance="soft"
            code={`import { CalendarLunar } from "@dateforge/react-calendar/modules/lunar";

const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays />
  <CalendarLunar />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={basicDate}
              onChange={(value) => setBasicDate(value as Date | null)}
              theme={nebula}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarYearTrigger compact />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarLunar />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Weather forecast"
            useWhen="Trip planners or weather apps where each day shows an at-a-glance condition."
            demonstrates={`\`CalendarDays renderDay\` returning a custom cell — day number plus a per-day weather emoji.`}
            theme="aurora"
            appearance="soft"
            code={`// Deterministic per-day value so each date always looks the same.
const seededRandom = (d: CalendarDate) => {
  const seed = d.year * 10000 + d.month * 100 + d.day;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const WEATHER_ICONS = ["☀️", "⛅", "☁️", "🌧", "⛈", "❄️"];
const weatherFor = (d: CalendarDate) =>
  WEATHER_ICONS[Math.floor(seededRandom(d) * WEATHER_ICONS.length)];

const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays
    renderDay={(d, state) => {
      if (state.outside) return <span>{d.day}</span>;
      return (
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, lineHeight: 1.1 }}>
          <span style={{ fontSize: 13 }}>{d.day}</span>
          <span aria-hidden style={{ fontSize: 13 }}>{weatherFor(d)}</span>
        </span>
      );
    }}
  />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={weatherDate}
              onChange={(value) => setWeatherDate(value as Date | null)}
              theme={aurora}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays
                renderDay={(d, state) => {
                  if (state.outside) return renderOtherMonth(d, state);
                  return (
                    <span style={dayContainerStyle}>
                      <span style={dayNumberStyle(state)}>{d.day}</span>
                      <span aria-hidden style={{ fontSize: 13 }}>
                        {weatherFor(d)}
                      </span>
                    </span>
                  );
                }}
              />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Activity heatmap"
            useWhen="Contribution graphs, habit trackers, or any view where each day carries an intensity."
            demonstrates={`\`renderDay\` with an absolute-positioned fill behind the number to tint each cell.`}
            theme="mint"
            appearance="soft"
            code={`const seededRandom = (d: CalendarDate) => {
  const seed = d.year * 10000 + d.month * 100 + d.day;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const heatColor = (intensity: number) => {
  const alpha = Math.min(0.85, 0.08 + intensity * 0.7);
  return \`rgba(34, 139, 60, \${alpha})\`;
};

const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays
    renderDay={(d, state) => {
      if (state.outside) return <span>{d.day}</span>;
      const intensity = seededRandom(d);
      return (
        <>
          {/* Absolute fill overrides the .activeItem background so the
              heatmap color wins on every appearance / border-radius. */}
          <span aria-hidden style={{ position: "absolute", inset: 0, background: heatColor(intensity), borderRadius: "inherit" }} />
          <span style={{ position: "relative", fontSize: 13 }}>{d.day}</span>
        </>
      );
    }}
  />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={heatmapDate}
              onChange={(value) => setHeatmapDate(value as Date | null)}
              theme={mint}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays
                renderDay={(d, state) => {
                  if (state.outside) return renderOtherMonth(d, state);
                  const intensity = seededRandom(d);
                  return (
                    <>
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: heatColor(intensity),
                          borderRadius: "inherit",
                        }}
                      />
                      <span
                        style={{ ...dayContainerStyle, position: "relative" }}
                      >
                        <span style={dayNumberStyle(state)}>{d.day}</span>
                      </span>
                    </>
                  );
                }}
              />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Ticket prices"
            useWhen="Flight or event booking where users want to spot the cheapest day to buy."
            demonstrates={`\`renderDay\` showing a derived price under each day — green when cheap, red when pricey.`}
            theme="temporal"
            appearance="compact"
            code={`const seededRandom = (d: CalendarDate) => {
  const seed = d.year * 10000 + d.month * 100 + d.day;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const priceFor = (d: CalendarDate) => {
  const dow = new Date(d.year, d.month - 1, d.day).getDay();
  const isWeekend = dow === 0 || dow === 6;
  return Math.round(79 + seededRandom(d) * 220 + (isWeekend ? 60 : 0));
};

const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays
    renderDay={(d, state) => {
      if (state.outside) return <span>{d.day}</span>;
      const price = priceFor(d);
      const isCheap = price < 140;
      return (
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, lineHeight: 1.1 }}>
          <span style={{ fontSize: 13 }}>{d.day}</span>
          <span aria-hidden style={{ fontSize: 10, fontWeight: 600, color: isCheap ? "#15803d" : "#b91c1c" }}>
            \${price}
          </span>
        </span>
      );
    }}
  />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={priceDate}
              onChange={(value) => setPriceDate(value as Date | null)}
              theme={temporal}
              appearance={compact}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays
                renderDay={(d, state) => {
                  if (state.outside) return renderOtherMonth(d, state);
                  const price = priceFor(d);
                  const isCheap = price < 140;
                  return (
                    <span style={dayContainerStyle}>
                      <span style={dayNumberStyle(state)}>{d.day}</span>
                      <span
                        aria-hidden
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: isCheap ? "#15803d" : "#b91c1c",
                        }}
                      >
                        ${price}
                      </span>
                    </span>
                  );
                }}
              />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Event dots"
            useWhen="Schedules or agendas that mark how many events fall on a given day."
            demonstrates={`\`renderDay\` rendering 1–3 dots under days that have events.`}
            theme="nebula"
            appearance="soft"
            code={`const seededRandom = (d: CalendarDate) => {
  const seed = d.year * 10000 + d.month * 100 + d.day;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const EVENT_DAYS = new Set([3, 7, 14, 18, 22, 27]);
const eventCount = (d: CalendarDate) => {
  if (!EVENT_DAYS.has(d.day)) return 0;
  return 1 + Math.floor(seededRandom(d) * 3);
};

const config = createCalendarConfig();

<Calendar config={config} value={date} onChange={(value) => setDate(value as Date | null)}>
  <CalendarToolbar>
    <CalendarToolbarPrev />
    <CalendarToolbarMonthTrigger />
    <CalendarToolbarNext />
    <CalendarToolbarYearTrigger compact />
  </CalendarToolbar>
  <CalendarDays
    renderDay={(d, state) => {
      if (state.outside) return <span>{d.day}</span>;
      const count = eventCount(d);
      return (
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, lineHeight: 1.1 }}>
          <span style={{ fontSize: 13 }}>{d.day}</span>
          <span aria-hidden style={{ display: "flex", gap: 2, height: 4 }}>
            {Array.from({ length: count }, (_, i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", opacity: 0.7 }} />
            ))}
          </span>
        </span>
      );
    }}
  />
</Calendar>`}
          >
            <Calendar
              config={singleCfg}
              value={eventDate}
              onChange={(value) => setEventDate(value as Date | null)}
              theme={nebula}
              appearance={soft}
              style={{ width: "100%" }}
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays
                renderDay={(d, state) => {
                  if (state.outside) return renderOtherMonth(d, state);
                  const count = eventCount(d);
                  return (
                    <span style={dayContainerStyle}>
                      <span style={dayNumberStyle(state)}>{d.day}</span>
                      <span
                        aria-hidden
                        style={{ display: "flex", gap: 2, height: 4 }}
                      >
                        {Array.from(
                          { length: count },
                          (_, i) => `${d.day}-${i}`,
                        ).map((key) => (
                          <span
                            key={key}
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "currentColor",
                              opacity: 0.7,
                            }}
                          />
                        ))}
                      </span>
                    </span>
                  );
                }}
              />
            </Calendar>
          </ExampleCard>
        </div>
      </div>

      <ScrollToTop />
    </main>
  );
}

function ExampleCard({
  title,
  useWhen,
  demonstrates,
  code,
  theme,
  appearance,
  featured = false,
  medium = false,
  wide = false,
  children,
}: {
  title: string;
  useWhen: string;
  demonstrates: string;
  code: string;
  theme?: string;
  appearance?: string;
  featured?: boolean;
  medium?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const fullCode = withImports(title, code);

  const copyCode = async () => {
    await navigator.clipboard.writeText(fullCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section
      id={slugify(title)}
      className="scroll-mt-24 border-y border-zinc-200/80 bg-white/75 px-0 py-4 shadow-sm backdrop-blur sm:rounded-2xl sm:border sm:p-4"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:grid-cols-[minmax(0,980px)_420px]">
        <div className="order-2 overflow-x-auto bg-[#fbfbfd] px-2 py-3 sm:rounded-xl sm:p-3 lg:order-1">
          <div
            className={
              medium
                ? "mx-auto w-full md:min-w-[520px] lg:w-[560px]"
                : wide || featured
                  ? "mx-auto w-full md:min-w-[640px] lg:w-[760px]"
                  : "mx-auto w-full max-w-[340px]"
            }
          >
            {children}
          </div>
        </div>

        <div className="order-1 flex min-h-full flex-col px-4 sm:px-0 lg:order-2">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Composition
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {title}
            </h2>
            <dl className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Use this when
                </dt>
                <dd className="mt-1">{renderInlineCode(useWhen)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  What it demonstrates
                </dt>
                <dd className="mt-1">{renderInlineCode(demonstrates)}</dd>
              </div>
            </dl>
          </div>

          {(theme || appearance) && (
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {theme && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 font-medium text-amber-700">
                  <Palette size={11} />
                  theme: {theme}
                </span>
              )}
              {appearance && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 font-medium text-indigo-700">
                  <Sparkles size={11} />
                  appearance: {appearance}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-zinc-400">
            {getTags(title).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200 bg-white px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="group mt-4 border-y border-zinc-200 bg-zinc-50 sm:rounded-xl sm:border">
        <summary className="flex h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-sm font-semibold text-zinc-700">
          Code
          <ChevronDown size={16} className="transition group-open:rotate-180" />
        </summary>
        <div className="flex justify-end border-t border-zinc-200 px-3 py-2">
          <button
            type="button"
            onClick={copyCode}
            className="flex h-8 items-center gap-1.5 rounded-md bg-white px-2 text-xs font-semibold text-zinc-700 shadow-sm"
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <CodeBlock code={fullCode} />
      </details>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="max-h-[520px] overflow-auto border-t border-zinc-200 bg-[#101012] px-4 py-4 text-xs leading-5 text-zinc-200">
      <code>{highlightCode(code)}</code>
    </pre>
  );
}

function renderInlineCode(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.85em] text-zinc-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function highlightCode(code: string) {
  const pattern =
    /(\/\/.*|import|from|const|return|useMemo|useState|new|type|Calendar|createDisabled|createTheme|createAppearance|commonPresets|PresetEntry|("[^"]*"|'[^']*')|(<\/?[A-Z][A-Za-z0-9]*)|([{}()[\]=/>]+))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code))) {
    if (match.index > lastIndex) {
      parts.push(code.slice(lastIndex, match.index));
    }

    const token = match[0];
    let className = "text-zinc-200";
    if (token.startsWith("//")) className = "text-zinc-500";
    else if (token.startsWith('"') || token.startsWith("'"))
      className = "text-emerald-300";
    else if (token.startsWith("<")) className = "text-sky-300";
    else if (/^[{}()[\]=/>]+$/.test(token)) className = "text-zinc-400";
    else if (
      [
        "import",
        "from",
        "const",
        "return",
        "useMemo",
        "useState",
        "new",
        "type",
      ].includes(token)
    )
      className = "text-violet-300";
    else className = "text-amber-200";

    parts.push(
      <span key={`${token}-${match.index}`} className={className}>
        {token}
      </span>,
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < code.length) parts.push(code.slice(lastIndex));
  return parts;
}

// Examples in page order with their keyword tags. Drives both the per-card
// tag chips (`getTags`) and the jump-to tag cloud at the top (`getTagNav`).
const EXAMPLES: { title: string; tags: string[] }[] = [
  { title: "SimpleCalendar", tags: ["prebuilt", "one import", "single"] },
  { title: "DatePicker", tags: ["prebuilt", "manual input", "one import"] },
  { title: "MonthPicker", tags: ["prebuilt", "months grid", "one import"] },
  { title: "Quarter board", tags: ["prebuilt", "3 months", "range"] },
  { title: "The basics", tags: ["single", "starter"] },
  { title: "Week picker", tags: ["unit: week", "spans"] },
  { title: "Shift blocks", tags: ["multi-range", "maxRanges"] },
  { title: "Business days", tags: ["exclude", "segments", "range"] },
  {
    title: "German locale + labels",
    tags: ["locale", "labels", "week numbers"],
  },
  { title: "Controlled scheme", tags: ["scheme", "dark mode", "toggle"] },
  {
    title: "Pinned toolbar actions",
    tags: ["toolbar", "push", "smart layout"],
  },
  { title: "Stay booking", tags: ["range", "booking", "presets"] },
  { title: "Flight search", tags: ["range", "tracks", "mobile"] },
  { title: "Two-month stay search", tags: ["range", "2 months", "desktop"] },
  {
    title: "Six-month availability",
    tags: ["read-only", "6 months", "availability"],
  },
  { title: "Delivery slots", tags: ["multiple", "capacity"] },
  {
    title: "Limited drop window",
    tags: ["single", "hideOutOfRange", "disabled", "clock"],
  },
  { title: "Appointment booking", tags: ["single", "time", "scheduling"] },
  { title: "Analytics dashboard", tags: ["range", "presets", "reports"] },
  { title: "Support quick dates", tags: ["single", "presets", "support"] },
  { title: "Holiday planner", tags: ["multiple", "presets", "holidays"] },
  { title: "Brand theme picker", tags: ["single", "createTheme", "brand"] },
  {
    title: "Branded preset rail",
    tags: ["single", "createTheme", "per-module theme"],
  },
  {
    title: "Dense product filter",
    tags: ["range", "createAppearance", "dashboard"],
  },
  { title: "Vacation request", tags: ["range", "constraints", "HR"] },
  { title: "Sprint planning", tags: ["range", "presets", "planning"] },
  { title: "Invoice due date", tags: ["single", "manual input", "billing"] },
  { title: "Archive year browser", tags: ["years grid", "archive"] },
  { title: "Campaign month picker", tags: ["months grid", "campaign"] },
  { title: "Time slot picker", tags: ["time", "slots"] },
  { title: "Global meeting time", tags: ["single", "time zone", "hour12"] },
  { title: "Profile birthday", tags: ["single", "tracks", "birthday"] },
  { title: "Blackout calendar", tags: ["range", "disabled", "operations"] },
  { title: "Launch day", tags: ["read-only", "status"] },
  { title: "Month wheel + day grid", tags: ["single", "wheel", "2 cols"] },
  {
    title: "Drum triggers in toolbar",
    tags: ["toolbar", "wheel", "compact triggers"],
  },
  { title: "Quarter-hour slots", tags: ["time", "step", "15 min"] },
  { title: "Lunar phase strip", tags: ["single", "lunar"] },
  {
    title: "Weather forecast",
    tags: ["renderDay", "custom cell", "custom calendar"],
  },
  {
    title: "Activity heatmap",
    tags: ["renderDay", "heatmap", "custom calendar"],
  },
  { title: "Ticket prices", tags: ["renderDay", "pricing", "custom calendar"] },
  { title: "Event dots", tags: ["renderDay", "events", "custom calendar"] },
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTags(title: string) {
  return EXAMPLES.find((example) => example.title === title)?.tags ?? [
    "calendar",
  ];
}

// Unique keyword tags in page order, each pointing at the first example that
// carries it — powers the jump-to navigation at the top of the page.
function getTagNav(): { tag: string; slug: string }[] {
  const seen = new Map<string, string>();
  for (const { title, tags } of EXAMPLES) {
    for (const tag of tags) {
      if (!seen.has(tag)) seen.set(tag, slugify(title));
    }
  }
  return Array.from(seen, ([tag, slug]) => ({ tag, slug }));
}

function withImports(title: string, body: string) {
  const importsByTitle: Record<string, string> = {
    "The basics": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "SimpleCalendar": `import { useState } from "react";
import { SimpleCalendar } from "@dateforge/react-calendar/prebuilt";`,
    "DatePicker": `import { useState } from "react";
import { DatePicker } from "@dateforge/react-calendar/prebuilt";`,
    "MonthPicker": `import { useState } from "react";
import { MonthPicker } from "@dateforge/react-calendar/prebuilt";`,
    "Quarter board": `import { MultiMonthCalendar } from "@dateforge/react-calendar/prebuilt";`,
    "Week picker": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarInfo } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Shift blocks": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
  CalendarToolbarClear,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Business days": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarInfo } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
  CalendarToolbarClear,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "German locale + labels": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
  CalendarToolbarClear,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Controlled scheme": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
  CalendarToolbarThemeToggle,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Pinned toolbar actions": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarClear,
  CalendarToolbarGroup,
  CalendarToolbarHome,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarPrev,
  CalendarToolbarThemeToggle,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Stay booking": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled, type PresetInput } from "@dateforge/react-calendar";
import { CalendarDays, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";
import { soft } from "@dateforge/react-calendar/appearances";`,
    "Flight search": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDaysTrack, CalendarMonthsTrack, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarClear,
  CalendarToolbarGroup,
  CalendarToolbarLabel,
  CalendarToolbarMonthLabel,
  CalendarToolbarYearLabel,
} from "@dateforge/react-calendar/modules/toolbar";
import { temporal } from "@dateforge/react-calendar/themes";
import { compact } from "@dateforge/react-calendar/appearances";`,
    "Two-month stay search": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Six-month availability": `import { useMemo } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";
import { compact } from "@dateforge/react-calendar/appearances";`,
    "Delivery slots": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Limited drop window": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Appointment booking": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import { CalendarTimeWheel } from "@dateforge/react-calendar/modules/time";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Analytics dashboard": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Support quick dates": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, type PresetInput } from "@dateforge/react-calendar";
import { CalendarDays, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Holiday planner": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, type PresetInput } from "@dateforge/react-calendar";
import { CalendarDays, CalendarMonthsGrid, CalendarPresets, CalendarSelectedDates, CalendarYearsGrid } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Brand theme picker": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createTheme } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Branded preset rail": `import { useMemo, useState } from "react";
import {
  Calendar,
  createCalendarConfig,
  createTheme,
  type PresetInput,
} from "@dateforge/react-calendar";
import { CalendarDays, CalendarInfo, CalendarPresets } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";
import { snow } from "@dateforge/react-calendar/themes";`,
    "Dense product filter": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createAppearance } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Vacation request": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Sprint planning": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Invoice due date": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarManualInput } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Archive year browser": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarYearsGrid } from "@dateforge/react-calendar/modules";`,
    "Campaign month picker": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarMonthsGrid } from "@dateforge/react-calendar/modules";`,
    "Time slot picker": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarTimeWheel } from "@dateforge/react-calendar/modules/time";`,
    "Global meeting time": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import { CalendarTimeWheel } from "@dateforge/react-calendar/modules/time";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Profile birthday": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDaysTrack, CalendarMonthsTrack, CalendarSelectedDates, CalendarYearsTrack } from "@dateforge/react-calendar/modules";
import { bubble } from "@dateforge/react-calendar/appearances";`,
    "Blackout calendar": `import { useMemo, useState } from "react";
import { Calendar, createCalendarConfig, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Launch day": `import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Drum triggers in toolbar": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Quarter-hour slots": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import { CalendarTimeWheel } from "@dateforge/react-calendar/modules/time";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Weather forecast": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Activity heatmap": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Ticket prices": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
    "Event dots": `import { useState } from "react";
import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";
import { CalendarDays } from "@dateforge/react-calendar/modules";
import {
  CalendarToolbar,
  CalendarToolbarPrev,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";`,
  };

  const imports =
    importsByTitle[title] ??
    `import { Calendar, createCalendarConfig } from "@dateforge/react-calendar";`;
  const componentName = `${toPascal(title)}Example`;
  const lines = body.split("\n");
  let jsxStart = lines.findIndex((line) => /^\s*<(>|[A-Z])/.test(line));
  if (jsxStart === -1) jsxStart = lines.length;
  const setup = lines.slice(0, jsxStart).join("\n").trim();
  const jsx = lines.slice(jsxStart).join("\n").trim();
  const indent = (text: string, n: number) =>
    text
      .split("\n")
      .map((line) => (line ? `${" ".repeat(n)}${line}` : line))
      .join("\n");
  const setupBlock = setup ? `${indent(setup, 2)}\n\n` : "";
  const jsxBlock = jsx ? indent(jsx, 4) : "";

  return `${imports}

export function ${componentName}() {
${setupBlock}  return (
${jsxBlock}
  );
}`;
}

function toPascal(title: string) {
  return title
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
) {
  const date = new Date(year, month, 1);
  const delta = (weekday - date.getDay() + 7) % 7;
  date.setDate(1 + delta + (occurrence - 1) * 7);
  return date;
}
