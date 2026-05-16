"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
import { bubble, soft } from "@dateforge/react-calendar/appearances";
import { monsoon } from "@dateforge/react-calendar/themes";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";
import { CalendarPreview } from "../CalendarPreview";

const GITHUB_URL = "https://github.com/kirilinsky/dateforge-react-calendar";
const INSTALL_COMMAND = "npm i @dateforge/react-calendar";

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

type Block =
  | { type: "heading"; level: number; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "hr" };

type Heading = Extract<Block, { type: "heading" }>;
type RecipeKind =
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

const themeVars = {
  dark: {
    "--doc-bg": "#101012",
    "--doc-bg-secondary": "#17181b",
    "--header-bg": "#101012",
    "--text-primary": "rgba(255,255,255,0.9)",
    "--text-secondary": "rgba(255,255,255,0.64)",
    "--text-muted": "rgba(255,255,255,0.42)",
    "--border": "rgba(255,255,255,0.1)",
    "--nav-active": "rgba(52,211,153,0.12)",
    "--nav-active-border": "rgba(52,211,153,0.26)",
    "--code-bg": "#09090b",
    "--code-border": "rgba(255,255,255,0.09)",
    "--code-text": "#d4d4d8",
    "--amber": "#fbbf24",
    "--sky": "#38bdf8",
    "--emerald": "#34d399",
    "--violet": "#c4b5fd",
  },
  light: {
    "--doc-bg": "#fbfbfd",
    "--doc-bg-secondary": "#ffffff",
    "--header-bg": "#fbfbfd",
    "--text-primary": "#18181b",
    "--text-secondary": "#52525b",
    "--text-muted": "#71717a",
    "--border": "rgba(24,24,27,0.1)",
    "--nav-active": "#ecfdf5",
    "--nav-active-border": "#a7f3d0",
    "--code-bg": "#101012",
    "--code-border": "rgba(24,24,27,0.12)",
    "--code-text": "#f4f4f5",
    "--amber": "#b45309",
    "--sky": "#0284c7",
    "--emerald": "#059669",
    "--violet": "#7c3aed",
  },
} as const;

const docsMarkdown = `## Quick start

\`\`\`tsx
import { useState } from "react";
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
}
\`\`\`

No global CSS import is required. Every module ships its own styles and applies them on first render. In RSC frameworks, render the calendar behind a \`"use client"\` boundary.

## Core idea

DateForge is a stateful composition wrapper with self-contained modules. The \`<Calendar>\` shell owns mode, value, view date, locale, timezone, theme, appearance, disabled rules, range constraints, and \`onChange\` wiring. It renders no picker UI by itself.

Visible behavior comes from modules placed as children: \`CalendarNav\`, \`CalendarDays\`, \`CalendarTimeGrid\`, \`CalendarPresets\`, \`CalendarSelectedDates\`, manual input, and track modules. You mount only the UI your product needs.

The wrapper also provides a small grid contract: \`cols\` defines equal parent tracks, child \`col={number}\` spans tracks, and \`col="2 / 4"\` can be used for explicit advanced placement.

![Calendar core architecture](/calendar-core.png)

## Modules

Modules read calendar context directly, so there is no prop drilling. They can be reordered, repeated, or used alone. Any subset should render without crashing, but not every subset is a complete human-friendly UX.

| Module group | Modules | Primary role |
| ------------ | ------- | ------------ |
| Navigation | \`CalendarNav\`, \`CalendarMonthsGrid\`, \`CalendarYearsGrid\` | Move the internal \`viewDate\` without committing selection |
| Selection | \`CalendarDays\`, \`CalendarTimeGrid\`, \`CalendarManualInput\`, \`CalendarPresets\` | Commit dates, ranges, arrays, or time changes |
| Feedback | \`CalendarSelectedDates\`, \`CalendarInfo\` | Render current selection as chips, summary, or info readout |
| Tracks | \`CalendarDaysTrack\`, \`CalendarMonthsTrack\`, \`CalendarYearsTrack\` | Mobile/drum-style navigation or bound range editing |
| Custom | Context hooks from \`@dateforge/react-calendar/context\` | Build your own modules on top of the same state |

## Modes

\`mode\` decides the value shape, selection semantics, and how modules interpret user input.

| Mode | Value / defaultValue | onChange payload | Cleared value | Best for |
| ---- | -------------------- | ---------------- | ------------- | -------- |
| \`"single"\` | \`Date \\| null\` | \`Date \\| null\` | \`null\` | Date picker, scheduler date, time-only single picker |
| \`"multiple"\` | \`Date[]\` | sorted \`Date[]\` | \`[]\` | Delivery days, selected shifts, events |
| \`"range"\` | \`{ from: Date \\| null; to: Date \\| null }\` | same shape, partial range allowed | \`{ from: null, to: null }\` | Booking, reporting windows, sprint planning |

For range mode, \`onChange\` fires when each bound changes. Guard with \`if (range.from && range.to)\` when downstream work only needs complete ranges.

## Which modules do I need?

Start from the product workflow, then pick modules. The calendar does not force one canonical picker.

| You want... | Compose these modules |
| ----------- | --------------------- |
| Basic date picker | \`CalendarNav\` + \`CalendarDays\` |
| Range picker | \`CalendarNav\` + \`CalendarDays\` with \`mode="range"\` |
| Date and time picker | \`CalendarNav showTime\` + \`CalendarDays\`, or inline \`CalendarTimeGrid\` |
| Time-only picker | \`CalendarTimeGrid\` in \`mode="single"\` |
| Manual typing | \`CalendarManualInput\`, optionally with \`CalendarDays\` |
| Preset shortcuts | \`CalendarPresets\` alongside any picker modules |
| Month-only or year-only picker | \`CalendarMonthsGrid\` or \`CalendarYearsGrid\` without \`CalendarDays\` |
| Mobile drum picker | \`CalendarDaysTrack\`, \`CalendarMonthsTrack\`, \`CalendarYearsTrack\` |
| Selection summary | \`CalendarSelectedDates\` |
| Date facts, range duration, relative time | \`CalendarInfo\` |

## Import strategy

The package is split into tree-shakeable subpaths. The aggregate module paths are convenient, while per-theme and per-appearance paths are best for production bundles.

| Import from | What is there | When to use |
| ----------- | ------------- | ----------- |
| \`@dateforge/react-calendar\` | \`Calendar\`, factories, hooks, public types | Always; the root provider lives here |
| \`@dateforge/react-calendar/modules\` | All \`Calendar*\` modules | Pull visible UI pieces |
| \`@dateforge/react-calendar/context\` | Context hooks such as \`useConfig\`, \`useNavigation\`, \`useSelection\` | Build custom modules |
| \`@dateforge/react-calendar/themes\` | All theme objects together | Prototyping |
| \`@dateforge/react-calendar/themes/<name>\` | One theme object | Production bundle hygiene |
| \`@dateforge/react-calendar/appearances\` | All appearance objects together | Prototyping |
| \`@dateforge/react-calendar/appearances/<name>\` | One appearance object | Production bundle hygiene |

## When does each action fire onChange?

The rule of thumb is simple: navigation changes the view, selection commits values.

| Action | Changes viewDate | Changes selection | Fires onChange |
| ------ | ---------------- | ----------------- | -------------- |
| \`CalendarNav\` prev / next / home | yes | no | no |
| Month or year picker popup | yes | no | no |
| \`CalendarDays\` day click | if cross-month | yes | yes |
| \`CalendarDays\` keyboard navigation | if cross-month | no | no |
| \`CalendarTimeGrid\` time change | yes | yes | yes |
| \`CalendarPresets\` click | yes | yes | yes |
| \`CalendarSelectedDates\` chip click | yes | no | no |
| Clear buttons | no | yes | yes |
| Track scroll without range \`bound\` | yes | no | no |
| Track item with range \`bound\` | yes | yes | yes |

\`readOnly\` blocks every selection-affecting action, but navigation stays enabled. UI-only state like popup open/close and theme toggles does not fire \`onChange\`.

## Controlled and uncontrolled

Controlled mode starts when \`value\` is provided, including \`null\`. User actions fire \`onChange\` with the next value, but rendered selection stays tied to the value you pass back.

\`\`\`tsx
const [date, setDate] = useState<Date | null>(null);

<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>
\`\`\`

Uncontrolled mode starts when \`value\` is \`undefined\`. \`defaultValue\` seeds the reducer once on mount, internal state owns future changes, and \`onChange\` still fires.

\`\`\`tsx
<Calendar defaultValue={new Date()} onChange={(date) => console.log(date)}>
  <CalendarDays />
</Calendar>
\`\`\`

When both \`value\` and \`defaultValue\` are passed, \`value\` wins. If you change \`mode\` at runtime, pass a compatible \`value\` at the same time; selection shape is not migrated for you.

## Ready-made module sets

These are starting points rather than exported presets. Copy the shape, then add constraints, disabled rules, themes, or appearances.

### Minimal single date

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>
\`\`\`

### Booking range

\`\`\`tsx
<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarNav showMonthPicker compactYears clear />
  <CalendarDays />
  <CalendarSelectedDates allowClear allowNavigate />
</Calendar>
\`\`\`

### Analytics range with presets

\`\`\`tsx
<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarPresets />
  <CalendarNav compactMonths compactYears />
  <CalendarDays />
  <CalendarSelectedDates />
</Calendar>
\`\`\`

### Date and time

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate} timeStep={{ minute: 5 }}>
  <CalendarNav showTime showMonthPicker />
  <CalendarDays />
  <CalendarTimeGrid />
</Calendar>
\`\`\`

### Mobile tracks

\`\`\`tsx
<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarYearsTrack />
  <CalendarMonthsTrack />
  <CalendarDaysTrack bound="from" />
  <CalendarDaysTrack bound="to" />
  <CalendarSelectedDates />
</Calendar>
\`\`\`

## Module reference

### Calendar

The root wrapper and context provider. Owns all shared state — mode, value, view date, locale, timezone, theme, appearance, disabled rules, and range constraints — and distributes it to every child module via context. Renders no UI of its own; all visible output comes from the modules you place inside it.

\`\`\`tsx
<Calendar
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
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`mode\` | \`"single" \\| "multiple" \\| "range"\` | \`"single"\` | Value shape and selection semantics |
| \`value\` | \`CalendarValue<M>\` | — | Controlled value |
| \`defaultValue\` | \`CalendarValue<M>\` | — | Uncontrolled initial value |
| \`defaultViewDate\` | \`Date\` | today | Initial month shown on mount |
| \`onChange\` | \`(value: CalendarValue<M>) => void\` | — | Fires on every selection change |
| \`theme\` | \`"auto" \\| "light" \\| "dark" \\| ThemeObject\` | \`"auto"\` | Color palette |
| \`appearance\` | \`AppearanceObject\` | — | Shape, spacing, and motion preset |
| \`disabled\` | \`DisabledConfig\` | — | Disabled date rules via \`createDisabled()\` |
| \`readOnly\` | \`boolean\` | \`false\` | Block all selection; navigation stays active |
| \`locale\` | \`string\` | browser | BCP 47 locale for labels and formatting |
| \`timeZone\` | \`string\` | browser | IANA timezone for display and parsing |
| \`minDate\` | \`Date\` | — | Earliest selectable date |
| \`maxDate\` | \`Date\` | — | Latest selectable date |
| \`minRangeDays\` | \`number\` | — | Minimum span for range selections |
| \`maxRangeDays\` | \`number\` | — | Maximum span for range selections |
| \`maxDates\` | \`number\` | — | Cap on selected dates in \`multiple\` mode |
| \`timeStep\` | \`{ hour?, minute?, second? }\` | — | Snap interval for time selection |
| \`hour12\` | \`boolean\` | locale | Force 12 or 24-hour time display |
| \`cols\` | \`number\` | — | Equal-width column grid for child modules |
| \`width\` | \`string \\| number\` | — | Explicit width on the root element |
| \`gradient\` | \`boolean\` | \`false\` | Subtle gradient overlay on the surface |

### CalendarNav

Navigation bar that controls the internal \`viewDate\`. Does not commit selection — it moves the visible month or year. Optionally shows time controls, a clear button, and a home reset.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarNav showMonthPicker compactYears clear home />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`showMonthPicker\` | \`boolean\` | \`false\` | Month picker popup in nav |
| \`compactMonths\` | \`boolean\` | \`false\` | Compact month display |
| \`showYearPicker\` | \`boolean\` | \`false\` | Year picker popup in nav |
| \`compactYears\` | \`boolean\` | \`false\` | Compact year display |
| \`showTime\` | \`boolean\` | \`false\` | Time controls in nav |
| \`showNowTime\` | \`boolean\` | \`false\` | Jump-to-current-time button |
| \`seconds\` | \`boolean\` | \`false\` | Include seconds in time display |
| \`animateTime\` | \`boolean\` | \`false\` | Animate time transitions |
| \`clear\` | \`boolean\` | \`false\` | Clear selection button |
| \`home\` | \`boolean\` | \`false\` | Reset to today button |
| \`themeToggle\` | \`boolean\` | \`false\` | Theme toggle button |
| \`monthLabel\` | \`boolean\` | \`true\` | Show month label |
| \`yearLabel\` | \`boolean\` | \`true\` | Show year label |
| \`label\` | \`string\` | — | Custom label text |
| \`bound\` | \`"from" \\| "to"\` | — | Range bound for dual-nav layouts |
| \`offset\` | \`number\` | — | View offset in months |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarDays

The main day grid. Renders a month view and commits selection on click. Works across all three modes — single, multiple, and range — adapting highlight and click semantics automatically.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarDays highlightWeekends weekNumbers todayDot />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`highlightWeekends\` | \`boolean\` | \`false\` | Highlight weekend cells |
| \`boldWeekends\` | \`boolean\` | \`false\` | Bold weekend day labels |
| \`weekNumbers\` | \`boolean\` | \`false\` | Show ISO week numbers |
| \`todayDot\` | \`boolean\` | \`true\` | Dot marker on today |
| \`highlightToday\` | \`boolean\` | \`true\` | Highlight today cell |
| \`hideWeekdays\` | \`boolean\` | \`false\` | Hide weekday header row |
| \`weekdayFormat\` | \`"narrow" \\| "short" \\| "long"\` | \`"narrow"\` | Weekday label format |
| \`startOfWeek\` | \`0–6\` | \`1\` | First day of week (0 = Sun) |
| \`currentMonthOnly\` | \`boolean\` | \`false\` | Hide days from adjacent months |
| \`fixedRows\` | \`boolean\` | \`false\` | Always render 6 rows |
| \`swipe\` | \`boolean\` | \`false\` | Swipe gesture navigation |
| \`hideOutOfRange\` | \`boolean\` | \`false\` | Hide disabled out-of-range days |
| \`lockDeselection\` | \`boolean\` | \`false\` | Prevent deselecting already-selected date |
| \`blockNavigation\` | \`boolean\` | \`false\` | Prevent month navigation |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarTimeGrid

Drum-scroll time picker for hours, minutes, and optionally seconds. Pairs with \`CalendarDays\` for a full date-time picker, or stands alone as a time-only input inside \`mode="single"\`.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate} timeStep={{ minute: 5 }}>
  <CalendarTimeGrid seconds labels="long" />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`seconds\` | \`boolean\` | \`false\` | Show seconds drum |
| \`labels\` | \`"short" \\| "long"\` | — | Label format above drums; omit to hide |
| \`bound\` | \`"from" \\| "to"\` | — | Range-mode only: edit time on explicit boundary instead of relying on \`viewDate\` matching \`rangeStart\`/\`rangeEnd\` |
| \`showBoundDate\` | \`boolean\` | \`true\` | Render localized date header above the track for the bound's current date. Requires \`bound\`; hidden when bound has no date |
| \`showReset\` | \`boolean\` | \`false\` | Render a "now" reset button below the track. Click resets time fields on active date or bound to current hour/minute (and second if \`seconds\` enabled) |
| \`resetLabel\` | \`React.ReactNode\` | clock icon + localized "now" | Override reset button content |
| \`onTimeSelect\` | \`(date: Date) => void\` | — | Fires on every drum change with a Date built from \`viewDate\` and the new time |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarPresets

Shortcut buttons that jump to predefined dates or ranges with a single click. Accepts simple offset-based entries or advanced function-based entries for dynamic values.

\`\`\`tsx
<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarPresets presets={basicPresets} />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`presets\` | \`PresetEntry[]\` | built-in set | Array of preset definitions. Import \`basicPresets\` or define custom entries |
| \`col\` | \`number \\| string\` | — | Grid column span |

> [See custom presets — simple and advanced definitions →](#custom-presets)

### CalendarSelectedDates

Renders the current selection as chips. In range mode shows from/to bounds; in multiple mode shows one chip per date. Chips can navigate to their date or clear individual entries.

\`\`\`tsx
<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarSelectedDates allowClear allowNavigate showTime />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`allowClear\` | \`boolean\` | \`false\` | Show per-chip clear button |
| \`allowClearPerChip\` | \`boolean\` | \`false\` | Allow removing individual chips independently |
| \`allowNavigate\` | \`boolean\` | \`false\` | Clicking chip navigates to that date |
| \`showTime\` | \`boolean\` | \`false\` | Show time in chip labels |
| \`animated\` | \`boolean\` | \`true\` | Animate chip entrance |
| \`align\` | \`"left" \\| "center" \\| "right"\` | \`"left"\` | Chip alignment |
| \`maxVisibleChips\` | \`number\` | — | Collapse chips beyond this count |
| \`overflowLabel\` | \`string\` | — | Label shown on overflow indicator |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarManualInput

Free-text date input that parses typed values and syncs them with calendar state. Useful when users know the exact date and prefer typing over clicking.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarManualInput allowClear />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`allowClear\` | \`boolean\` | \`false\` | Show clear button in input |
| \`align\` | \`"left" \\| "center" \\| "right"\` | \`"left"\` | Input text alignment |
| \`label\` | \`React.ReactNode\` | — | Custom label rendered next to the input |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarInfo

Read-only summary of the current selection. In \`single\` mode prints the date; in \`multiple\` prints a count and list; in \`range\` prints the bounds plus a duration or day count. Use to surface "facts about the value" — relative time, range length, ISO summary — without rebuilding selection chips. Pass a \`formatter\` for fully custom output.

\`\`\`tsx
<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarDays />
  <CalendarInfo showRelative showSummary rangeStyle="duration" />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`allowClear\` | \`boolean\` | \`false\` | Show clear button next to the readout |
| \`align\` | \`"left" \\| "center" \\| "right"\` | \`"left"\` | Text alignment |
| \`animated\` | \`boolean\` | \`true\` | Animate value transitions |
| \`emptyLabel\` | \`React.ReactNode\` | — | Content shown when selection is empty |
| \`formatter\` | \`(value: CalendarInfoValue) => React.ReactNode\` | — | Fully custom renderer; overrides built-in formatting |
| \`prefix\` | \`React.ReactNode\` | — | Static prefix rendered before the value |
| \`rangeStyle\` | \`"days" \\| "duration"\` | \`"days"\` | Range mode only: show day count or full duration string |
| \`showHome\` | \`boolean\` | \`false\` | Render a "go to current month" button; disabled when viewDate already matches today's month |
| \`showRelative\` | \`boolean\` | \`false\` | Add localized relative-time hint (e.g. "in 3 days") via \`Intl.RelativeTimeFormat\` |
| \`showSummary\` | \`boolean\` | \`true\` | Print main summary line: day count for multi/range, count for multiple, formatted single date |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarDaysTrack

Horizontal drum scroller for day selection. Designed for mobile-first layouts. Use \`bound\` to tie each drum to the \`from\` or \`to\` side of a range independently.

\`\`\`tsx
<Calendar mode="range" value={range} onChange={setRange}>
  <CalendarDaysTrack bound="from" showMonthLabel />
  <CalendarDaysTrack bound="to" showMonthLabel />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`bound\` | \`"from" \\| "to"\` | — | Range bound this drum controls |
| \`showMonthLabel\` | \`boolean\` | \`false\` | Show month name above drum |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarMonthsTrack

Drum scroller for month navigation. Scrolling moves the internal \`viewDate\` without committing selection. Combine with \`CalendarDaysTrack\` for a full mobile drum picker.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarMonthsTrack short showYearLabel />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`short\` | \`boolean\` | \`false\` | Use abbreviated month names |
| \`showYearLabel\` | \`boolean\` | \`false\` | Show year above drum |
| \`bound\` | \`"from" \\| "to"\` | — | Range bound |
| \`onMonthSelect\` | \`(date: Date) => void\` | — | Fires when user lands on a month |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarYearsTrack

Drum scroller for year navigation. Works the same way as \`CalendarMonthsTrack\` but scrolls through years. Stack all three track modules for a compact iOS-style date picker.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarYearsTrack />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`bound\` | \`"from" \\| "to"\` | — | Range bound |
| \`onYearSelect\` | \`(date: Date) => void\` | — | Fires when user lands on a year |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarMonthsGrid

12-cell month grid for month-only pickers or fast month navigation. Clicking a cell moves \`viewDate\` to that month. Use \`onMonthSelect\` to build a standalone month picker without \`CalendarDays\`.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarMonthsGrid short />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`short\` | \`boolean\` | \`false\` | Abbreviated month names |
| \`disableOutOfRange\` | \`boolean\` | \`false\` | Disable months outside min/max |
| \`hideOutOfRange\` | \`boolean\` | \`false\` | Hide months outside min/max |
| \`onMonthSelect\` | \`(date: Date) => void\` | — | Fires on month cell click |
| \`col\` | \`number \\| string\` | — | Grid column span |

### CalendarYearsGrid

Paginated year grid for year-only pickers or quick year jumps. Pairs with \`CalendarMonthsGrid\` to build a full month-year selector without the day view.

\`\`\`tsx
<Calendar mode="single" value={date} onChange={setDate}>
  <CalendarYearsGrid showControls yearsPerPage={12} />
</Calendar>
\`\`\`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| \`yearsPerPage\` | \`number\` | \`12\` | Years displayed per page |
| \`startYear\` | \`number\` | — | First year in grid |
| \`showControls\` | \`boolean\` | \`true\` | Show prev/next page controls |
| \`disableOutOfRange\` | \`boolean\` | \`false\` | Disable years outside min/max |
| \`hideOutOfRange\` | \`boolean\` | \`false\` | Hide years outside min/max |
| \`onYearSelect\` | \`(date: Date) => void\` | — | Fires on year cell click |
| \`col\` | \`number \\| string\` | — | Grid column span |

## Disabled dates

Pass a \`DisabledConfig\` object to the \`disabled\` prop on \`<Calendar>\`. Build it with \`createDisabled()\` — a typed factory that accepts one or more rule keys. Rules are combined with OR logic: a date is disabled if any rule matches it.

#### Disabled dates example

\`\`\`tsx
import { Calendar, createDisabled } from "@dateforge/react-calendar";

const rules = createDisabled({
  weekends: true,
  before: new Date(),
  dates: [new Date(2026, 5, 10), new Date(2026, 5, 11)],
});

<Calendar mode="single" value={date} onChange={setDate} disabled={rules}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>
\`\`\`

| Option | Type | Description |
| ------ | ---- | ----------- |
| \`weekends\` | \`boolean\` | Disable Saturday and Sunday |
| \`weekdays\` | \`number[]\` | Disable specific weekdays (0 = Sun, 6 = Sat) |
| \`before\` | \`Date\` | Disable all dates before this date |
| \`after\` | \`Date\` | Disable all dates after this date |
| \`dates\` | \`Date[]\` | Disable individual dates |
| \`ranges\` | \`Array<{ from: Date; to: Date }>\` | Disable date ranges |
| \`all\` | \`boolean\` | Disable every date (use with \`readOnly\` for view-only calendars) |

You can also pass raw \`DisabledRule\` objects directly when you need more control:

\`\`\`tsx
import { Calendar, type DisabledRule } from "@dateforge/react-calendar";

const rules: DisabledRule[] = [
  { dayOfWeek: [0, 6] },
  { before: startOfToday },
  { from: new Date(2026, 5, 20), to: new Date(2026, 5, 25) },
];
\`\`\`

## Custom presets

\`CalendarPresets\` accepts a \`presets\` array of \`PresetEntry\` objects. Two forms exist: a simple offset-based definition and an advanced function-based definition for dynamic or computed ranges.

**Simple preset** — \`value\` is a day offset from today (negative = past) or a fixed \`Date\`. Optional \`range\` extends it into a range of that many days.

**Advanced preset** — \`getValue\` receives a context object and returns a \`Date\`, a \`{ from, to }\` range, or \`null\` to disable the preset dynamically.

#### Holiday presets example

\`\`\`tsx
import { type PresetEntry } from "@dateforge/react-calendar";

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
</Calendar>
\`\`\`

| Field | Simple | Advanced | Description |
| ----- | ------ | -------- | ----------- |
| \`label\` | required | required | Display text in the preset button |
| \`id\` | optional | required | Stable key for active-state tracking |
| \`value\` | required | — | Day offset (\`number\`) or fixed \`Date\` |
| \`range\` | optional | — | Extend into a range of N days after \`value\` |
| \`getValue\` | — | required | Function returning \`Date\`, \`{ from, to }\`, or \`null\` |

## Design system

Styling is split into two independent axes: **theme** and **appearance**. A theme controls color. An appearance controls structure: radius, spacing, density, border feel, shadows, and motion duration. Any theme can combine with any appearance, so product teams can keep one interaction model and change the surface to match different screens.

The calendar wrapper exposes styling through data attributes.

| Attribute | Values | What it controls |
| --------- | ------ | ---------------- |
| \`data-theme\` | \`auto\`, \`light\`, \`dark\`, or generated custom theme id | Palette tokens |
| \`data-appearance\` | built-in or custom appearance name | Shape, density, motion, shadows |
| \`data-readonly\` | present when \`readOnly\` is true | Disabled interaction styling |

## Default theme modes

You can use DateForge without importing a named theme. The default theme prop accepts three string modes.

| Value | Behavior | Use when |
| ----- | -------- | -------- |
| \`"auto"\` | Follows the user's \`prefers-color-scheme\` with CSS, avoiding JS theme flashes | Public apps and docs |
| \`"light"\` | Forces the built-in light palette | Light-only product surfaces |
| \`"dark"\` | Forces the built-in dark palette | Dark dashboards, overlays, command-style tools |

\`auto\` is the safest default: CSS resolves the palette before React hydrates. Named themes are **not** string values. Passing \`theme="midnight"\` is invalid; import the object instead.

## Built-in themes

Built-in themes are generated palette objects. They are intentionally imported, not referenced by string name, so bundlers can tree-shake unused palettes.

**Light / bright:** \`tide\`, \`graphite\`, \`mint\`, \`snow\`, \`solar\`, \`slate\`, \`neon\`, \`prism\`, \`meadow\`, \`latte\`, \`split\`, \`riso\`, \`monsoon\`, \`pearl\`, \`chalk\`, \`comfy\`.

**Dark / vibrant:** \`fjord\`, \`industrial\`, \`crimson\`, \`amethyst\`, \`cyber\`, \`espresso\`, \`ember\`, \`phosphor\`, \`midnight\`, \`sandstone\`, \`rosa\`, \`dracula\`, \`nebula\`, \`aurora\`, \`forest\`, \`scarlet\`, \`temporal\`, \`flare\`, \`abyss\`.

> [Browse all themes in the interactive playground →](/themes)

Import from a per-theme subpath when you know what you need:

#### Monsoon theme

\`\`\`tsx
import { monsoon } from "@dateforge/react-calendar/themes";

<Calendar theme={monsoon}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>
\`\`\`

The aggregate \`@dateforge/react-calendar/themes\` export is convenient for galleries and playgrounds, but it makes every built-in theme reachable. Production apps should prefer \`themes/<name>\` for smaller bundles.

## Creating themes

Use \`createTheme()\` when your product has brand tokens that do not match a built-in palette. A custom theme is a typed object that maps semantic color roles to CSS variables.

#### Custom theme

\`\`\`tsx
import { Calendar, createTheme } from "@dateforge/react-calendar";

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
</Calendar>
\`\`\`

## Design tokens

User CSS wins predictably because the package layers styles as \`cal-base, cal-components, cal-modules, themes, appearances, user\`. Themes and appearances set semantic tokens; your app can still override them in its own layer.

### Color tokens

| Token | Role |
| ----- | ---- |
| \`--c-a\` | Accent, primary action color |
| \`--c-at\` | Text on active / selected surfaces |
| \`--c-t-d\` | Dot under selected today |
| \`--c-b\` | Backdrop and popup surface |
| \`--c-h\` | Hover, focus, and selected highlight |
| \`--c-t\` | Calendar grid tone / subtle background |
| \`--c-c\` | Primary text |
| \`--c-s\` | Stroke, dividers, outlines |
| \`--c-x\` | Shadow tint |
| \`--c-d\` | Disabled control background |
| \`--c-m\` | Muted text |
| \`--c-dt\` | Disabled text |
| \`--c-we\` | Weekend marker |
| \`--c-r\` | Range selection background |
| \`--c-e\` | Error / invalid state |

## Appearances

Appearances are structural presets. They are useful when the same date workflow appears in different surfaces: a dense table filter, a friendly booking flow, a touch-first scheduler, or a sharp internal tool.

> [Try all appearances in the interactive playground →](/appearance)

### Structure tokens

| Token | Role |
| ----- | ---- |
| \`--cal-font-size\` | Container-relative base font size |
| \`--cal-text-day\` | Adaptive day-cell text size |
| \`--cal-radius\` | Base radius used across controls |
| \`--cal-container-radius\` | Outer shell radius |
| \`--cal-spacing\` | Base spacing unit |
| \`--cal-border\` | Border width |
| \`--cal-days-padding\` | Day-cell padding |
| \`--cal-track-height\` | Track/drum height |
| \`--cal-day-ratio\` | Day-cell aspect ratio |
| \`--cal-transition\` | Motion duration |
| \`--cal-shadow-sm\`, \`--cal-shadow-md\`, \`--cal-shadow-lg\` | Depth scale using \`--c-x\` |

### Built-in appearances

| Appearance | Character | Good for |
| ---------- | --------- | -------- |
| \`compact\` | Dense, tight, minimal padding | Dashboards, sidebars, data-heavy tools |
| \`square\` | Sharp corners, minimal shadows | Enterprise UI, grids, internal tools |
| \`soft\` | Balanced spacing and gentle rounding | Default product pickers |
| \`bubble\` | Spacious, rounded, prominent shadows | Consumer flows and friendly surfaces |
| \`loft\` | Airy, relaxed, large touch targets | Editorial, scheduling, touch-first UI |

Import appearances the same way as themes. The aggregate path is fine for demos; per-name subpaths are better in production.

#### Bubble appearance

\`\`\`tsx
import { bubble } from "@dateforge/react-calendar/appearances/bubble";

<Calendar appearance={bubble}>
  <CalendarNav showMonthPicker compactYears />
  <CalendarDays />
</Calendar>
\`\`\`

Custom appearances are best when density, rhythm, or shape is part of the brand system.

\`\`\`tsx
import { createAppearance } from "@dateforge/react-calendar";

const dense = createAppearance({
  name: "dense",
  radius: 0.35,
  spacing: 0.45,
  dayRatio: "1 / 0.75",
  transition: "0.14s",
});
\`\`\`
`;

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

export default function DocsPage() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("quick-start");

  const blocks = useMemo(() => parseMarkdown(docsMarkdown), []);
  const headings = useMemo(
    () => blocks.filter((block): block is Heading => block.type === "heading"),
    [blocks],
  );
  const navHeadings = headings.filter(
    (heading) => heading.level <= 3 && heading.text !== "Table of Contents",
  );

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-18% 0px -72% 0px" },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      style={themeVars[dark ? "dark" : "light"] as React.CSSProperties}
      className="min-h-screen bg-[var(--doc-bg)] text-[var(--text-primary)] transition-colors"
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)]/92 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3 text-sm tracking-tight text-[var(--text-primary)] transition"
            >
              <Image
                src="/logo.webp"
                alt=""
                width={36}
                height={36}
                className="size-9 object-contain"
              />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-semibold">DateForge</span>
                <span className="truncate text-xs text-[var(--text-muted)]">
                  Documentation
                </span>
              </span>
            </Link>
            <span className="hidden truncate font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] sm:inline">
              @dateforge/react-calendar / docs
            </span>
          </div>

          <select
            value={active}
            onChange={(event) => scrollTo(event.target.value)}
            className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)] shadow-sm outline-none md:hidden"
          >
            {navHeadings.map((heading) => (
              <option key={heading.id} value={heading.id}>
                {heading.text}
              </option>
            ))}
          </select>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 py-1.5 font-mono text-xs text-[var(--text-muted)] shadow-sm transition hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)] sm:flex"
            >
              GitHub
              <ExternalLink size={12} />
            </a>
            <Link
              href="/"
              aria-label="Back to home"
              className="hidden size-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--doc-bg-secondary)] text-[var(--text-muted)] shadow-sm transition hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)] sm:flex"
            >
              <ArrowLeft size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              className="flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 font-mono text-xs text-[var(--text-muted)] shadow-sm transition hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)]"
            >
              {dark ? <Sun size={13} /> : <Moon size={13} />}
              <span>{dark ? "light" : "dark"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-5 pt-24 sm:px-6">
        <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto border-r border-[var(--border)] pb-8 pr-4 md:block">
          <nav className="flex flex-col gap-0.5">
            {navHeadings.map((heading) => (
              <button
                key={heading.id}
                type="button"
                onClick={() => scrollTo(heading.id)}
                className="cursor-pointer border px-3 py-1.5 text-left font-mono text-xs transition-colors"
                style={{
                  color:
                    active === heading.id
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  background:
                    active === heading.id ? "var(--nav-active)" : "transparent",
                  borderColor:
                    active === heading.id
                      ? "var(--nav-active-border)"
                      : "transparent",
                  borderRadius: "999px",
                  paddingLeft: heading.level === 3 ? "1.5rem" : "0.75rem",
                }}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-32">
          <DocsHero />

          <article className="space-y-0">{renderDocBlocks(blocks)}</article>
        </main>
      </div>
    </div>
  );
}

function renderDocBlocks(blocks: Block[]) {
  const nodes: React.ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const previousBlock = blocks[index - 1];

    if (
      block.type === "code" &&
      previousBlock?.type === "heading" &&
      previousBlock.text === "Quick start"
    ) {
      nodes.push(
        <SimplePresetShowcase key={`${block.type}-${index}`} block={block} />,
      );
      continue;
    }

    const nearestModuleHeading: Heading | undefined =
      previousBlock?.type === "heading" ? previousBlock :
      blocks[index - 2]?.type === "heading" ? (blocks[index - 2] as Heading) : undefined;

    if (
      block.type === "code" &&
      nearestModuleHeading &&
      isModuleName(nearestModuleHeading.text)
    ) {
      nodes.push(
        <ModuleShowcase
          key={`${block.type}-${index}`}
          moduleName={nearestModuleHeading.text}
          code={block.text}
          lang={block.lang}
        />,
      );
      continue;
    }

    if (
      block.type === "code" &&
      previousBlock?.type === "heading" &&
      isRecipeKind(previousBlock.text)
    ) {
      nodes.push(
        <RecipeShowcase
          key={`${block.type}-${index}`}
          kind={previousBlock.text}
          code={block.text}
          lang={block.lang}
        />,
      );
      continue;
    }

    if (block.type === "table") {
      const nearestHeading = findNearestHeading(blocks, index);
      const isModulePropsTable =
        nearestHeading !== undefined && isModuleName(nearestHeading.text);
      if (isModulePropsTable) {
        nodes.push(
          <PropsTableAccordion
            key={`${block.type}-${index}`}
            table={block}
            context={nearestHeading}
            index={index}
          />,
        );
        continue;
      }
      nodes.push(<MarkdownBlock key={`${block.type}-${index}`} block={block} />);
      continue;
    }

    nodes.push(<MarkdownBlock key={`${block.type}-${index}`} block={block} />);
  }

  return nodes;
}

function DocsHero() {
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-emerald-700">
          React calendar
        </span>
        <span className="rounded-full border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
          Modular · Composable · Tokenized
        </span>
      </div>

      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
        Build exactly the calendar your product needs.
      </h1>

      <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
        DateForge gives you a stateful calendar shell and a set of small
        modules: days, navigation, tracks, time, presets, selected chips, and
        custom context hooks. Start with one picker, then grow into the
        composition your workflow needs.
      </p>

      <div className="mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] px-3 py-2 text-[var(--code-text)] shadow-sm">
        <span className="select-none font-mono text-xs text-zinc-500">$</span>
        <code className="min-w-0 flex-1 truncate font-mono text-sm">
          {INSTALL_COMMAND}
        </code>
        <button
          type="button"
          onClick={copyInstall}
          aria-label="Copy install command"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 font-mono text-xs font-medium text-zinc-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "copied" : "copy"}</span>
        </button>
      </div>
    </section>
  );
}

function MarkdownBlock({
  block,
  nestedInAccordion = false,
}: {
  block: Block;
  nestedInAccordion?: boolean;
}) {
  if (block.type === "heading") {
    const Tag = `h${Math.min(block.level, 4)}` as "h1" | "h2" | "h3" | "h4";
    const className =
      block.level === 1
        ? "mb-5 scroll-mt-24 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl"
        : block.level === 2
          ? "mb-5 mt-14 scroll-mt-24 border-b border-[var(--border)] pb-3 text-xl font-semibold tracking-tight text-[var(--text-primary)]"
          : block.level === 3
            ? "mb-4 mt-9 scroll-mt-24 text-base font-semibold text-[var(--text-primary)]"
            : "mb-3 mt-7 scroll-mt-24 text-sm font-semibold text-[var(--text-primary)]";

    return (
      <Tag id={block.id} className={className}>
        {renderInline(block.text)}
      </Tag>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="mb-5 max-w-3xl text-[15px] leading-7 text-[var(--text-secondary)]">
        {renderInline(block.text)}
      </p>
    );
  }

  if (block.type === "code") {
    return <CodeBlock code={block.text} lang={block.lang} />;
  }

  if (block.type === "list") {
    return (
      <ul className="mb-6 max-w-3xl space-y-2 pl-5 text-[15px] leading-7 text-[var(--text-secondary)] marker:text-[var(--emerald)]">
        {block.items.map((item, index) => (
          <li key={index} className="list-disc">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "table") {
    const [head, separator, ...body] = block.rows;
    const rows = isSeparatorRow(separator) ? body : block.rows.slice(1);

    return (
      <div
        className={
          nestedInAccordion
            ? "-mx-4 mb-0 overflow-x-auto"
            : "mb-7 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] shadow-sm"
        }
      >
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-[var(--nav-active)] text-[var(--text-primary)]">
            <tr>
              {head.map((cell, index) => (
                <th
                  key={index}
                  className="border-b border-[var(--border)] px-3 py-2 font-mono text-xs font-medium"
                >
                  {renderInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[var(--text-secondary)]">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[var(--border)] last:border-0"
              >
                {head.map((_, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 align-top leading-6">
                    {renderInline(row[cellIndex] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="mb-8 mt-6">
        <Image
          src={block.src}
          alt={block.alt}
          width={900}
          height={500}
          className="w-full max-w-3xl rounded-none object-contain"
          unoptimized
        />
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="mb-6 max-w-3xl rounded-lg border border-[var(--nav-active-border)] bg-[var(--nav-active)] px-4 py-3 text-[15px] leading-7 text-[var(--text-secondary)]">
        {renderInline(block.text)}
      </blockquote>
    );
  }

  return <hr className="my-8 border-[var(--border)]" />;
}

function PropsTableAccordion({
  table,
  context,
  index,
}: {
  table: Extract<Block, { type: "table" }>;
  context?: Heading;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `${context?.id ?? "props"}-${index}-panel`;
  const title = context ? `${context.text} props` : "Props reference";

  return (
    <section className="mb-5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-[var(--nav-active)]"
      >
        <span className="min-w-0">
          <span className="block text-base font-semibold tracking-tight text-[var(--text-primary)]">
            {renderInline(title)}
          </span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            {open ? "Hide props" : "Show props"}
          </span>
        </span>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--doc-bg)] text-[var(--text-muted)] transition hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)] ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={15} />
        </span>
      </button>

      {open && (
        <div id={panelId} className="border-t border-[var(--border)] px-4 pb-0">
          <MarkdownBlock block={table} nestedInAccordion />
        </div>
      )}
    </section>
  );
}

function SimplePresetShowcase({
  block,
}: {
  block: Extract<Block, { type: "code" }>;
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

function RecipeShowcase({
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

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const label = lang || "text";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-[var(--code-text)] shadow-sm">
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-white/[0.03] px-3">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        <button
          type="button"
          onClick={copyCode}
          aria-label="Copy code"
          className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 font-mono text-[11px] font-medium text-zinc-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "copied" : "copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={normalizeCodeLang(lang)}
        style={oneDark}
        PreTag="div"
        customStyle={{
          margin: 0,
          minWidth: "max-content",
          overflowX: "auto",
          padding: "1rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: 1.7,
        }}
        codeTagProps={{
          style: {
            fontFamily:
              "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function normalizeCodeLang(lang: string) {
  const normalized = lang.toLowerCase();

  if (normalized === "sh" || normalized === "shell" || normalized === "zsh") {
    return "bash";
  }

  if (normalized === "ts") return "typescript";
  if (normalized === "js") return "javascript";

  return normalized || "text";
}

function findNearestHeading(blocks: Block[], fromIndex: number) {
  for (let index = fromIndex - 1; index >= 0; index -= 1) {
    const block = blocks[index];
    if (block.type === "heading") return block;
  }

  return undefined;
}

const MODULE_NAMES = [
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

type ModuleName = (typeof MODULE_NAMES)[number];

function isModuleName(text: string): text is ModuleName {
  return MODULE_NAMES.includes(text as ModuleName);
}

function ModuleShowcase({
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
      <Calendar mode="single" value={date} onChange={setDate} defaultViewDate={defaultViewDate} appearance={soft} minDate={new Date()}>
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

function isRecipeKind(text: string): text is RecipeKind {
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

function parseMarkdown(markdown: string) {
  const blocks: Block[] = [];
  const usedIds = new Map<string, number>();
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```(\w+)?/);
    if (fence) {
      const lang = fence[1] ?? "";
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push({ type: "code", lang, text: code.join("\n") });
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const text = stripMarkdown(heading[2]);
      const baseId = slugify(text);
      const count = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, count + 1);
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text,
        id: count ? `${baseId}-${count}` : baseId,
      });
      index += 1;
      continue;
    }

    if (/^-{3,}\s*$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }

    if (isTableLine(line) && isTableLine(lines[index + 1] ?? "")) {
      const rows: string[][] = [];
      while (index < lines.length && isTableLine(lines[index])) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*-\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      blocks.push({ type: "image", alt: imageMatch[1], src: imageMatch[2] });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^```/.test(lines[index]) &&
      !/^(#{1,4})\s+/.test(lines[index]) &&
      !/^\s*-\s+/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !isTableLine(lines[index]) &&
      !/^-{3,}\s*$/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderInline(text: string) {
  const nodes: React.ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${token}-${match.index}`}
          className="rounded-md border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--emerald)]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong
          key={`${token}-${match.index}`}
          className="font-semibold text-[var(--text-primary)]"
        >
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const external = /^https?:\/\//.test(link[2]);
        nodes.push(
          <a
            key={`${token}-${match.index}`}
            href={link[2]}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="text-[var(--sky)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--text-primary)]"
          >
            {link[1]}
          </a>,
        );
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function isTableLine(line: string) {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function parseTableRow(line: string) {
  const input = line.trim().replace(/^\||\|$/g, "");
  const cells: string[] = [];
  let cell = "";

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === "\\" && next === "|") {
      cell += "|";
      index += 1;
      continue;
    }

    if (char === "|") {
      cells.push(cell.trim());
      cell = "";
      continue;
    }

    cell += char;
  }

  cells.push(cell.trim());
  return cells;
}

function isSeparatorRow(row?: string[]) {
  return Boolean(row?.every((cell) => /^:?-{3,}:?$/.test(cell.trim())));
}

function stripMarkdown(text: string) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[–—]/g, "-")
    .trim();
}

function slugify(text: string) {
  return (
    stripMarkdown(text)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}
