"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clipboard,
} from "lucide-react";
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
  CalendarNav,
  CalendarPresets,
  CalendarSelectedDates,
  CalendarTimeGrid,
  CalendarYearsGrid,
  CalendarYearsTrack,
} from "@dateforge/react-calendar/modules";
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
  midnight,
  mint,
  riso,
  snow,
  temporal,
} from "@dateforge/react-calendar/themes";

type RangeValue = { from: Date | null; to: Date | null };

const emptyRange = (): RangeValue => ({ from: null, to: null });
const STORYBOOK_URL = "https://kirilinsky.github.io/dateforge-react-calendar/";

export default function ExamplesPage() {
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
  const [appointment, setAppointment] = useState<Date | null>(null);
  const [globalMeeting, setGlobalMeeting] = useState<Date | null>(null);
  const [manualDate, setManualDate] = useState<Date | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(new Date(1994, 5, 14));
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
        <header className="flex h-9 items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950"
          >
            <ArrowLeft size={16} />
            DateForge
          </Link>
          <Link
            href={STORYBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white"
          >
            Storybook
            <ArrowUpRight size={15} />
          </Link>
        </header>

        <section className="py-10 text-center sm:py-12">
          <p className="text-sm font-medium text-zinc-500">Examples</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Real date flows you can start from.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Each example is a live composition of DateForge modules: booking,
            operations, dashboards, forms, and scheduling patterns. Storybook
            stays the open-ended playground; this page is for finished recipes.
          </p>
        </section>

        <div className="-mx-5 flex flex-col gap-5 sm:mx-auto sm:max-w-[1720px]">
          <ExampleCard
            title="Stay booking"
            text="A lodging-style date range picker: no past dates, shortcuts, and selected stay feedback."
            code={`const noPast = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ before: today });
}, [])

<Calendar mode="range" value={stayRange} onChange={setStayRange} disabled={noPast} theme={snow} appearance={soft}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarPresets presets={basicPresets.slice(4, 9)} />
  <CalendarDays />
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
              <CalendarNav showMonthPicker clear />
              <CalendarPresets presets={basicPresets.slice(4, 9)} />
              <CalendarDays />
              <CalendarNav compactYears clear home themeToggle />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            wide
            title="Flight search"
            text="A split departure and return picker that uses bound tracks instead of another full month grid."
            code={`const noPast = useMemo(() => {
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
              <CalendarNav col={1} label="Departure" monthLabel />
              <CalendarNav col={1} label="Return" monthLabel clear />
              <CalendarMonthsTrack col={1} bound="from" />
              <CalendarMonthsTrack col={1} bound="to" />
              <CalendarDaysTrack col={1} bound="from" />
              <CalendarDaysTrack col={1} bound="to" />
              <CalendarSelectedDates animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Two-month stay search"
            text="A desktop booking pattern with adjacent months and one shared range value."
            code={`const noPast = useMemo(() => {
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
              <CalendarNav showMonthPicker compactYears col={1} />
              <CalendarNav offset={1} monthLabel col={1} clear />
              <CalendarDays col={1} />
              <CalendarDays offset={1} col={1} />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Six-month availability"
            text="A read-only half-year availability map that shows selected open days across separate monthly stretches."
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
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Delivery slots"
            text="Pick up to four delivery dates, with weekends and past dates unavailable."
            code={`const weekdaysOnly = useMemo(() => {
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
              <CalendarNav compactMonths showYearPicker clear />
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Limited drop window"
            text="A launch signup with only a few visible days: outside dates and blocked dates are hidden."
            code={`const dropDisabled = useMemo(
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
              <CalendarNav monthLabel yearLabel clear />
              <CalendarDays hideOutOfRange fixedRows={false} />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Appointment booking"
            text="A doctor, salon, or restaurant reservation with date and time in one flow."
            code={`const weekdaysOnly = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return createDisabled({ weekends: true, before: today });
}, []);

<Calendar mode="single" value={appointment} onChange={setAppointment} disabled={weekdaysOnly}>
  <CalendarNav showTime showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarTimeGrid />
  <CalendarSelectedDates allowClear showTime />
</Calendar>`}
          >
            <Calendar
              mode="single"
              value={appointment}
              onChange={setAppointment}
              disabled={weekdaysOnly}
              theme={aurora}
              appearance={loft}
              width="100%"
            >
              <CalendarNav showTime showMonthPicker compactYears clear />
              <CalendarDays />
              <CalendarTimeGrid />
              <CalendarSelectedDates allowClear showTime />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Analytics dashboard"
            text="Report filters with ranges users recognize: last 7, last 30, quarter."
            code={`const analyticsPresets = [
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarPresets presets={analyticsPresets} />
              <CalendarDays />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Support quick dates"
            text="Single-date presets for support follow-ups, reminders, and lightweight task scheduling."
            code={`const supportPresets = useMemo<PresetEntry[]>(
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarPresets presets={supportPresets} />
              <CalendarDays />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Holiday planner"
            text="Custom advanced presets for seasonal planning: Christmas, Thanksgiving, and other holidays."
            code={`function nthWeekdayOfMonth(year: number, month: number, weekday: number, occurrence: number) {
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarPresets presets={holidayPresets} />
              <CalendarDays />
              <CalendarMonthsGrid col={1} />
              <CalendarYearsGrid col={1} />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Brand theme picker"
            text="A branded checkout or onboarding date field using a custom theme object."
            code={`const brandTheme = useMemo(
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Dense product filter"
            text="A custom appearance for dense dashboards where rhythm and cell shape matter more than decoration."
            code={`const denseAppearance = useMemo(
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Vacation request"
            text="HR-style time off selection with a minimum and maximum range length."
            code={`const weekdaysOnly = useMemo(() => {
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Sprint planning"
            text="Planning presets for current sprint, next sprint, and release week."
            code={`const sprintPresets = [
  { label: "Current sprint", value: 0, range: 13 },
  { label: "Next sprint", value: 14, range: 13 },
  { label: "Release week", value: 28, range: 6 },
];

<Calendar mode="range" value={sprintRange} onChange={setSprintRange}>
  <CalendarNav showMonthPicker compactYears clear />
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarPresets presets={sprintPresets} />
              <CalendarDays />
              <CalendarSelectedDates allowClear allowNavigate animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Invoice due date"
            text="A billing form where typing and tapping stay connected, with a real allowed window."
            code={`<Calendar
  mode="single"
  value={manualDate}
  onChange={setManualDate}
  locale="de-DE"
  minDate={new Date("2026-05-01")}
  maxDate={new Date("2026-08-31")}
>
  <CalendarManualInput allowClear />
  <CalendarNav showMonthPicker compactYears clear />
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
              <CalendarNav showMonthPicker compactYears clear />
              <CalendarDays />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Archive year browser"
            text="Only the years grid: useful for archive navigation, annual reports, and timeline filters."
            code={`<Calendar
  mode="single"
  defaultViewDate={new Date("2026-01-01")}
  minDate={new Date("2018-01-01")}
  maxDate={new Date("2030-12-31")}
>
  <CalendarYearsGrid yearsPerPage={12} />
</Calendar>`}
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
              <CalendarYearsGrid yearsPerPage={12} />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Campaign month picker"
            text="Only the months grid: a lightweight season, campaign, or billing-period selector."
            code={`<Calendar
  mode="single"
  defaultViewDate={new Date("2026-05-01")}
  minDate={new Date("2026-01-01")}
  maxDate={new Date("2026-12-31")} 
  gradient
>
  <CalendarMonthsGrid short />
</Calendar>`}
          >
            <Calendar
              mode="single"
              defaultViewDate={campaignDate}
              gradient
              theme={temporal}
              appearance={soft}
              width="100%"
            >
              <CalendarMonthsGrid short />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Global meeting time"
            text="Scheduling across time zones with 12-hour labels and seconds when precision matters."
            code={`const noPast = useMemo(() => {
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
  <CalendarNav showTime seconds showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarTimeGrid seconds />
  <CalendarSelectedDates allowClear showTime />
</Calendar>`}
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
              <CalendarNav
                showTime
                seconds
                showMonthPicker
                compactYears
                clear
              />
              <CalendarDays />
              <CalendarTimeGrid seconds />
              <CalendarSelectedDates allowClear showTime />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Profile birthday"
            text="Track-driven selection for older dates where jumping across years matters."
            code={`<Calendar mode="single" value={birthday} onChange={setBirthday} appearance={bubble}>
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
              theme={midnight}
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
            text="Operations calendar with weekends, maintenance windows, and exact blackout dates."
            code={`const blackout = createDisabled({
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
              <CalendarNav compactMonths compactYears clear />
              <CalendarDays />
              <CalendarSelectedDates allowClear animated />
            </Calendar>
          </ExampleCard>

          <ExampleCard
            title="Launch day"
            text="Read-only state for locked launches, archive screens, or confirmed bookings."
            code={`<Calendar mode="single" value={launchDate} readOnly>
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
              <CalendarNav monthLabel yearLabel />
              <CalendarDays />
              <CalendarSelectedDates allowNavigate animated />
            </Calendar>
          </ExampleCard>
        </div>
      </div>
    </main>
  );
}

function ExampleCard({
  title,
  text,
  code,
  featured = false,
  medium = false,
  wide = false,
  children,
}: {
  title: string;
  text: string;
  code: string;
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
            <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-zinc-400">
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
    "Stay booking": ["range", "booking", "presets"],
    "Flight search": ["range", "mobile"],
    "Two-month stay search": ["2 months", "desktop"],
    "Six-month availability": ["read-only", "6 months", "availability"],
    "Delivery slots": ["multiple", "capacity"],
    "Limited drop window": ["hideOutOfRange", "disabled"],
    "Appointment booking": ["time", "scheduling"],
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
    "Global meeting time": ["time zone", "hour12"],
    "Profile birthday": ["tracks", "profile"],
    "Blackout calendar": ["disabled", "operations"],
    "Launch day": ["read-only", "status"],
  };

  return tagsByTitle[title] ?? ["calendar"];
}

function withImports(title: string, body: string) {
  const importsByTitle: Record<string, string> = {
    "Stay booking": `import { useMemo, useState } from "react";
import { Calendar, basicPresets, createDisabled } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";
import { snow } from "@dateforge/react-calendar/themes";
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
    "Analytics dashboard": `import { useMemo, useState } from "react";
import { Calendar, type PresetEntry } from "@dateforge/react-calendar";
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
    "Sprint planning": `import { useMemo, useState } from "react";
import { Calendar, type PresetEntry } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarPresets, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
    "Invoice due date": `import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarManualInput, CalendarNav } from "@dateforge/react-calendar/modules";`,
    "Archive year browser": `import { Calendar } from "@dateforge/react-calendar";
import { CalendarYearsGrid } from "@dateforge/react-calendar/modules";`,
    "Campaign month picker": `import { Calendar } from "@dateforge/react-calendar";
import { CalendarMonthsGrid } from "@dateforge/react-calendar/modules";`,
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
    "Launch day": `import { useMemo } from "react";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav, CalendarSelectedDates } from "@dateforge/react-calendar/modules";`,
  };

  return `${importsByTitle[title] ?? `import { Calendar } from "@dateforge/react-calendar";`}

${body}`;
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
