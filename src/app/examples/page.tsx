"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Clipboard, Palette, Sparkles } from "lucide-react";
import {
  Calendar,
  basicPresets,
  createAppearance,
  createDisabled,
  createTheme,
  type PresetEntry,
} from "@dateforge/react-calendar";
import {
  CalendarDays,
  CalendarDaysTrack,
  CalendarManualInput,
  CalendarMonthsGrid,
  CalendarMonthsTrack,
  CalendarPresets,
  CalendarSelectedDates,
  CalendarYearsGrid,
  CalendarYearsTrack,
} from "@dateforge/react-calendar/modules";
import { CalendarLunar } from "@dateforge/react-calendar/modules/lunar";
import { CalendarMonthsWheel } from "@dateforge/react-calendar/modules/months-wheel";
import { CalendarTimeWheel } from "@dateforge/react-calendar/modules/time";
import {
  CalendarToolbar,
  CalendarToolbarClear,
  CalendarToolbarHome,
  CalendarToolbarLabel,
  CalendarToolbarMonthLabel,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarPrev,
  CalendarToolbarThemeToggle,
  CalendarToolbarTime,
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
  graphite,
  industrial,
  nebula,
  mint,
  riso,
  snow,
  temporal,
} from "@dateforge/react-calendar/themes";
import { InstallSnippet } from "../InstallSnippet";
import { SiteHeader } from "../SiteHeader";

type RangeValue = { from: Date | null; to: Date | null };

const emptyRange = (): RangeValue => ({ from: null, to: null });

const MEETING_ZONES = [
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Berlin", tz: "Europe/Berlin" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
] as const;

export default function ExamplesPage() {
  const [basicDate, setBasicDate] = useState<Date | null>(null);
  const [stayRange, setStayRange] = useState<RangeValue>(emptyRange);
  const [flightRange, setFlightRange] = useState<RangeValue>(emptyRange);
  const [twoMonthRange, setTwoMonthRange] = useState<RangeValue>(emptyRange);
  const [reportRange, setReportRange] = useState<RangeValue>(emptyRange);
  const [singlePresetDate, setSinglePresetDate] = useState<Date | null>(null);
  const [holidayRange, setHolidayRange] = useState<Date[]>([]);
  const [brandDate, setBrandDate] = useState<Date | null>(null);
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
  const launchDate = useMemo(() => new Date(2026, 8, 9), []);
  const archiveDate = useMemo(() => new Date(2026, 0, 1), []);
  const campaignDate = useMemo(() => new Date(2026, 4, 1), []);
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
        ranges: [{ from: addDays(today, 18), to: addDays(today, 23) }],
        dates: [addDays(today, 31)],
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
  const analyticsPresets = useMemo<PresetEntry[]>(
    () => [
      { label: "Today", value: 0 },
      { label: "Last 7 days", value: -6, range: 6 },
      { label: "Last 30 days", value: -29, range: 29 },
      { label: "Quarter", value: new Date(2026, 0, 1), range: 89 },
    ],
    [],
  );
  const sprintPresets = useMemo<PresetEntry[]>(
    () => [
      { label: "Current sprint", value: 0, range: 13 },
      { label: "Next sprint", value: 14, range: 13 },
      { label: "Release week", value: 28, range: 6 },
    ],
    [],
  );
  const supportPresets = useMemo<PresetEntry[]>(
    () => [
      { label: "Today", value: 0 },
      { label: "Tomorrow", value: 1 },
      { label: "In 3 days", value: 3 },
      {
        id: "next-monday",
        label: "Next Monday",
        getValue: ({ now, isValid }) => {
          const date = new Date(now);
          const delta = (8 - date.getDay()) % 7 || 7;
          date.setDate(date.getDate() + delta);
          return isValid(date) ? date : null;
        },
      },
    ],
    [],
  );
  const holidayPresets = useMemo<PresetEntry[]>(
    () => [
      {
        id: "new-year",
        label: "New Year",
        getValue: ({ now, isValid }) => {
          const year =
            now.getMonth() > 0 || now.getDate() > 1
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 0, 1);
          return isValid(date) ? date : null;
        },
      },
      {
        id: "independence-day",
        label: "Independence Day",
        getValue: ({ now, isValid }) => {
          const year =
            now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 4)
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 6, 4);
          return isValid(date) ? date : null;
        },
      },
      {
        id: "christmas-day",
        label: "Christmas Day",
        getValue: ({ now, isValid }) => {
          const year =
            now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 25)
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 11, 25);
          return isValid(date) ? date : null;
        },
      },
      {
        id: "thanksgiving-day",
        label: "Thanksgiving",
        getValue: ({ now, isValid }) => {
          const year =
            now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
          const date = nthWeekdayOfMonth(year, 10, 4, 4);
          return isValid(date) ? date : null;
        },
      },
      {
        id: "christmas-eve",
        label: "Christmas Eve",
        getValue: ({ now, isValid }) => {
          const year =
            now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 24)
              ? now.getFullYear() + 1
              : now.getFullYear();
          const date = new Date(year, 11, 24);
          return isValid(date) ? date : null;
        },
      },
      {
        id: "black-friday",
        label: "Black Friday",
        getValue: ({ now, isValid }) => {
          const year =
            now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
          const date = nthWeekdayOfMonth(year, 10, 4, 4);
          date.setDate(date.getDate() + 1);
          return isValid(date) ? date : null;
        },
      },
    ],
    [],
  );
  const brandTheme = useMemo(
    () =>
      createTheme({
        highlight: "#f4f96f",
        accent: "#27a925",
        backdrop: "#eae0f1",
        tone: "#ee1818",
        text: "#282626",
        stroke: "#cbd5e1",
        range: "#ccfbf1",
        shadow: "#b9c2cc",
      }),
    [],
  );
  const denseAppearance = useMemo(
    () =>
      createAppearance({
        radius: "5px",
        spacing: "0.42em",
        fontSize: "13px",
        dayRatio: "1 / 0.78",
        transition: "120ms ease",
      }),
    [],
  );

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
          </section>
        </div>

        <div className="-mx-5 flex flex-col gap-5 sm:mx-auto sm:max-w-[1720px]">
          <ExampleCard
            title="The basics"
            useWhen="You're starting a new flow and just need a working date picker."
            demonstrates="Bare minimum composition — Calendar shell + nav + days + selected dates."
            code={`const [basicDate, setBasicDate] = useState<Date | null>(new Date());

<Calendar mode="single" value={basicDate} onChange={setBasicDate}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
  <CalendarSelectedDates allowClear={false} />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={basicDate}
              onChange={setBasicDate}
              width="100%"
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
            title="Stay booking"
            useWhen="Lodging or short-stay rentals where guests pick check-in and check-out."
            demonstrates="Range mode with disabled past dates, basic stay presets, and a clear/animated selected summary."
            appearance="soft"
            code={`const [stayRange, setStayRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, []);

<Calendar mode="range" value={stayRange} onChange={setStayRange} disabled={noPast} appearance={soft}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarPresets presets={basicPresets.slice(4, 9)} />
  <CalendarDays />
  <CalendarNav compactYears clear home themeToggle />
  <CalendarSelectedDates allowClear allowNavigate animated />
</Calendar>`}
          >
            <Calendar
              mode="range"
              value={stayRange}
              onChange={setStayRange}
              disabled={noPast}
              appearance={soft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarPresets presets={basicPresets.slice(4, 9)} />
              <CalendarDays />
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarHome />
                <CalendarToolbarClear />
                <CalendarToolbarThemeToggle />
              </CalendarToolbar>
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            wide
            title="Flight search"
            useWhen="Booking flow needing departure and return without a full second month grid."
            demonstrates={`Split bound tracks (\`bound="from"\` / \`bound="to"\`) for compact range selection across two columns.`}
            theme="temporal"
            appearance="compact"
            code={`const [flightRange, setFlightRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, []);

<Calendar mode="range" value={flightRange} onChange={setFlightRange} disabled={noPast} theme={temporal} appearance={compact}>
  <CalendarNav label="Departure" monthLabel yearLabel clear />
  <CalendarMonthsTrack bound="from" short />
  <CalendarDaysTrack bound="from" showMonthLabel />
  <CalendarNav label="Return" monthLabel yearLabel />
  <CalendarMonthsTrack bound="to" short />
  <CalendarDaysTrack bound="to" showMonthLabel />
  <CalendarSelectedDates allowClear animated />
</Calendar>`}
          >
            <Calendar
              mode="range"
              value={flightRange}
              onChange={setFlightRange}
              disabled={noPast}
              theme={temporal}
              appearance={compact}
              width="100%"
              cols={2}
            >
              <CalendarToolbar col={1}>
                <CalendarToolbarLabel label="Departure" />
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarToolbar col={1}>
                <CalendarToolbarLabel label="Return" />
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarMonthsTrack col={1} bound="from" />
              <CalendarMonthsTrack col={1} bound="to" />
              <CalendarDaysTrack col={1} bound="from" />
              <CalendarDaysTrack col={1} bound="to" />
              <CalendarSelectedDates animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Two-month stay search"
            useWhen="Desktop booking with side-by-side months and a single shared range."
            demonstrates={`\`cols={2}\` with two \`CalendarDays\` (offset 0 and 1) and one continuous range value.`}
            theme="snow"
            appearance="soft"
            code={`const [twoMonthRange, setTwoMonthRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, []);

<Calendar mode="range" value={twoMonthRange} onChange={setTwoMonthRange} disabled={noPast} cols={2}>
  <CalendarNav showMonthPicker compactYears col={1} />
  <CalendarNav offset={1} monthLabel clear col={1} />
  <CalendarDays col={1} />
  <CalendarDays offset={1} col={1} />
  <CalendarSelectedDates allowClear allowNavigate animated />
</Calendar>`}
            wide
          >
            <Calendar
              mode="range"
              value={twoMonthRange}
              onChange={setTwoMonthRange}
              disabled={noPast}
              theme={snow}
              appearance={soft}
              cols={2}
              width="100%"
            >
              <CalendarToolbar col={1}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={1}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays col={1} />
              <CalendarDays offset={1} col={1} />
              <CalendarSelectedDates allowClear allowNavigate animated />
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

<Calendar mode="multiple" value={sixMonthDates} defaultViewDate={new Date("2026-05-01")} readOnly cols={3} appearance={compact}>
  <CalendarNav monthLabel yearLabel col={1} />
  <CalendarNav monthLabel yearLabel offset={1} col={1} />
  <CalendarNav monthLabel yearLabel offset={2} col={1} />
  <CalendarDays col={1} />
  <CalendarDays offset={1} col={1} />
  <CalendarDays offset={2} col={1} />
  <CalendarNav monthLabel yearLabel offset={3} col={1} />
  <CalendarNav monthLabel yearLabel offset={4} col={1} />
  <CalendarNav monthLabel yearLabel offset={5} col={1} />
  <CalendarDays offset={3} col={1} />
  <CalendarDays offset={4} col={1} />
  <CalendarDays offset={5} col={1} /> 
</Calendar>`}
            wide
          >
            <Calendar
              mode="multiple"
              value={sixMonthDates}
              defaultViewDate={new Date(2026, 4, 1)}
              readOnly
              theme={industrial}
              appearance={compact}
              cols={3}
              width="100%"
            >
              <CalendarToolbar col={1}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={1}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={2}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays col={1} />
              <CalendarDays offset={1} col={1} />
              <CalendarDays offset={2} col={1} />
              <CalendarToolbar col={1} offset={3}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={4}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarToolbar col={1} offset={5}>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
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

<Calendar mode="multiple" value={deliveryDates} onChange={setDeliveryDates} maxDates={4} disabled={weekdaysOnly}>
  <CalendarNav compactMonths showYearPicker clear />
  <CalendarDays />
  <CalendarSelectedDates allowClear animated />
</Calendar>`}
          >
            <Calendar
              mode="multiple"
              value={deliveryDates}
              onChange={setDeliveryDates}
              maxDates={4}
              disabled={weekdaysOnly}
              theme={mint}
              appearance={soft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarYearTrigger compact />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
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

<Calendar
  mode="single"
  value={dropDate}
  onChange={setDropDate}
  defaultViewDate={new Date("2026-07-10")}
  minDate={new Date("2026-07-10")}
  maxDate={new Date("2026-07-18")}
  disabled={dropDisabled}
>
  <CalendarNav monthLabel yearLabel clear />
  <CalendarDays hideOutOfRange fixedRows={false} />
  <CalendarSelectedDates allowClear animated />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={dropDate}
              onChange={setDropDate}
              defaultViewDate={new Date(2026, 6, 10)}
              minDate={new Date(2026, 6, 10)}
              maxDate={new Date(2026, 6, 18)}
              disabled={dropDisabled}
              theme={riso}
              appearance={compact}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays hideOutOfRange fixedRows={false} />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Appointment booking"
            useWhen="Doctor, salon, or restaurant reservations needing date and time in one step."
            demonstrates={`Single mode + \`CalendarTimeGrid\` + nav with \`showTime\`.`}
            theme="aurora"
            appearance="loft"
            code={`const [appointment, setAppointment] = useState<Date | null>(null);

const weekdaysOnly = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ weekends: true, before: today });
}, []);

<Calendar gradient mode="single" value={appointment} onChange={setAppointment} disabled={weekdaysOnly}>
  <CalendarNav showTime showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarTimeGrid />
  <CalendarSelectedDates allowClear showTime />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={appointment}
              gradient
              onChange={setAppointment}
              disabled={weekdaysOnly}
              theme={aurora}
              appearance={loft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarTime />
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
            code={`const [reportRange, setReportRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const analyticsPresets = [
  { label: "Today", value: 0 },
  { label: "Last 7 days", value: -6, range: 6 },
  { label: "Last 30 days", value: -29, range: 29 },
];

<Calendar mode="range" value={reportRange} onChange={setReportRange}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarPresets presets={analyticsPresets} />
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate animated />
</Calendar>`}
          >
            <Calendar
              mode="range"
              value={reportRange}
              onChange={setReportRange}
              theme={graphite}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarPresets presets={analyticsPresets} />
              <CalendarDays />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Support quick dates"
            useWhen={`Reminders or follow-ups where "Tomorrow" or "Next Monday" covers most cases.`}
            demonstrates={`Single mode with custom presets, including dynamic ones via \`getValue\`.`}
            theme="mint"
            appearance="soft"
            code={`const [singlePresetDate, setSinglePresetDate] = useState<Date | null>(null);

const supportPresets = useMemo<PresetEntry[]>(
  () => [
    { label: "Today", value: 0 },
    { label: "Tomorrow", value: 1 },
    { label: "In 3 days", value: 3 },
    {
      id: "next-monday",
      label: "Next Monday",
      getValue: ({ now, isValid }) => {
        const date = new Date(now);
        const delta = (8 - date.getDay()) % 7 || 7;
        date.setDate(date.getDate() + delta);
        return isValid(date) ? date : null;
      },
    },
  ],
  [],
);

<Calendar mode="single" value={singlePresetDate} onChange={setSinglePresetDate}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarPresets presets={supportPresets} />
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate animated />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={singlePresetDate}
              onChange={setSinglePresetDate}
              theme={mint}
              appearance={soft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarPresets presets={supportPresets} />
              <CalendarDays />
              <CalendarSelectedDates allowClear allowNavigate animated />
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

const holidayPresets = useMemo<PresetEntry[]>(
  () => [
    {
      id: "new-year",
      label: "New Year",
      getValue: ({ now, isValid }) => {
        const year =
          now.getMonth() > 0 || now.getDate() > 1
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 0, 1);
        return isValid(date) ? date : null;
      },
    },
    {
      id: "independence-day",
      label: "Independence Day",
      getValue: ({ now, isValid }) => {
        const year =
          now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 4)
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 6, 4);
        return isValid(date) ? date : null;
      },
    },
    {
      id: "christmas-day",
      label: "Christmas Day",
      getValue: ({ now, isValid }) => {
        const year =
          now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 25)
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 11, 25);
        return isValid(date) ? date : null;
      },
    },
    {
      id: "thanksgiving-day",
      label: "Thanksgiving",
      getValue: ({ now, isValid }) => {
        const year = now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
        const date = nthWeekdayOfMonth(year, 10, 4, 4);
        return isValid(date) ? date : null;
      },
    },
    {
      id: "christmas-eve",
      label: "Christmas Eve",
      getValue: ({ now, isValid }) => {
        const year =
          now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 24)
            ? now.getFullYear() + 1
            : now.getFullYear();
        const date = new Date(year, 11, 24);
        return isValid(date) ? date : null;
      },
    },
    {
      id: "black-friday",
      label: "Black Friday",
      getValue: ({ now, isValid }) => {
        const year = now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
        const date = nthWeekdayOfMonth(year, 10, 4, 4);
        date.setDate(date.getDate() + 1);
        return isValid(date) ? date : null;
      },
    },
  ],
  [],
);

<Calendar mode="multiple" value={holidayRange} onChange={setHolidayRange} cols={2}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarPresets presets={holidayPresets} />
  <CalendarDays />
  <CalendarMonthsGrid col={1} />
  <CalendarYearsGrid col={1} />
  <CalendarSelectedDates allowClear allowNavigate animated />
</Calendar>`}
            medium
          >
            <Calendar
              mode="multiple"
              value={holidayRange}
              onChange={setHolidayRange}
              theme={snow}
              appearance={compact}
              cols={2}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarPresets presets={holidayPresets} />
              <CalendarDays />
              <CalendarMonthsGrid col={1} />
              <CalendarYearsGrid col={1} />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Brand theme picker"
            useWhen="Branded checkout or onboarding where the picker has to match a custom palette."
            demonstrates={`\`createTheme\` with full token override (highlight, accent, backdrop, range, etc.).`}
            theme="custom"
            appearance="soft"
            code={`const [brandDate, setBrandDate] = useState<Date | null>(null);

const brandTheme = useMemo(
  () =>
    createTheme({
        highlight: "#f4f96f",
        accent: "#27a925",
        backdrop: "#eae0f1",
        tone:"#ee1818",
        text: "#282626",
        stroke: "#cbd5e1",
        range: "#ccfbf1",
        shadow:'#b9c2cc', 
    }),
  [],
);

<Calendar mode="single" value={brandDate} onChange={setBrandDate} theme={brandTheme}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarSelectedDates allowClear animated />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={brandDate}
              onChange={setBrandDate}
              theme={brandTheme}
              appearance={soft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Dense product filter"
            useWhen="Compact dashboards where calendar rhythm needs to match dense data UI."
            demonstrates={`\`createAppearance\` with custom radius, spacing, font size, and \`dayRatio\`.`}
            theme="graphite"
            appearance="custom"
            code={`const [denseRange, setDenseRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const denseAppearance = useMemo(
  () =>
    createAppearance({
      radius: "5px",
      spacing: "0.42em",
      fontSize: "13px",
      dayRatio: "1 / 0.78",
      transition: "120ms ease",
    }),
  [],
);

<Calendar mode="range" value={denseRange} onChange={setDenseRange} appearance={denseAppearance}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarSelectedDates allowClear animated />
</Calendar>`}
          >
            <Calendar
              mode="range"
              value={denseRange}
              onChange={setDenseRange}
              theme={graphite}
              appearance={denseAppearance}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Vacation request"
            useWhen="HR-style time off with min and max length rules."
            demonstrates={`Range mode with \`minRangeDays\` / \`maxRangeDays\` and weekday-only disabled rule.`}
            theme="riso"
            appearance="square"
            code={`const [vacationRange, setVacationRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const weekdaysOnly = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ weekends: true, before: today });
}, []);

<Calendar
  mode="range"
  value={vacationRange}
  onChange={setVacationRange}
  disabled={weekdaysOnly}
  minRangeDays={2}
  maxRangeDays={21}
>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarSelectedDates allowClear animated />
</Calendar>`}
          >
            <Calendar
              mode="range"
              value={vacationRange}
              onChange={setVacationRange}
              disabled={weekdaysOnly}
              minRangeDays={2}
              maxRangeDays={21}
              theme={riso}
              appearance={square}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Sprint planning"
            useWhen="Engineering planning around current sprint, next sprint, release week."
            demonstrates="Range mode with custom-length presets (offset + range)."
            theme="industrial"
            code={`const [sprintRange, setSprintRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const sprintPresets = [
  { label: "Current sprint", value: 0, range: 13 },
  { label: "Next sprint", value: 14, range: 13 },
  { label: "Release week", value: 28, range: 6 },
];

<Calendar mode="range" value={sprintRange} onChange={setSprintRange}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarPresets presets={sprintPresets} />
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate animated />
</Calendar>`}
          >
            <Calendar
              mode="range"
              value={sprintRange}
              onChange={setSprintRange}
              theme={industrial}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarPresets presets={sprintPresets} />
              <CalendarDays />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Invoice due date"
            useWhen="Billing form where users want to type or pick the date with a strict allowed window."
            demonstrates={`\`CalendarManualInput\` paired with the picker, \`locale\`, and min/max dates.`}
            theme="snow"
            appearance="soft"
            code={`const [manualDate, setManualDate] = useState<Date | null>(null);

<Calendar
  mode="single"
  value={manualDate}
  onChange={setManualDate}
  locale="de-DE"
  minDate={new Date("2026-05-01")}
  maxDate={new Date("2026-08-31")}
>
  <CalendarManualInput allowClear />
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={manualDate}
              onChange={setManualDate}
              locale="de-DE"
              minDate={new Date(2026, 4, 1)}
              maxDate={new Date(2026, 7, 31)}
              theme={snow}
              appearance={soft}
              width="100%"
            >
              <CalendarManualInput allowClear />
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays />
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
    mode="single"
    defaultViewDate={new Date("2026-01-01")}
    minDate={new Date("2018-01-01")}
    maxDate={new Date("2030-12-31")}
  >
    <CalendarYearsGrid
      yearsPerPage={12}
      onYearSelect={(date: Date) => setArchiveYear(date)}
    />
  </Calendar>
  {archiveYear && <p>Browsing archive · {archiveYear.getFullYear()}</p>}
</>`}
          >
            <Calendar
              mode="single"
              defaultViewDate={archiveDate}
              minDate={new Date(2018, 0, 1)}
              maxDate={new Date(2030, 11, 31)}
              theme={graphite}
              appearance={compact}
              width="100%"
            >
              <CalendarYearsGrid
                yearsPerPage={12}
                onYearSelect={(year: Date) => setArchiveYear(year)}
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
    mode="single"
    defaultViewDate={new Date("2026-05-01")}
    minDate={new Date("2026-01-01")}
    maxDate={new Date("2026-12-31")}
    gradient
  >
    <CalendarMonthsGrid
      short
      onMonthSelect={(date: Date) => setCampaignMonth(date)}
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
              mode="single"
              defaultViewDate={campaignDate}
              gradient
              theme={temporal}
              appearance={soft}
              width="100%"
            >
              <CalendarMonthsGrid
                short
                onMonthSelect={(date: Date) => setCampaignMonth(date)}
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
            demonstrates={`Solo \`CalendarTimeGrid\` with \`timeStep={{ minute: 10 }}\` for snapped slots.`}
            theme="aurora"
            appearance="loft"
            code={`const [meetingTime, setMeetingTime] = useState<Date | null>(null);

<>
  <Calendar
    mode="single"
    value={meetingTime}
    onChange={setMeetingTime}
    timeStep={{ minute: 10 }}
  >
    <CalendarTimeGrid />
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
              mode="single"
              value={meetingTime}
              onChange={setMeetingTime}
              timeStep={{ minute: 10 }}
              theme={aurora}
              appearance={loft}
              width="100%"
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

<Calendar
  mode="single"
  value={globalMeeting}
  onChange={setGlobalMeeting}
  timeZone="America/New_York"
  hour12
  disabled={noPast}
>
  <CalendarNav showTime showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarTimeGrid />
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
              mode="single"
              value={globalMeeting}
              onChange={setGlobalMeeting}
              timeZone="America/New_York"
              hour12
              disabled={noPast}
              theme={aurora}
              appearance={loft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarTime />
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

<Calendar mode="single" value={birthday} onChange={setBirthday} appearance={bubble}>
  <CalendarYearsTrack />
  <CalendarMonthsTrack short />
  <CalendarDaysTrack showMonthLabel />
  <CalendarSelectedDates allowClear />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={birthday}
              onChange={setBirthday}
              theme={nebula}
              appearance={bubble}
              width="100%"
            >
              <CalendarYearsTrack />
              <CalendarMonthsTrack short />
              <CalendarDaysTrack showMonthLabel />
              <CalendarSelectedDates allowClear />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Blackout calendar"
            useWhen="Operations calendars with weekends, maintenance windows, and exact blackout dates."
            demonstrates={`Range mode with composite \`createDisabled\` (weekends + before + ranges + dates).`}
            theme="graphite"
            appearance="compact"
            code={`const [blackoutRange, setBlackoutRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const blackout = createDisabled({
  weekends: true,
  before: new Date(),
  ranges: [{ from: new Date("2026-06-10"), to: new Date("2026-06-14") }],
});

<Calendar mode="range" value={blackoutRange} onChange={setBlackoutRange} disabled={blackout}>
  <CalendarNav compactMonths compactYears clear />
  <CalendarDays />
  <CalendarSelectedDates allowClear animated />
</Calendar>`}
          >
            <Calendar
              mode="range"
              value={blackoutRange}
              onChange={setBlackoutRange}
              disabled={blackout}
              theme={graphite}
              appearance={compact}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthTrigger compact />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext />
                <CalendarToolbarClear />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Launch day"
            useWhen="Locked launches, archive screens, or confirmed bookings."
            demonstrates={`\`readOnly\` flag plus \`allowNavigate\` on the selected dates display.`}
            theme="snow"
            appearance="soft"
            code={`const launchDate = new Date(2026, 8, 9);

<Calendar mode="single" value={launchDate} readOnly>
  <CalendarNav monthLabel yearLabel />
  <CalendarDays />
  <CalendarSelectedDates allowNavigate animated />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={launchDate}
              readOnly
              theme={snow}
              appearance={soft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev />
                <CalendarToolbarMonthLabel />
                <CalendarToolbarYearLabel />
                <CalendarToolbarNext />
              </CalendarToolbar>
              <CalendarDays />
              <CalendarSelectedDates allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Month wheel + day grid"
            useWhen="Compact pickers where month is spun via drum, day selected via grid."
            demonstrates={`\`cols={2}\`, arrows navigate by year, wheel handles month, YearTrigger compact at right.`}
            theme="temporal"
            appearance="soft"
            wide
            code={`<Calendar mode="single" value={date} onChange={setDate} cols={2}>
  <CalendarToolbar>
    <CalendarToolbarPrev unit="year" />
    <CalendarToolbarYearTrigger  />
    <CalendarToolbarNext unit="year" />
  </CalendarToolbar>
  <CalendarMonthsWheel col={1} showLabel />
  <CalendarDays col={1} />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={basicDate}
              onChange={setBasicDate}
              cols={2}
              theme={temporal}
              appearance={soft}
              width="100%"
            >
              <CalendarToolbar>
                <CalendarToolbarPrev unit="year" />
                <CalendarToolbarYearTrigger />
                <CalendarToolbarNext unit="year" />
              </CalendarToolbar>
              <CalendarMonthsWheel col={1} showLabel />
              <CalendarDays col={1} />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Lunar phase strip"
            useWhen="Astrology apps, farming calendars, tide trackers, or any domain where lunar phase is meaningful."
            demonstrates={`\`CalendarLunar\` below the day grid — display-only, no interaction.`}
            theme="nebula"
            appearance="soft"
            code={`import { CalendarLunar } from "@dateforge/react-calendar/modules/lunar";

<Calendar mode="single" value={date} onChange={setDate}>
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
              mode="single"
              value={basicDate}
              onChange={setBasicDate}
              theme={nebula}
              appearance={soft}
              width="100%"
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
        </div>
      </div>
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
    <section className="border-y border-zinc-200/80 bg-white/75 px-0 py-4 shadow-sm backdrop-blur sm:rounded-2xl sm:border sm:p-4">
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
    /(\/\/.*|import|from|const|return|useMemo|useState|new|type|Calendar|createDisabled|createTheme|createAppearance|basicPresets|PresetEntry|("[^"]*"|'[^']*')|(<\/?[A-Z][A-Za-z0-9]*)|([{}()[\]=/>]+))/g;
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

function getTags(title: string) {
  const tagsByTitle: Record<string, string[]> = {
    "The basics": ["single", "starter"],
    "Stay booking": ["range", "booking", "presets"],
    "Flight search": ["range", "mobile"],
    "Two-month stay search": ["2 months", "desktop"],
    "Six-month availability": ["read-only", "6 months", "availability"],
    "Delivery slots": ["multiple", "capacity"],
    "Limited drop window": ["hideOutOfRange", "disabled"],
    "Appointment booking": ["time", "scheduling", "gradient"],
    "Analytics dashboard": ["range", "reports"],
    "Support quick dates": ["single presets", "support"],
    "Holiday planner": ["advanced presets", "holidays", "multiple"],
    "Brand theme picker": ["createTheme", "brand"],
    "Dense product filter": ["createAppearance", "dashboard"],
    "Vacation request": ["constraints", "HR"],
    "Sprint planning": ["presets", "planning"],
    "Invoice due date": ["manual input", "billing"],
    "Archive year browser": ["years grid", "archive"],
    "Campaign month picker": ["months grid", "campaign"],
    "Time slot picker": ["time grid", "slots"],
    "Global meeting time": ["time zone", "hour12"],
    "Profile birthday": ["tracks", "profile"],
    "Blackout calendar": ["disabled", "operations"],
    "Launch day": ["read-only", "status"],
  };

  return tagsByTitle[title] ?? ["calendar"];
}

function withImports(title: string, body: string) {
  const importsByTitle: Record<string, string> = {
    "The basics": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Stay booking": `import { useMemo, useState } from "react";
import { Calendar, basicPresets, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import { soft } from "@dateforge/react-calendar/appearances";`,
    "Flight search": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDaysTrack, CalendarMonthsTrack, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import { temporal } from "@dateforge/react-calendar/themes";
import { compact } from "@dateforge/react-calendar/appearances";`,
    "Two-month stay search": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Six-month availability": `import { useMemo } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import { compact } from "@dateforge/react-calendar/appearances";`,
    "Delivery slots": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Limited drop window": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Appointment booking": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates, CalendarTimeGrid } from "@dateforge/react-calendar/modules";`,
    "Analytics dashboard": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Support quick dates": `import { useMemo, useState } from "react";
import { Calendar, type PresetEntry } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Holiday planner": `import { useMemo, useState } from "react";
import { Calendar, type PresetEntry } from "@dateforge/react-calendar";
import { CalendarDays, CalendarMonthsGrid, CalendarNav, CalendarPresets, CalendarSelectedDates, CalendarYearsGrid } from "@dateforge/react-calendar/modules";`,
    "Brand theme picker": `import { useMemo, useState } from "react";
import { Calendar, createTheme } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Dense product filter": `import { useMemo, useState } from "react";
import { Calendar, createAppearance } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Vacation request": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Sprint planning": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Invoice due date": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarManualInput, CalendarNav } from "@dateforge/react-calendar/modules";`,
    "Archive year browser": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarYearsGrid } from "@dateforge/react-calendar/modules";`,
    "Campaign month picker": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarMonthsGrid } from "@dateforge/react-calendar/modules";`,
    "Time slot picker": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarTimeGrid } from "@dateforge/react-calendar/modules";`,
    "Global meeting time": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates, CalendarTimeGrid } from "@dateforge/react-calendar/modules";`,
    "Profile birthday": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDaysTrack, CalendarMonthsTrack, CalendarSelectedDates, CalendarYearsTrack } from "@dateforge/react-calendar/modules";
import { bubble } from "@dateforge/react-calendar/appearances";`,
    "Blackout calendar": `import { useMemo, useState } from "react";
import { Calendar, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Launch day": `import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
  };

  const imports =
    importsByTitle[title] ??
    `import { Calendar } from "@dateforge/react-calendar";`;
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
