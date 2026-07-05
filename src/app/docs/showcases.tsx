"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  calendarDate,
  createCalendarConfig,
  createDisabled,
  createTheme,
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
import { CalendarTimeWheel } from "@dateforge/react-calendar/modules/time";
import {
  CalendarToolbar,
  CalendarToolbarClear,
  CalendarToolbarHome,
  CalendarToolbarMonthLabel,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarPrev,
  CalendarToolbarThemeToggle,
  CalendarToolbarTime,
  CalendarToolbarYearLabel,
  CalendarToolbarYearTrigger,
} from "@dateforge/react-calendar/modules/toolbar";
import { CalendarLunar } from "@dateforge/react-calendar/modules/lunar";
import { CalendarMonthsWheel } from "@dateforge/react-calendar/modules/months-wheel";
import { CalendarYearsWheel } from "@dateforge/react-calendar/modules/years-wheel";
import {
  DatePicker,
  MonthPicker,
  MultiMonthCalendar as PrebuiltMultiMonth,
  SimpleCalendar,
} from "@dateforge/react-calendar/prebuilt";
import { bubble, compact, soft } from "@dateforge/react-calendar/appearances";
import { monsoon, nebula, snow } from "@dateforge/react-calendar/themes";
import { CalendarPreview } from "../CalendarPreview";
import { CodeBlock } from "./CodeBlock";
import { codeSamples, type CodeSampleKey } from "./code-samples";

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
  | "Holiday presets example"
  | "Per-module themes"
  | "Theme toggle";

export const PREBUILT_NAMES = [
  "SimpleCalendar",
  "DatePicker",
  "MonthPicker",
  "MultiMonthCalendar",
] as const;

export type PrebuiltName = (typeof PREBUILT_NAMES)[number];

export const MODULE_NAMES = [
  "Calendar",
  "CalendarToolbar",
  "CalendarDays",
  "CalendarTimeWheel",
  "CalendarPresets",
  "CalendarSelectedDates",
  "CalendarManualInput",
  "CalendarInfo",
  "CalendarDaysTrack",
  "CalendarMonthsTrack",
  "CalendarYearsTrack",
  "CalendarMonthsGrid",
  "CalendarYearsGrid",
  "CalendarMonthsWheel",
  "CalendarYearsWheel",
  "CalendarLunar",
] as const;

export type ModuleName = (typeof MODULE_NAMES)[number];

type RangeValue = { start: Date; end: Date } | null;

const singleConfig = createCalendarConfig();
const rangeConfig = createCalendarConfig({ mode: "range" });
const timeConfig = createCalendarConfig({
  withTime: true,
  defaultTime: { hour: 10, minute: 30 },
});
const minTodayConfig = createCalendarConfig({ min: new Date() });
const disabledConfig = createCalendarConfig({
  disabled: createDisabled({
    weekends: true,
    before: new Date(2026, 4, 5),
    dates: [new Date(2026, 4, 14), new Date(2026, 4, 21)],
  }),
});

const brandTheme = createTheme({
  accent: "#1ad980",
  range:     "#a7f3d0",
  weekend:   "#dc2626",
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

const analyticsPresets: PresetInput[] = [
  { label: "Last 7 days", value: -6, range: 6 },
  { label: "Last 30 days", value: -29, range: 29 },
  { label: "Next sprint", value: 0, range: 13 },
];

const holidayPresets: PresetInput[] = [
  { label: "New Year's Day", value: new Date(2027, 0, 1) },
  { label: "Christmas", value: new Date(2026, 11, 25) },
  {
    id: "holiday-season",
    label: "Holiday season",
    getValue: () => ({
      from: new Date(2026, 11, 24),
      to: new Date(2027, 0, 2),
    }),
  },
  {
    id: "next-weekend",
    label: "Next weekend",
    getValue: () => {
      const today = new Date();
      const daysToSat = (6 - today.getDay() + 7) % 7 || 7;
      const sat = new Date(today);
      sat.setDate(today.getDate() + daysToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
      return { from: sat, to: sun };
    },
  },
];

function ShowcaseFrame({
  children,
  previewSlug,
  innerClass = "w-full max-w-[340px]",
}: {
  children: React.ReactNode;
  previewSlug: string;
  innerClass?: string;
}) {
  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="outline"
            size="xs"
            className="absolute right-3 top-3 z-10 border-[var(--border)] bg-[var(--doc-bg-secondary)] font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] shadow-sm hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)]"
          >
            <Link
              href={`/docs/preview/${previewSlug}`}
              target="_blank"
              rel="noreferrer"
            >
              Open
              <ExternalLink size={11} />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Open in standalone page</TooltipContent>
      </Tooltip>
      <Card className="border-[var(--border)] bg-[var(--doc-bg-secondary)] py-0 ring-0 shadow-sm">
        <CardContent className="flex justify-center px-4 py-7">
          <div className={innerClass}>{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SimplePresetShowcase({
  sampleKey = "quick-start",
}: {
  sampleKey?: CodeSampleKey;
}) {
  return (
    <section className="mb-10 space-y-4">
      <ShowcaseFrame
        previewSlug="quick-start"
        innerClass="w-full max-w-[300px]"
      >
        <CalendarPreview
          width="100%"
          reserveHeight={0}
          navLinks={[]}
          initialDate={new Date(2026, 4, 13)}
          initialView={new Date(2026, 4, 1)}
          useSavedAppearanceFallback={false}
          useSavedThemeFallback={false}
        />
      </ShowcaseFrame>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={codeSamples[sampleKey]} lang="tsx" />
      </div>
    </section>
  );
}

export function MultiMonthPerformanceShowcase({
  sampleKey = "multi-month",
}: {
  sampleKey?: CodeSampleKey;
}) {
  return (
    <section className="mb-8 space-y-4">
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="outline"
              size="xs"
              className="absolute right-3 top-3 z-10 border-[var(--border)] bg-[var(--doc-bg-secondary)] font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] shadow-sm hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)]"
            >
              <Link
                href="/docs/preview/multi-month"
                target="_blank"
                rel="noreferrer"
              >
                Open
                <ExternalLink size={11} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open in standalone page</TooltipContent>
        </Tooltip>
        <Card className="border-[var(--border)] bg-[var(--doc-bg-secondary)] py-0 ring-0 shadow-sm">
          <CardContent className="overflow-x-auto px-4 py-7">
            <div className="min-w-[760px]">
              <MultiMonthCalendar />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={codeSamples[sampleKey]} lang="tsx" />
      </div>
    </section>
  );
}

export function RecipeShowcase({
  kind,
  sampleKey,
}: {
  kind: RecipeKind;
  sampleKey: CodeSampleKey;
}) {
  return (
    <section className="mb-8 space-y-4">
      <ShowcaseFrame previewSlug={`recipe/${recipeSlug(kind)}`}>
        <RecipeCalendar kind={kind} />
      </ShowcaseFrame>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={codeSamples[sampleKey]} lang="tsx" />
      </div>
    </section>
  );
}

export function ModuleShowcase({
  moduleName,
  sampleKey,
}: {
  moduleName: ModuleName;
  sampleKey: CodeSampleKey;
}) {
  return (
    <section className="mb-8 space-y-4">
      <ShowcaseFrame previewSlug={`module/${moduleName}`}>
        <ModuleCalendar moduleName={moduleName} />
      </ShowcaseFrame>
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={codeSamples[sampleKey]} lang="tsx" />
      </div>
    </section>
  );
}

export function PrebuiltCalendar({ name }: { name: PrebuiltName }) {
  if (name === "SimpleCalendar") {
    return <SimpleCalendar defaultValue={new Date(2026, 4, 13)} />;
  }
  if (name === "DatePicker") {
    return <DatePicker defaultValue={new Date(2026, 4, 13)} />;
  }
  if (name === "MonthPicker") {
    return <MonthPicker defaultValue={new Date(2026, 4, 1)} />;
  }
  return (
    <PrebuiltMultiMonth
      months={6}
      cols={3}
      mode="range"
      startMonth={new Date(2026, 4, 1)}
      defaultValue={{ start: new Date(2026, 5, 8), end: new Date(2026, 7, 16) }}
    />
  );
}

export function PrebuiltShowcase({
  name,
  sampleKey,
}: {
  name: PrebuiltName;
  sampleKey: CodeSampleKey;
}) {
  const wide = name === "MultiMonthCalendar";
  return (
    <section className="mb-8 space-y-4">
      {wide ? (
        <div className="relative">
          <Card className="border-[var(--border)] bg-[var(--doc-bg-secondary)] py-0 ring-0 shadow-sm">
            <CardContent className="overflow-x-auto px-4 py-7">
              <div className="min-w-[760px]">
                <PrebuiltCalendar name={name} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <ShowcaseFrame previewSlug={`prebuilt/${name}`}>
          <PrebuiltCalendar name={name} />
        </ShowcaseFrame>
      )}
      <div className="min-w-0 [&>div]:mb-0">
        <CodeBlock code={codeSamples[sampleKey]} lang="tsx" />
      </div>
    </section>
  );
}

export function recipeSlug(kind: RecipeKind) {
  return kind
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MultiMonthCalendar() {
  const [range, setRange] = useState<RangeValue>({
    start: new Date(2026, 6, 8),
    end: new Date(2026, 10, 16),
  });

  const children = useMemo(
    () =>
      [0, 3, 6, 9].flatMap((start) => [
        ...Array.from({ length: 3 }, (_, i) => {
          const offset = start + i;
          return offset === 0 ? (
            <CalendarToolbar key={`nav-${offset}`} col={1} offset={offset}>
              <CalendarToolbarPrev />
              <CalendarToolbarMonthTrigger />
              <CalendarToolbarNext />
              <CalendarToolbarYearTrigger compact />
            </CalendarToolbar>
          ) : (
            <CalendarToolbar key={`nav-${offset}`} col={1} offset={offset}>
              <CalendarToolbarMonthLabel />
              <CalendarToolbarYearLabel />
            </CalendarToolbar>
          );
        }),
        ...Array.from({ length: 3 }, (_, i) => {
          const offset = start + i;
          return (
            <CalendarDays
              key={`days-${offset}`}
              col={1}
              offset={offset}
              showOutsideDays={false}
              fixedWeeks={false}
            />
          );
        }),
      ]),
    [],
  );

  return (
    <Calendar
      config={rangeConfig}
      value={range}
      onChange={(value) => setRange(value as RangeValue)}
      initialView={calendarDate(2026, 1, 1)}
      cols={3}
      style={{ width: "100%" }}
      appearance={compact}
    >
      {children}
      <CalendarSelectedDates col={3} />
    </Calendar>
  );
}

export function RecipeCalendar({ kind }: { kind: RecipeKind }) {
  const [singleDate, setSingleDate] = useState<Date | null>(
    () => new Date(2026, 4, 13),
  );
  const [dateTime, setDateTime] = useState<Date | null>(
    () => new Date(2026, 4, 13, 10, 30),
  );
  const [bookingRange, setBookingRange] = useState<RangeValue>({
    start: new Date(2026, 4, 12),
    end: new Date(2026, 4, 17),
  });
  const [analyticsRange, setAnalyticsRange] = useState<RangeValue>({
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 13),
  });
  const [trackRange, setTrackRange] = useState<RangeValue>({
    start: new Date(2026, 4, 8),
    end: new Date(2026, 4, 20),
  });

  if (kind === "Booking range") {
    return (
      <Calendar
        config={rangeConfig}
        value={bookingRange}
        onChange={(value) => setBookingRange(value as RangeValue)}
        initialView={calendarDate(2026, 5, 1)}
        appearance={soft}
      >
        <CalendarToolbar>
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
          <CalendarToolbarClear />
        </CalendarToolbar>
        <CalendarDays />
        <CalendarSelectedDates allowClear allowNavigate />
      </Calendar>
    );
  }

  if (kind === "Analytics range with presets") {
    return (
      <Calendar
        config={rangeConfig}
        value={analyticsRange}
        onChange={(value) => setAnalyticsRange(value as RangeValue)}
        initialView={calendarDate(2026, 5, 1)}
        appearance={soft}
      >
        <CalendarPresets presets={analyticsPresets} />
        <CalendarToolbar>
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
        </CalendarToolbar>
        <CalendarDays />
        <CalendarSelectedDates />
      </Calendar>
    );
  }

  if (kind === "Date and time") {
    return (
      <Calendar
        config={timeConfig}
        value={dateTime}
        onChange={(value) => setDateTime(value as Date | null)}
        initialView={calendarDate(2026, 5, 1)}
        appearance={soft}
      >
        <CalendarToolbar>
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
          <CalendarToolbarTime />
        </CalendarToolbar>
        <CalendarDays />
        <CalendarTimeWheel />
      </Calendar>
    );
  }

  if (kind === "Disabled dates example") {
    return (
      <Calendar
        config={disabledConfig}
        value={singleDate}
        onChange={(value) => setSingleDate(value as Date | null)}
        initialView={calendarDate(2026, 5, 1)}
        appearance={soft}
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
  }

  if (kind === "Holiday presets example") {
    return (
      <Calendar
        config={singleConfig}
        value={singleDate}
        onChange={(value) => setSingleDate(value as Date | null)}
        initialView={calendarDate(2026, 12, 1)}
        appearance={soft}
      >
        <CalendarPresets presets={holidayPresets} />
        <CalendarToolbar>
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
        </CalendarToolbar>
        <CalendarDays />
      </Calendar>
    );
  }

  if (kind === "Monsoon theme") {
    return (
      <Calendar
        config={singleConfig}
        value={singleDate}
        onChange={(value) => setSingleDate(value as Date | null)}
        initialView={calendarDate(2026, 5, 1)}
        theme={monsoon}
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
  }

  if (kind === "Custom theme") {
    return (
      <Calendar
        config={singleConfig}
        value={singleDate}
        onChange={(value) => setSingleDate(value as Date | null)}
        initialView={calendarDate(2026, 5, 1)}
        theme={brandTheme}
        appearance={soft}
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
  }

  if (kind === "Bubble appearance") {
    return (
      <Calendar
        config={singleConfig}
        value={singleDate}
        onChange={(value) => setSingleDate(value as Date | null)}
        initialView={calendarDate(2026, 5, 1)}
        appearance={bubble}
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
  }

  if (kind === "Mobile tracks") {
    return (
      <Calendar
        config={rangeConfig}
        value={trackRange}
        onChange={(value) => setTrackRange(value as RangeValue)}
        initialView={calendarDate(2026, 5, 1)}
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

  if (kind === "Theme toggle") {
    return (
      <Calendar
        config={singleConfig}
        value={singleDate}
        onChange={(value) => setSingleDate(value as Date | null)}
        initialView={calendarDate(2026, 5, 1)}
        theme={nebula}
        appearance={soft}
      >
        <CalendarToolbar>
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
          <CalendarToolbarThemeToggle />
        </CalendarToolbar>
        <CalendarDays />
      </Calendar>
    );
  }

  if (kind === "Per-module themes") {
    return (
      <Calendar
        config={singleConfig}
        value={singleDate}
        onChange={(value) => setSingleDate(value as Date | null)}
        initialView={calendarDate(2026, 5, 1)}
        theme={snow}
        scheme="light"
        appearance={soft}
      >
        {/* toolbar overrides to noir dark — dark bar on light calendar */}
        <CalendarToolbar theme="noir" scheme="dark">
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
        </CalendarToolbar>
        {/* days inherit snow light from Calendar */}
        <CalendarDays />
        <CalendarInfo theme="nebula" showSummary showRelative />
      </Calendar>
    );
  }

  return (
    <Calendar
      config={singleConfig}
      value={singleDate}
      onChange={(value) => setSingleDate(value as Date | null)}
      initialView={calendarDate(2026, 5, 1)}
      appearance={soft}
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
}

export function ModuleCalendar({ moduleName }: { moduleName: ModuleName }) {
  const [date, setDate] = useState<Date | null>(() => new Date(2026, 4, 13));
  const [dateTime, setDateTime] = useState<Date | null>(
    () => new Date(2026, 4, 13, 10, 30),
  );
  const [range, setRange] = useState<RangeValue>({
    start: new Date(2026, 4, 8),
    end: new Date(2026, 4, 20),
  });
  const viewDate = calendarDate(2026, 5, 1);

  if (moduleName === "Calendar") {
    return (
      <Calendar
        config={minTodayConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarToolbar>
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
        </CalendarToolbar>
        <CalendarDays />
        <CalendarSelectedDates allowClear allowNavigate />
      </Calendar>
    );
  }

  if (moduleName === "CalendarToolbar") {
    return (
      <Calendar
        config={singleConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarToolbar>
          <CalendarToolbarPrev />
          <CalendarToolbarMonthTrigger />
          <CalendarToolbarNext />
          <CalendarToolbarYearTrigger compact />
          <CalendarToolbarHome />
          <CalendarToolbarClear />
        </CalendarToolbar>
      </Calendar>
    );
  }

  if (moduleName === "CalendarDays") {
    return (
      <Calendar
        config={singleConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarDays highlightWeekends weekNumbers todayDot />
      </Calendar>
    );
  }

  if (moduleName === "CalendarTimeWheel") {
    return (
      <Calendar
        config={timeConfig}
        value={dateTime}
        onChange={(value) => setDateTime(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarTimeWheel seconds labels="long" />
      </Calendar>
    );
  }

  if (moduleName === "CalendarMonthsWheel") {
    return (
      <Calendar
        config={rangeConfig}
        value={range}
        onChange={(value) => setRange(value as RangeValue)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarMonthsWheel showLabel showReset />
      </Calendar>
    );
  }

  if (moduleName === "CalendarYearsWheel") {
    return (
      <Calendar
        config={rangeConfig}
        value={range}
        onChange={(value) => setRange(value as RangeValue)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarYearsWheel showReset />
      </Calendar>
    );
  }

  if (moduleName === "CalendarLunar") {
    return (
      <Calendar
        config={singleConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
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
    );
  }

  if (moduleName === "CalendarPresets") {
    return (
      <Calendar
        config={rangeConfig}
        value={range}
        onChange={(value) => setRange(value as RangeValue)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarPresets presets={analyticsPresets} />
      </Calendar>
    );
  }

  if (moduleName === "CalendarSelectedDates") {
    return (
      <Calendar
        config={rangeConfig}
        value={range}
        onChange={(value) => setRange(value as RangeValue)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarSelectedDates allowClear allowNavigate />
      </Calendar>
    );
  }

  if (moduleName === "CalendarManualInput") {
    return (
      <Calendar
        config={singleConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarManualInput allowClear />
      </Calendar>
    );
  }

  if (moduleName === "CalendarInfo") {
    return (
      <Calendar
        config={rangeConfig}
        value={range}
        onChange={(value) => setRange(value as RangeValue)}
        initialView={viewDate}
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
        config={rangeConfig}
        value={range}
        onChange={(value) => setRange(value as RangeValue)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarDaysTrack bound="from" />
        <CalendarDaysTrack bound="to" />
      </Calendar>
    );
  }

  if (moduleName === "CalendarMonthsTrack") {
    return (
      <Calendar
        config={singleConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarMonthsTrack short showYearLabel />
      </Calendar>
    );
  }

  if (moduleName === "CalendarYearsTrack") {
    return (
      <Calendar
        config={singleConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarYearsTrack />
      </Calendar>
    );
  }

  if (moduleName === "CalendarMonthsGrid") {
    return (
      <Calendar
        config={singleConfig}
        value={date}
        onChange={(value) => setDate(value as Date | null)}
        initialView={viewDate}
        appearance={soft}
      >
        <CalendarMonthsGrid short />
      </Calendar>
    );
  }

  return (
    <Calendar
      config={singleConfig}
      value={date}
      onChange={(value) => setDate(value as Date | null)}
      initialView={viewDate}
      appearance={soft}
    >
      <CalendarYearsGrid showControls yearsPerPage={12} />
    </Calendar>
  );
}

const WEATHER_ICONS = ["☀️", "⛅", "☁️", "🌧", "⛈", "❄️"];

// Stable per-day value so a given date always renders the same icon.
// renderDay receives the library's CalendarDate ({ year, month, day }, month 1-12).
const weatherSeed = (d: { year: number; month: number; day: number }) => {
  const seed = d.year * 10000 + d.month * 100 + d.day;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
const weatherFor = (d: { year: number; month: number; day: number }) =>
  WEATHER_ICONS[Math.floor(weatherSeed(d) * WEATHER_ICONS.length)];

export function WeatherRenderDayShowcase() {
  const [date, setDate] = useState<Date | null>(() => new Date(2026, 4, 13));
  return (
    <section className="mb-8">
      <Card className="border-[var(--border)] bg-[var(--doc-bg-secondary)] py-0 ring-0 shadow-sm">
        <CardContent className="flex justify-center px-4 py-7">
          <div className="w-full max-w-[340px]">
            <Calendar
              config={singleConfig}
              value={date}
              onChange={(value) => setDate(value as Date | null)}
              initialView={calendarDate(2026, 5, 1)}
              appearance={soft}
              style={{ width: "100%" }}
            >
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
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        lineHeight: 1.1,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{d.day}</span>
                      <span aria-hidden style={{ fontSize: 13 }}>
                        {weatherFor(d)}
                      </span>
                    </span>
                  );
                }}
              />
            </Calendar>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function QuickStartCalendar() {
  return (
    <CalendarPreview
      width="100%"
      reserveHeight={0}
      navLinks={[]}
      initialDate={new Date(2026, 4, 13)}
      initialView={new Date(2026, 4, 1)}
      useSavedAppearanceFallback={false}
      useSavedThemeFallback={false}
    />
  );
}
