"use client";

import { useState } from "react";
import {
  Calendar,
  createDisabled,
  createTheme,
  type DateRange,
  type PresetEntry,
} from "@dateforge/react-calendar";
import {
  CalendarDays,
  CalendarDaysTrack,
  CalendarInfo,
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
import { bubble, compact, soft } from "@dateforge/react-calendar/appearances";
import { monsoon } from "@dateforge/react-calendar/themes";
import { CalendarPreview } from "../CalendarPreview";
import { CodeBlock } from "./CodeBlock";

export type RecipeKind =
  | "Minimal single date"
  | "Booking range"
  | "Analytics range with presets"
  | "Date and time"
  | "Mobile tracks"
  | "Bubble appearance"
  | "Custom theme"
  | "Monsoon theme"
  | "Disabled dates example"
  | "Holiday presets example";

export const MODULE_NAMES = [
  "Calendar",
  "CalendarNav",
  "CalendarDays",
  "CalendarTimeGrid",
  "CalendarPresets",
  "CalendarSelectedDates",
  "CalendarManualInput",
  "CalendarInfo",
  "CalendarDaysTrack",
  "CalendarMonthsTrack",
  "CalendarYearsTrack",
  "CalendarMonthsGrid",
  "CalendarYearsGrid",
] as const;

export type ModuleName = (typeof MODULE_NAMES)[number];

const disabledRules = createDisabled({
  weekends: true,
  before: new Date(2026, 4, 5),
  dates: [new Date(2026, 4, 14), new Date(2026, 4, 21)],
});

const brandTheme = createTheme({
  accent: "#10b981",
  activeText: "#ffffff",
  todayDot: "#064e3b",
  backdrop: "#ffffff",
  highlight: "#d1fae5",
  tone: "#e8eaed",
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

const analyticsPresets: PresetEntry[] = [
  { label: "Last 7 days", value: -6, range: 6 },
  { label: "Last 30 days", value: -29, range: 29 },
  { label: "Next sprint", value: 0, range: 13 },
];

const holidayPresets: PresetEntry[] = [
  { label: "New Year's Day", value: new Date(2027, 0, 1) },
  { label: "Christmas", value: new Date(2026, 11, 25) },
  {
    id: "holiday-season",
    label: "Holiday season",
    getValue: () => ({ from: new Date(2026, 11, 24), to: new Date(2027, 0, 2) }),
  },
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

export function isModuleName(text: string): text is ModuleName {
  return MODULE_NAMES.includes(text as ModuleName);
}

export function isRecipeKind(text: string): text is RecipeKind {
  return (
    text === "Minimal single date" ||
    text === "Booking range" ||
    text === "Analytics range with presets" ||
    text === "Date and time" ||
    text === "Mobile tracks" ||
    text === "Bubble appearance" ||
    text === "Custom theme" ||
    text === "Monsoon theme" ||
    text === "Disabled dates example" ||
    text === "Holiday presets example"
  );
}

export function SimplePresetShowcase({
  block,
}: {
  block: { lang: string; text: string };
}) {
  return (
    <section className="mb-10 space-y-4">
      <div className="flex justify-center rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-4 py-7 shadow-sm">
        <div className="w-full max-w-[300px]">
          <CalendarPreview
            width="100%"
            navLinks={[]}
            initialDate={new Date(2026, 4, 13)}
            defaultViewDate={new Date(2026, 4, 1)}
            useSavedAppearanceFallback={false}
            useSavedThemeFallback={false}
          />
        </div>
      </div>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={block.text} lang={block.lang} />
      </div>
    </section>
  );
}

export function MultiMonthPerformanceShowcase({
  code,
  lang,
}: {
  code: string;
  lang: string;
}) {
  const [range, setRange] = useState<DateRange>({
    from: new Date(2026, 6, 8),
    to: new Date(2026, 10, 16),
  });
  const rowStarts = [0, 3, 6, 9];

  return (
    <section className="mb-8 space-y-4">
      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-4 py-7 shadow-sm">
        <div className="min-w-[760px]">
          <Calendar
            mode="range"
            value={range}
            onChange={setRange}
            defaultViewDate={new Date(2026, 0, 1)}
            cols={3}
            width="100%"
            appearance={compact}
          >
            {rowStarts.flatMap((start) => [
              ...Array.from({ length: 3 }, (_, index) => {
                const offset = start + index;
                return (
                  <CalendarNav
                    key={`nav-${offset}`}
                    col={1}
                    offset={offset}
                    {...(offset === 0
                      ? { showMonthPicker: true, compactYears: true }
                      : { monthLabel: true, yearLabel: true })}
                  />
                );
              }),
              ...Array.from({ length: 3 }, (_, index) => {
                const offset = start + index;
                return (
                  <CalendarDays
                    key={`days-${offset}`}
                    col={1}
                    offset={offset}
                    currentMonthOnly
                    fixedRows={false}
                  />
                );
              }),
            ])}
            <CalendarSelectedDates col={3} />
          </Calendar>
        </div>
      </div>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={code} lang={lang} />
      </div>
    </section>
  );
}

export function RecipeShowcase({
  kind,
  code,
  lang,
}: {
  kind: RecipeKind;
  code: string;
  lang: string;
}) {
  return (
    <section className="mb-8 space-y-4">
      <div className="flex justify-center rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-4 py-7 shadow-sm">
        <div className="w-full max-w-[340px]">
          <RecipeCalendar kind={kind} />
        </div>
      </div>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={code} lang={lang} />
      </div>
    </section>
  );
}

export function ModuleShowcase({
  moduleName,
  code,
  lang,
}: {
  moduleName: ModuleName;
  code: string;
  lang: string;
}) {
  return (
    <section className="mb-8 space-y-4">
      <div className="flex justify-center rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-4 py-7 shadow-sm">
        <div className="w-full max-w-[340px]">
          <ModuleCalendar moduleName={moduleName} />
        </div>
      </div>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={code} lang={lang} />
      </div>
    </section>
  );
}

function RecipeCalendar({ kind }: { kind: RecipeKind }) {
  const [singleDate, setSingleDate] = useState<Date | null>(
    () => new Date(2026, 4, 13),
  );
  const [dateTime, setDateTime] = useState<Date | null>(
    () => new Date(2026, 4, 13, 10, 30),
  );
  const [bookingRange, setBookingRange] = useState<DateRange>({
    from: new Date(2026, 4, 12),
    to: new Date(2026, 4, 17),
  });
  const [analyticsRange, setAnalyticsRange] = useState<DateRange>({
    from: new Date(2026, 4, 1),
    to: new Date(2026, 4, 13),
  });
  const [trackRange, setTrackRange] = useState<DateRange>({
    from: new Date(2026, 4, 8),
    to: new Date(2026, 4, 20),
  });

  if (kind === "Booking range") {
    return (
      <Calendar
        mode="range"
        value={bookingRange}
        onChange={setBookingRange}
        defaultViewDate={new Date(2026, 4, 1)}
        appearance={soft}
      >
        <CalendarNav showMonthPicker compactYears clear />
        <CalendarDays />
        <CalendarSelectedDates allowClear allowNavigate />
      </Calendar>
    );
  }

  if (kind === "Analytics range with presets") {
    return (
      <Calendar
        mode="range"
        value={analyticsRange}
        onChange={setAnalyticsRange}
        defaultViewDate={new Date(2026, 4, 1)}
        appearance={soft}
      >
        <CalendarPresets presets={analyticsPresets} />
        <CalendarNav compactMonths compactYears />
        <CalendarDays />
        <CalendarSelectedDates />
      </Calendar>
    );
  }

  if (kind === "Date and time") {
    return (
      <Calendar
        mode="single"
        value={dateTime}
        onChange={setDateTime}
        defaultViewDate={new Date(2026, 4, 1)}
        timeStep={{ minute: 5 }}
        appearance={soft}
      >
        <CalendarNav showTime showMonthPicker />
        <CalendarDays />
        <CalendarTimeGrid />
      </Calendar>
    );
  }

  if (kind === "Disabled dates example") {
    return (
      <Calendar
        mode="single"
        value={singleDate}
        onChange={setSingleDate}
        defaultViewDate={new Date(2026, 4, 1)}
        disabled={disabledRules}
        appearance={soft}
      >
        <CalendarNav showMonthPicker compactYears />
        <CalendarDays />
      </Calendar>
    );
  }

  if (kind === "Holiday presets example") {
    return (
      <Calendar
        mode="single"
        value={singleDate}
        onChange={setSingleDate}
        defaultViewDate={new Date(2026, 11, 1)}
        appearance={soft}
      >
        <CalendarPresets presets={holidayPresets} />
        <CalendarNav showMonthPicker compactYears />
        <CalendarDays />
      </Calendar>
    );
  }

  if (kind === "Monsoon theme") {
    return (
      <Calendar
        mode="single"
        value={singleDate}
        onChange={setSingleDate}
        defaultViewDate={new Date(2026, 4, 1)}
        theme={monsoon}
      >
        <CalendarNav showMonthPicker compactYears />
        <CalendarDays />
      </Calendar>
    );
  }

  if (kind === "Custom theme") {
    return (
      <Calendar
        mode="single"
        value={singleDate}
        onChange={setSingleDate}
        defaultViewDate={new Date(2026, 4, 1)}
        theme={brandTheme}
        appearance={soft}
      >
        <CalendarNav showMonthPicker compactYears />
        <CalendarDays />
      </Calendar>
    );
  }

  if (kind === "Bubble appearance") {
    return (
      <Calendar
        mode="single"
        value={singleDate}
        onChange={setSingleDate}
        defaultViewDate={new Date(2026, 4, 1)}
        appearance={bubble}
      >
        <CalendarNav showMonthPicker compactYears />
        <CalendarDays />
      </Calendar>
    );
  }

  if (kind === "Mobile tracks") {
    return (
      <Calendar
        mode="range"
        value={trackRange}
        onChange={setTrackRange}
        defaultViewDate={new Date(2026, 4, 1)}
        appearance={soft}
      >
        <CalendarYearsTrack />
        <CalendarMonthsTrack />
        <CalendarDaysTrack bound="from" />
        <CalendarDaysTrack bound="to" />
        <CalendarSelectedDates />
      </Calendar>
    );
  }

  return (
    <Calendar
      mode="single"
      value={singleDate}
      onChange={setSingleDate}
      defaultViewDate={new Date(2026, 4, 1)}
      appearance={soft}
    >
      <CalendarNav showMonthPicker compactYears />
      <CalendarDays />
    </Calendar>
  );
}

function ModuleCalendar({ moduleName }: { moduleName: ModuleName }) {
  const [date, setDate] = useState<Date | null>(() => new Date(2026, 4, 13));
  const [dateTime, setDateTime] = useState<Date | null>(
    () => new Date(2026, 4, 13, 10, 30),
  );
  const [range, setRange] = useState<DateRange>({
    from: new Date(2026, 4, 8),
    to: new Date(2026, 4, 20),
  });
  const defaultViewDate = new Date(2026, 4, 1);

  if (moduleName === "Calendar") {
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        appearance={soft}
        minDate={new Date()}
      >
        <CalendarNav showMonthPicker compactYears />
        <CalendarDays />
        <CalendarSelectedDates allowClear allowNavigate />
      </Calendar>
    );
  }

  if (moduleName === "CalendarNav") {
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarNav showMonthPicker compactYears clear home />
      </Calendar>
    );
  }

  if (moduleName === "CalendarDays") {
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarDays highlightWeekends weekNumbers todayDot />
      </Calendar>
    );
  }

  if (moduleName === "CalendarTimeGrid") {
    return (
      <Calendar
        mode="single"
        value={dateTime}
        onChange={setDateTime}
        defaultViewDate={defaultViewDate}
        timeStep={{ minute: 5 }}
        appearance={soft}
      >
        <CalendarTimeGrid seconds labels="long" />
      </Calendar>
    );
  }

  if (moduleName === "CalendarPresets") {
    return (
      <Calendar
        mode="range"
        value={range}
        onChange={setRange}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarPresets presets={analyticsPresets} />
      </Calendar>
    );
  }

  if (moduleName === "CalendarSelectedDates") {
    return (
      <Calendar
        mode="range"
        value={range}
        onChange={setRange}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarSelectedDates allowClear allowNavigate />
      </Calendar>
    );
  }

  if (moduleName === "CalendarManualInput") {
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarManualInput allowClear />
      </Calendar>
    );
  }

  if (moduleName === "CalendarInfo") {
    return (
      <Calendar
        mode="range"
        value={range}
        onChange={setRange}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarDays />
        <CalendarInfo showRelative showSummary rangeStyle="duration" />
      </Calendar>
    );
  }

  if (moduleName === "CalendarDaysTrack") {
    return (
      <Calendar
        mode="range"
        value={range}
        onChange={setRange}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarDaysTrack bound="from" showMonthLabel />
        <CalendarDaysTrack bound="to" showMonthLabel />
      </Calendar>
    );
  }

  if (moduleName === "CalendarMonthsTrack") {
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarMonthsTrack short showYearLabel />
      </Calendar>
    );
  }

  if (moduleName === "CalendarYearsTrack") {
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarYearsTrack />
      </Calendar>
    );
  }

  if (moduleName === "CalendarMonthsGrid") {
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        defaultViewDate={defaultViewDate}
        appearance={soft}
      >
        <CalendarMonthsGrid short />
      </Calendar>
    );
  }

  return (
    <Calendar
      mode="single"
      value={date}
      onChange={setDate}
      defaultViewDate={defaultViewDate}
      appearance={soft}
    >
      <CalendarYearsGrid showControls yearsPerPage={12} />
    </Calendar>
  );
}
