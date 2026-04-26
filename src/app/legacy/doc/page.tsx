"use client";

import { useState, useEffect } from "react";
import { Calendar } from "react-calendar-datetime";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "single", label: "Single date" },
  { id: "range", label: "Date range" },
  { id: "multiple", label: "Multi-select" },
  { id: "props-data", label: "Data & callbacks" },
  { id: "props-selection", label: "Selection modes" },
  { id: "props-layout", label: "Layout modules" },
  { id: "props-appearance", label: "Appearance" },
  { id: "props-visibility", label: "Visibility" },
  { id: "disabled", label: "Disabled dates" },
  { id: "themes", label: "Themes" },
  { id: "css-vars", label: "CSS variables" },
  { id: "locales", label: "Localization" },
  { id: "limitations", label: "Limitations" },
];

const THEMES_LIST = [
  { id: "carbon", bg: "#1a1a1c", hi: "#ffffff", type: "dark" },
  { id: "midnight", bg: "#1a1e2b", hi: "#3559e0", type: "dark" },
  { id: "cyber", bg: "#07070b", hi: "#00f3ff", type: "dark" },
  { id: "phosphor", bg: "#010401", hi: "#76ff03", type: "dark" },
  { id: "dracula", bg: "#1c1111", hi: "#ff5e5e", type: "dark" },
  { id: "sandstone", bg: "#1f1c18", hi: "#e3ae5c", type: "dark" },
  { id: "temporal", bg: "#14252e", hi: "#27d1f4", type: "dark" },
  { id: "industrial", bg: "#111111", hi: "#e85d00", type: "dark" },
  { id: "crimson", bg: "#0d0909", hi: "#f92f2f", type: "dark" },
  { id: "forest", bg: "#0b1a0d", hi: "#4ade80", type: "dark" },
  { id: "nebula", bg: "#0b0a16", hi: "#b388ff", type: "dark" },
  { id: "paper", bg: "#ffffff", hi: "#1a1a1c", type: "light" },
  { id: "graphite", bg: "#eaecf0", hi: "#f1a01d", type: "light" },
  { id: "mint", bg: "#f8f9fc", hi: "#60d276", type: "light" },
  { id: "comfy", bg: "#e9ded5", hi: "#a65d3a", type: "light" },
  { id: "snow", bg: "#e2e5e9", hi: "#3a60d6", type: "light" },
  { id: "rosa", bg: "#dbd8e0", hi: "#d65d91", type: "light" },
  { id: "solar", bg: "#d8cf9a", hi: "#e67e22", type: "light" },
  { id: "neon", bg: "#f7f8f9", hi: "#80ec27", type: "light" },
  { id: "amethyst", bg: "#f5f3f7", hi: "#681c9e", type: "light" },
  { id: "latte", bg: "#f5ede0", hi: "#7c4a1e", type: "light" },
];

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function Code({ children }: { children: string }) {
  return (
    <pre
      style={{
        background: "var(--code-bg)",
        borderColor: "var(--code-border)",
      }}
      className="rounded-xl border p-4 overflow-x-auto text-sm font-mono leading-relaxed"
    >
      <code style={{ color: "var(--code-text)" }}>{children}</code>
    </pre>
  );
}

function CodeCollapse({
  label = "show code",
  children,
}: {
  label?: string;
  children: string;
}) {
  return (
    <details className="group">
      <summary
        style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
        className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none py-2 list-none hover:opacity-80 transition-opacity"
      >
        <span
          className="inline-block transition-transform group-open:rotate-90"
          style={{ fontSize: 10 }}
        >
          ▶
        </span>
        {label}
      </summary>
      <div className="mt-2">
        <Code>{children}</Code>
      </div>
    </details>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <h2
        style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
        className="text-xl font-medium mb-6 pb-3 border-b"
      >
        {title}
      </h2>
      <div
        className="space-y-6 text-[15px] leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {children}
      </div>
    </section>
  );
}

function PropRow({
  name,
  type,
  def,
  desc,
}: {
  name: string;
  type: string;
  def?: string;
  desc: string;
}) {
  return (
    <div
      style={{ borderColor: "var(--border)" }}
      className="flex flex-col gap-1 py-3 border-b last:border-0"
    >
      <div className="flex items-center gap-3 flex-wrap">
        <code style={{ color: "var(--amber)" }} className="font-mono text-sm">
          {name}
        </code>
        <code style={{ color: "var(--sky)" }} className="font-mono text-xs">
          {type}
        </code>
        {def && (
          <span style={{ color: "var(--text-muted)" }} className="text-xs">
            default: <code className="font-mono">{def}</code>
          </span>
        )}
      </div>
      <p style={{ color: "var(--text-muted)" }} className="text-[15px]">
        {desc}
      </p>
    </div>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ borderColor: "var(--border)", background: "var(--demo-bg)" }}
      className="rounded-xl border p-6 flex justify-center items-center"
    >
      {children}
    </div>
  );
}

function SingleDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="carbon"
        width={370}
      />
    </Demo>
  );
}

function RangeDemo() {
  const today = new Date();
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: today,
    to: addDays(today, 2),
  });
  return (
    <Demo>
      <Calendar
        mode="range"
        value={range}
        onRangeChange={(r) => setRange(r)}
        theme="sandstone"
        width={370}
        showSelectedDates
      />
    </Demo>
  );
}

function MultiDemo() {
  const today = new Date();
  const [dates, setDates] = useState<Date[]>([
    today,
    addDays(today, 2),
    addDays(today, 5),
  ]);
  return (
    <Demo>
      <Calendar
        mode="multiple"
        value={dates}
        onDatesChange={(d) => setDates(d)}
        max={5}
        theme="forest"
        width={370}
        showSelectedDates
      />
    </Demo>
  );
}

function TwoMonthsDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="temporal"
        twoMonthsLayout
        width={560}
      />
    </Demo>
  );
}

function TwoMonthsRangeDemo() {
  const today = new Date();
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: addDays(today, 6),
    to: addDays(today, 35),
  });
  return (
    <Demo>
      <Calendar
        mode="range"
        value={range}
        onRangeChange={(r) => setRange(r)}
        theme="crimson"
        twoMonthsLayout
        monthsColumn
        monthsGrid
        showSelectedDates
        presets
        width={310}
      />
    </Demo>
  );
}

function PresetsDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="sandstone"
        presets
        width={370}
      />
    </Demo>
  );
}

function TimeGridDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="cyber"
        timeGrid
        time={false}
        width={340}
      />
    </Demo>
  );
}

function BrutalismDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="industrial"
        brutalism
        gradient
        width={370}
      />
    </Demo>
  );
}

function DisabledDemo() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilWeekday = dayOfWeek === 0 ? 1 : dayOfWeek === 6 ? 2 : 0;
  const [date, setDate] = useState<Date>(addDays(today, daysUntilWeekday));

  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="dracula"
        width={370}
        disabled={[{ dayOfWeek: [0, 6] }, { before: today }]}
      />
    </Demo>
  );
}

function ThemeSwatchDemo() {
  const [picked, setPicked] = useState<string>("carbon");
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {THEMES_LIST.map((t) => (
          <button
            key={t.id}
            onClick={() => setPicked(t.id)}
            title={t.id}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono transition-all cursor-pointer"
            style={{
              background: picked === t.id ? "var(--nav-active)" : "transparent",
              color:
                picked === t.id ? "var(--text-primary)" : "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              style={{ background: t.bg, border: "1px solid var(--border)" }}
              className="inline-block w-3 h-3 rounded-sm shrink-0"
            />
            <span
              style={{ background: t.hi }}
              className="inline-block w-3 h-3 rounded-sm shrink-0"
            />
            {t.id}
          </button>
        ))}
      </div>
      <Demo>
        <Calendar
          value={date}
          onChange={(d) => {
            if (d) setDate(d as Date);
          }}
          theme={picked as any}
          width={370}
          showSelectedDates
          showHomeButton
        />
      </Demo>
      <CodeCollapse label="show code">{`<Calendar theme="${picked}" value={date} onChange={setDate} />`}</CodeCollapse>
    </div>
  );
}

function NavigationDemo() {
  const today = new Date();
  const [dates, setDates] = useState<Date[]>([
    addDays(today, 35),
    addDays(today, 38),
  ]);
  return (
    <Demo>
      <Calendar
        value={dates as Date[]}
        onDatesChange={(d) => setDates(d)}
        theme="phosphor"
        width={370}
        showHomeButton
        showClearButton
        time={false}
        mode="multiple"
      />
    </Demo>
  );
}

function MonthGridDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="rosa"
        width={400}
        monthsGrid
        months={false}
        showClearButton
        hour12
        years
        compactYears={false}
        time={true}
      />
    </Demo>
  );
}

function WeekNumbersDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="comfy"
        width={370}
        showWeekNumber
        shortMonths
      />
    </Demo>
  );
}

function BoundsDemo() {
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="latte"
        width={370}
        startDate={today}
        endDate={addDays(today, 20)}
        hideLimited
        showClearButton
      />
    </Demo>
  );
}

function FullModularDemo() {
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <Demo>
      <Calendar
        value={date as Date}
        onChange={(d) => setDate(d)}
        theme="latte"
        width={500}
        presets
        timeGrid
        years
        months={false}
        monthsGrid
        compactYears={false}
        showWeekNumber
        showHomeButton
        showClearButton
        compactMonths
        showSelectedDates
      />
    </Demo>
  );
}

function StartOfWeekDemo() {
  const [date, setDate] = useState<Date>(new Date());
  const [startOfWeek, setStartOfWeek] = useState<number>(1);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 flex-wrap">
        {days.map((label, i) => (
          <button
            key={i}
            onClick={() => setStartOfWeek(i)}
            className="px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all"
            style={{
              background:
                startOfWeek === i ? "var(--nav-active)" : "transparent",
              color:
                startOfWeek === i ? "var(--text-primary)" : "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {i} — {label}
          </button>
        ))}
      </div>
      <Demo>
        <Calendar
          value={date}
          onChange={(d) => {
            if (d) setDate(d as Date);
          }}
          theme="snow"
          width={320}
          startOfWeek={startOfWeek as any}
        />
      </Demo>
    </div>
  );
}

function AppearanceVariantsDemo() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Demo>
      <Calendar
        value={date}
        onChange={(d) => {
          if (d) setDate(d as Date);
        }}
        theme="neon"
        width={370}
        highlightWeekends={false}
        shortMonths
        gradient
      />
    </Demo>
  );
}

export default function DocPage() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty("--doc-bg", "#0a0a0a");
      root.style.setProperty("--doc-bg-secondary", "#111111");
      root.style.setProperty("--text-primary", "rgba(255,255,255,0.88)");
      root.style.setProperty("--text-secondary", "rgba(255,255,255,0.55)");
      root.style.setProperty("--text-muted", "rgba(255,255,255,0.3)");
      root.style.setProperty("--border", "rgba(255,255,255,0.07)");
      root.style.setProperty("--nav-active", "rgba(255,255,255,0.06)");
      root.style.setProperty("--code-bg", "rgba(0,0,0,0.6)");
      root.style.setProperty("--code-border", "rgba(255,255,255,0.08)");
      root.style.setProperty("--code-text", "#a1a1aa");
      root.style.setProperty("--amber", "#fbbf24");
      root.style.setProperty("--sky", "#38bdf8");
      root.style.setProperty("--emerald", "#34d399");
      root.style.setProperty("--demo-bg", "rgba(255,255,255,0.02)");
    } else {
      root.style.setProperty("--doc-bg", "#ffffff");
      root.style.setProperty("--doc-bg-secondary", "#f8f8f7");
      root.style.setProperty("--text-primary", "#111111");
      root.style.setProperty("--text-secondary", "#555555");
      root.style.setProperty("--text-muted", "#999999");
      root.style.setProperty("--border", "rgba(0,0,0,0.08)");
      root.style.setProperty("--nav-active", "rgba(0,0,0,0.05)");
      root.style.setProperty("--code-bg", "#f4f4f5");
      root.style.setProperty("--code-border", "rgba(0,0,0,0.08)");
      root.style.setProperty("--code-text", "#3f3f46");
      root.style.setProperty("--amber", "#b45309");
      root.style.setProperty("--sky", "#0369a1");
      root.style.setProperty("--emerald", "#059669");
      root.style.setProperty("--demo-bg", "rgba(0,0,0,0.02)");
    }
  }, [dark]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      style={{
        background: "var(--doc-bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        transition: "background .2s, color .2s",
      }}
    >
      <header
        style={{ borderColor: "var(--border)", background: "var(--doc-bg)" }}
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6 shrink-0">
            <a
              href="/legacy"
              style={{ color: "var(--text-muted)" }}
              className="font-mono text-sm hover:opacity-80 transition-opacity cursor-pointer"
            >
              ← demo
            </a>
            <span
              style={{ color: "var(--text-muted)" }}
              className="hidden sm:inline text-xs tracking-widest uppercase font-mono"
            >
              react-calendar-datetime / docs
            </span>
          </div>
          <select
            value={active}
            onChange={(e) => scrollTo(e.target.value)}
            style={{
              color: "var(--text-secondary)",
              background: "var(--doc-bg-secondary)",
              borderColor: "var(--border)",
            }}
            className="md:hidden flex-1 min-w-0 text-xs font-mono rounded-md px-2 py-1 border cursor-pointer outline-none"
          >
            {NAV.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setDark((d) => !d)}
            style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            className="shrink-0 text-xs font-mono rounded-md px-3 py-1 border hover:opacity-80 transition-opacity cursor-pointer"
          >
            {dark ? "☀ light" : "☾ dark"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-20 flex gap-12">
        <aside className="hidden md:block w-48 shrink-0 sticky top-20 self-start">
          <nav className="flex flex-col gap-0.5">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-xs px-3 py-1.5 rounded-lg transition-colors font-mono cursor-pointer"
                style={{
                  color:
                    active === id ? "var(--text-primary)" : "var(--text-muted)",
                  background:
                    active === id ? "var(--nav-active)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 pb-32">
          <Section id="overview" title="Overview">
            <p>
              <strong style={{ color: "var(--text-primary)" }}>
                react-calendar-datetime
              </strong>{" "}
              is an ultra-lightweight Date &amp; Time picker for React — zero
              dependencies, fluid adaptive layout, and 20 built-in themes.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono"
            >
              {[
                ["bundle", "~10 kb gzipped"],
                ["dependencies", "0"],
                ["themes", "20 (dark + light)"],
                ["locales", "200+ via Intl API"],
                ["react", "^18 || ^19"],
                ["selection modes", "single · range · multi"],
                ["layout", "two months · fully modular · wide · column"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span
                    style={{ color: "var(--text-muted)", minWidth: "7rem" }}
                  >
                    {k}
                  </span>
                  <span style={{ color: "var(--emerald)" }}>{v}</span>
                </div>
              ))}
            </div>
            <CodeCollapse label="quick start">{`import { Calendar } from 'react-calendar-datetime'

<Calendar value={date} onChange={setDate} theme="carbon" />`}</CodeCollapse>
          </Section>

          <Section id="install" title="Install">
            <Code>{`npm i react-calendar-datetime
# or
pnpm add react-calendar-datetime
# or
yarn add react-calendar-datetime`}</Code>
            <p>
              No peer dependencies beyond React itself. Works with React 18 and
              19.
            </p>
          </Section>

          <Section id="single" title="Single date">
            <p>
              The default mode. Pass a{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Date
              </code>{" "}
              to{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                value
              </code>{" "}
              and receive an updated one — or{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                null
              </code>{" "}
              when the user clicks the same day to deselect — via{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                onChange
              </code>
              .
            </p>
            <SingleDemo />
            <CodeCollapse>{`import { Calendar } from 'react-calendar-datetime'
import { useState } from 'react'

export default function App() {
  const [date, setDate] = useState(new Date())

  return (
    <Calendar
      value={date}
      onChange={(d) => {
        // d is Date | null — null when user deselects
        if (d) setDate(d as Date)
      }}
    />
  )
}`}</CodeCollapse>
          </Section>

          <Section id="range" title="Date range">
            <p>
              Set{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                mode="range"
              </code>
              . The first click sets{" "}
              <code style={{ color: "var(--sky)" }} className="font-mono">
                from
              </code>
              , hover shows a live preview, the second click sets{" "}
              <code style={{ color: "var(--sky)" }} className="font-mono">
                to
              </code>
              . Clicking{" "}
              <code style={{ color: "var(--sky)" }} className="font-mono">
                from
              </code>{" "}
              again resets both. While picking the end date{" "}
              <code style={{ color: "var(--sky)" }} className="font-mono">
                to
              </code>{" "}
              is{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                null
              </code>
              .
            </p>
            <RangeDemo />
            <CodeCollapse>{`import { Calendar } from 'react-calendar-datetime'
import { useState } from 'react'

type Range = { from: Date | null; to: Date | null }

export default function App() {
  const today = new Date()
  const [range, setRange] = useState<Range>({
    from: today,
    to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
  })

  return (
    <Calendar
      mode="range"
      value={range}
      onRangeChange={(r) => setRange(r)}
      rangeMinDays={2}
      rangeMaxDays={30}
      showSelectedDates
    />
  )
}`}</CodeCollapse>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border p-4 text-xs font-mono space-y-2"
            >
              <p
                style={{ color: "var(--text-muted)" }}
                className="uppercase tracking-widest mb-3"
              >
                range click logic
              </p>
              {[
                ["1st click", "sets from, clears to"],
                ["hover", "live preview of potential range"],
                ["2nd click", "sets to — range complete"],
                ["click from again", "resets both to null"],
                ["rangeMinDays", "shorter spans are blocked"],
                ["rangeMaxDays", "days beyond limit are dimmed"],
              ].map(([when, result]) => (
                <div key={when} className="flex gap-4">
                  <span
                    style={{ color: "var(--text-muted)", minWidth: "8rem" }}
                  >
                    {when}
                  </span>
                  <span style={{ color: "var(--emerald)" }}>→ {result}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="multiple" title="Multi-select">
            <p>
              Set{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                mode="multiple"
              </code>
              . Each click toggles the date. Use{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                max
              </code>{" "}
              to cap the selection; further clicks are silently ignored once
              reached.
            </p>
            <MultiDemo />
            <CodeCollapse>{`import { Calendar } from 'react-calendar-datetime'
import { useState } from 'react'

export default function App() {
  const today = new Date()
  const [dates, setDates] = useState<Date[]>([
    today,
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
  ])

  return (
    <Calendar
      mode="multiple"
      value={dates}
      onDatesChange={(d) => setDates(d)}
      max={5}           // optional cap
      showSelectedDates // chips panel below calendar
    />
  )
}`}</CodeCollapse>
          </Section>

          <Section id="props-data" title="Props — Data & callbacks">
            <PropRow
              name="value"
              type="Date | Date[] | { from: Date|null; to: Date|null }"
              desc="Current value. Single mode: Date. Multi mode: Date[]. Range mode: { from, to } object."
            />
            <PropRow
              name="onChange"
              type="(date: Date | null) => void"
              desc="Single mode only. Fires on select; receives null when the user deselects the active date."
            />
            <PropRow
              name="onDatesChange"
              type="(dates: Date[]) => void"
              desc="Multiple mode only. Fires with the full updated selection array on every click."
            />
            <PropRow
              name="onRangeChange"
              type="(range: { from: Date|null; to: Date|null }) => void"
              desc="Range mode only. Fires on each click. to is null while the end date has not yet been picked."
            />
            <PropRow
              name="startDate"
              type="Date"
              desc="Minimum selectable and navigable date. Days before this date are dimmed (or hidden if hideLimited is true)."
            />
            <PropRow
              name="endDate"
              type="Date"
              desc="Maximum selectable and navigable date. Days after this date are dimmed (or hidden if hideLimited is true)."
            />
            <PropRow
              name="startMonth"
              type="Date"
              desc="Initial month to display when the calendar first renders. Does not select a date."
            />
            <PropRow
              name="locale"
              type="string"
              def="'en'"
              desc="Any valid BCP 47 locale tag — 'en', 'de', 'zh-CN', 'ar-SA', 'pt-BR', etc. Powered by the native Intl API."
            />
            <PropRow
              name="theme"
              type="CalendarTheme"
              def="'paper'"
              desc="One of 20 built-in themes. See the Themes section."
            />
            <PropRow
              name="width"
              type="string | number"
              def="'100%'"
              desc="Any CSS width value ('100%', 370, '480px'). The layout adapts fluidly — font sizes and spacing scale with the container."
            />
            <PropRow
              name="startOfWeek"
              type="0–6"
              def="1"
              desc="Day the week starts on. 0 = Sunday, 1 = Monday, 2 = Tuesday … 6 = Saturday."
            />
            <PropRow
              name="disabled"
              type="boolean | Date | { dayOfWeek } | { before, after } | { from, to } | array"
              desc="One or more disabled date rules. Pass true to disable everything, a Date for a single day, or rule objects for weekdays, before/after bounds, or ranges. See the Disabled Dates section."
            />
            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Pick which day the week starts on:
            </p>
            <StartOfWeekDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  startOfWeek={1} // 0 = Sun, 1 = Mon, 6 = Sat
/>`}</CodeCollapse>
          </Section>

          <Section id="props-selection" title="Props — Selection modes">
            <PropRow
              name="mode"
              type="'single' | 'multiple' | 'range'"
              def="'single'"
              desc="Controls selection behaviour."
            />
            <PropRow
              name="max"
              type="number"
              desc="mode='multiple' only. Caps the number of selectable dates. Omit for unlimited selection."
            />
            <PropRow
              name="rangeMinDays"
              type="number"
              desc="mode='range' only. Minimum span in calendar days. Selections shorter than this are blocked."
            />
            <PropRow
              name="rangeMaxDays"
              type="number"
              desc="mode='range' only. Maximum span in calendar days. Days beyond the limit are dimmed and unclickable."
            />
            <PropRow
              name="showSelectedDates"
              type="boolean"
              def="false"
              desc="Renders a panel below the calendar showing selected dates (single), a chip list (multi), or the from–to range (range)."
            />
            <CodeCollapse label="show examples">{`// Single — default, no extra props needed
<Calendar value={date} onChange={setDate} />

// Range with 2–14 day constraint
<Calendar
  mode="range"
  value={range}
  onRangeChange={setRange}
  rangeMinDays={2}
  rangeMaxDays={14}
  showSelectedDates
/>

// Multi with 3-date cap
<Calendar
  mode="multiple"
  value={dates}
  onDatesChange={setDates}
  max={3}
  showSelectedDates
/>`}</CodeCollapse>
          </Section>

          <Section id="props-layout" title="Props — Layout modules">
            <p>
              Every panel is opt-in. Combine them freely — they compose without
              conflict.
            </p>
            <PropRow
              name="twoMonthsLayout"
              type="boolean"
              def="false"
              desc="Show the current and next month side by side. Automatically stacks to a single column below ~540 px container width."
            />
            <PropRow
              name="time"
              type="boolean"
              def="true"
              desc="Time button in the header — opens a time popup on click."
            />
            <PropRow
              name="timeGrid"
              type="boolean"
              def="false"
              desc="Full-size time picker panel rendered alongside the calendar (no popup)."
            />
            <PropRow
              name="months"
              type="boolean"
              def="true"
              desc="Previous/next month navigation arrows in the header."
            />
            <PropRow
              name="years"
              type="boolean"
              def="false"
              desc="Previous/next year navigation arrows in the header."
            />
            <PropRow
              name="monthsGrid"
              type="boolean"
              def="false"
              desc="Full-size month-grid panel alongside the calendar for fast month jumping."
            />
            <PropRow
              name="compactMonths"
              type="boolean"
              def="false"
              desc="Compact month dropdown button in the header."
            />
            <PropRow
              name="compactYears"
              type="boolean"
              def="true"
              desc="Compact year dropdown button in the header."
            />
            <PropRow
              name="monthsColumn"
              type="boolean"
              def="false"
              desc="Stack months vertically in two-months layout."
            />
            <PropRow
              name="presets"
              type="boolean"
              def="false"
              desc="Quick-select preset buttons (Today, Tomorrow, This week, Next week, This month)."
            />
            <PropRow
              name="showWeekNumber"
              type="boolean"
              def="false"
              desc="Display ISO week numbers alongside each row."
            />
            <PropRow
              name="showHomeButton"
              type="boolean"
              def="false"
              desc="Home button in the header — becomes active when viewing any month other than the current one. Click navigates back without selecting a date."
            />
            <PropRow
              name="showClearButton"
              type="boolean"
              def="false"
              desc="Clear button in the header — active when any date is selected. Click clears the entire selection (single, multi, or range)."
            />

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Two-months layout — stacks automatically on narrow containers:
            </p>
            <TwoMonthsDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  twoMonthsLayout
  showWeekNumber
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Two months + stacked columns + month grid + range selection +
              selected dates panel:
            </p>
            <TwoMonthsRangeDemo />
            <CodeCollapse>{`<Calendar
  mode="range"
  value={range}
  onRangeChange={setRange}
  twoMonthsLayout
  monthsColumn
  monthsGrid
  showSelectedDates
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Week numbers + abbreviated month names:
            </p>
            <WeekNumbersDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  theme="comfy"
  showWeekNumber
  shortMonths
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Month grid panel — click any month to jump straight to it:
            </p>
            <MonthGridDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  monthsGrid
  compactYears
  time={false}
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Presets panel — Today, Tomorrow, This week, Next week, This month:
            </p>
            <PresetsDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  presets
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Inline time grid alongside the calendar:
            </p>
            <TimeGridDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  timeGrid
  time={false}
  hour12
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              <code style={{ color: "var(--amber)" }} className="font-mono">
                showHomeButton
              </code>{" "}
              navigates back to today's month without selecting.{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                showClearButton
              </code>{" "}
              clears any selection.{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                years
              </code>{" "}
              adds prev/next year arrows.{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                compactMonths
              </code>{" "}
              turns the month label into a dropdown:
            </p>
            <NavigationDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  theme="phosphor"
  showHomeButton
  showClearButton
  years
  compactMonths
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Everything on — presets, inline time grid, week numbers, home
              &amp; clear buttons, month grid
            </p>
            <FullModularDemo />
            <CodeCollapse label="show full modular example">{`<Calendar
  value={date}
  onChange={setDate}
  theme="midnight"
  presets
  timeGrid
  showWeekNumber
  showHomeButton
  showClearButton
  compactMonths
  gradient
/>`}</CodeCollapse>
          </Section>

          <Section id="props-appearance" title="Props — Appearance">
            <PropRow
              name="gradient"
              type="boolean"
              def="false"
              desc="Adds a subtle radial gradient tinted by the active theme's accent colour."
            />
            <PropRow
              name="brutalism"
              type="boolean"
              def="false"
              desc="Brutalism aesthetic — monospace font, hard borders, no border radius."
            />
            <PropRow
              name="hour12"
              type="boolean"
              def="false"
              desc="12-hour AM/PM format for the time picker. Default is 24-hour."
            />
            <PropRow
              name="highlightWeekends"
              type="boolean"
              def="true"
              desc="Visually highlights Saturday and Sunday in the day grid."
            />
            <PropRow
              name="highlightToday"
              type="boolean"
              def="true"
              desc="Visually highlights today's cell with outline border."
            />
            <PropRow
              name="shortMonths"
              type="boolean"
              def="false"
              desc="Use abbreviated month names (Jan, Feb, Mar…) in headers."
            />

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Brutalism mode with gradient:
            </p>
            <BrutalismDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  theme="industrial"
  brutalism
  gradient
/>`}</CodeCollapse>

            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              No weekend highlight, abbreviated months, gradient tint:
            </p>
            <AppearanceVariantsDemo />
            <CodeCollapse>{`<Calendar
  value={date}
  onChange={setDate}
  theme="neon"
  highlightWeekends={false}
  shortMonths
  gradient
/>`}</CodeCollapse>
          </Section>

          <Section id="props-visibility" title="Props — Visibility">
            <PropRow
              name="hideLimited"
              type="boolean"
              def="false"
              desc="Hide dates outside startDate/endDate entirely instead of dimming them."
            />
            <PropRow
              name="hideDisabled"
              type="boolean"
              def="false"
              desc="Hide disabled dates entirely instead of rendering them with a strikethrough."
            />
            <PropRow
              name="hideWeekdays"
              type="boolean"
              def="false"
              desc="Hide the weekday header row (Mon Tue Wed…)."
            />
            <PropRow
              name="gestures"
              type="boolean"
              def="true"
              desc="Swipe left/right on the day grid to change months. Swipe on time tracks to adjust hours/minutes."
            />
            <p style={{ color: "var(--text-secondary)" }} className="pt-2">
              Date bounds with{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                startDate
              </code>{" "}
              /{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                endDate
              </code>{" "}
              +{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                hideLimited
              </code>{" "}
              — only the next 20 days are visible:
            </p>
            <BoundsDemo />
            <CodeCollapse>{`const today = new Date()
const in20 = new Date(today)
in20.setDate(today.getDate() + 20)

<Calendar
  value={date}
  onChange={setDate}
  theme="latte"
  startDate={today}
  endDate={in20}
  hideLimited       // hides out-of-range days entirely
  showClearButton
/>`}</CodeCollapse>
          </Section>

          <Section id="disabled" title="Disabled dates">
            <p>
              Pass one rule or an array of rules to the{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                disabled
              </code>{" "}
              prop. All matching rules are applied simultaneously.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden"
            >
              {[
                [
                  "{ dayOfWeek: [0, 6] }",
                  "Disable specific weekdays. 0 = Sunday, 6 = Saturday.",
                ],
                [
                  "new Date('2024-12-25')",
                  "Disable a single specific date by passing a Date directly.",
                ],
                [
                  "{ before: new Date() }",
                  "Disable all dates before the given date.",
                ],
                [
                  "{ after: endOfYear }",
                  "Disable all dates after the given date.",
                ],
                [
                  "{ before: dateA, after: dateB }",
                  "Combine before and after in one rule.",
                ],
                [
                  "{ from: dateA, to: dateB }",
                  "Disable a contiguous date range.",
                ],
                ["true", "Disable the entire calendar (all dates)."],
              ].map(([rule, desc], i) => (
                <div
                  key={i}
                  className="px-4 py-3 text-xs font-mono flex flex-col gap-1"
                  style={{
                    background: i % 2 === 0 ? "var(--demo-bg)" : "transparent",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <code style={{ color: "var(--amber)" }}>{rule}</code>
                  <span style={{ color: "var(--text-muted)" }}>{desc}</span>
                </div>
              ))}
            </div>
            <p>
              Use{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                hideDisabled
              </code>{" "}
              to remove disabled days from the grid entirely.
            </p>
            <DisabledDemo />
            <CodeCollapse>{`// Block weekends + past dates
<Calendar
  value={date}
  onChange={setDate}
  disabled={[
    { dayOfWeek: [0, 6] },
    { before: new Date() },
  ]}
/>

// Block a specific date + a closed range
<Calendar
  value={date}
  onChange={setDate}
  disabled={[
    new Date("2025-01-01"),
    { from: new Date("2025-08-01"), to: new Date("2025-08-15") },
  ]}
  hideDisabled
/>

// Entire calendar disabled
<Calendar value={date} onChange={setDate} disabled={true} />`}</CodeCollapse>
          </Section>

          <Section id="themes" title="Themes">
            <p>
              20 built-in themes via the{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                theme
              </code>{" "}
              prop — 10 dark, 10 light. Swatches show background · accent. Click
              a theme to preview it live:
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden"
            ></div>
            <ThemeSwatchDemo />
          </Section>

          <Section id="css-vars" title="CSS variables">
            <p>
              Each theme exposes four CSS custom properties you can override at
              the{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                :root
              </code>{" "}
              level or on any parent element.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden"
            >
              {[
                ["--c-b", "Background colour of the calendar"],
                [
                  "--c-h",
                  "Accent / highlight colour (selected dates, active elements)",
                ],
                ["--c-c", "Primary text colour"],
                ["--c-s", "Border and separator colour"],
              ].map(([v, desc], i) => (
                <div
                  key={v}
                  className="flex items-start gap-4 px-4 py-3 text-xs font-mono"
                  style={{
                    background: i % 2 === 0 ? "var(--demo-bg)" : "transparent",
                  }}
                >
                  <code style={{ color: "var(--amber)", minWidth: "5rem" }}>
                    {v}
                  </code>
                  <span style={{ color: "var(--text-muted)" }}>{desc}</span>
                </div>
              ))}
            </div>
            <p>
              The{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                gradient
              </code>{" "}
              prop adds a radial tint derived from{" "}
              <code style={{ color: "var(--amber)" }} className="font-mono">
                --c-h
              </code>{" "}
              automatically.
            </p>
            <CodeCollapse label="show override example">{`/* Override the carbon theme to use an indigo accent */
:root {
  --c-h: #6366f1;
}

/* Scope overrides to a single calendar instance */
.my-calendar-wrapper {
  --c-b: #0f172a;
  --c-h: #f59e0b;
  --c-c: #f1f5f9;
  --c-s: rgba(255, 255, 255, 0.08);
}

// Then wrap the Calendar
<div className="my-calendar-wrapper">
  <Calendar value={date} onChange={setDate} theme="carbon" />
</div>`}</CodeCollapse>
          </Section>

          <Section id="locales" title="Localization">
            <p>
              Powered by the native{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl
              </code>{" "}
              API — 200+ BCP 47 locales, zero extra bytes. Days, months, date
              labels, and the range separator all follow local standards
              automatically.
            </p>
            <Demo>
              <div className="flex flex-wrap gap-4 justify-center">
                {(["en", "de", "zh", "ar", "fr", "sk"] as const).map((loc) => (
                  <div key={loc} className="flex flex-col items-center gap-2">
                    <code
                      style={{ color: "var(--text-muted)" }}
                      className="text-xs font-mono"
                    >
                      {loc}
                    </code>
                    <Calendar
                      value={new Date()}
                      onChange={() => {}}
                      locale={loc}
                      theme="carbon"
                      width={240}
                      time={true}
                      compactYears={false}
                      presets
                    />
                  </div>
                ))}
              </div>
            </Demo>
            <CodeCollapse label="show locale examples">{`<Calendar locale="en" />     // English (default)
<Calendar locale="de" />     // Deutsch
<Calendar locale="fr" />     // Français
<Calendar locale="ru" />     // Русский
<Calendar locale="zh-CN" />  // 中文 (简体)
<Calendar locale="zh-TW" />  // 中文 (繁體)
<Calendar locale="ja" />     // 日本語
<Calendar locale="ar-SA" />  // العربية
<Calendar locale="pt-BR" />  // Português (Brasil)
<Calendar locale="tr" />     // Türkçe
<Calendar locale="ko" />     // 한국어
<Calendar locale="pl" />     // Polski`}</CodeCollapse>
            <p>
              Pass any valid{" "}
              <a
                href="https://www.ietf.org/rfc/rfc5646.txt"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--sky)" }}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                BCP 47
              </a>{" "}
              language tag, including regional variants. No configuration, no
              locale files to import.
            </p>
          </Section>

          <Section id="limitations" title="Limitations">
            <div className="space-y-3">
              {[
                {
                  title: "Output depends on the runtime's Intl data",
                  body: "All date and time formatting is delegated to the native Intl API. Exact output — punctuation, abbreviated month names, ordinals — may differ between Node versions, browsers, and operating systems. Avoid hardcoding expected strings in snapshot tests; use pattern matching instead.",
                },
                {
                  title: "No custom format strings",
                  body: "The calendar renders dates using Intl.DateTimeFormat internally. If you need a specific display pattern like 'DD/MM/YYYY' in a separate input, format it yourself using a dedicated formatter and pass it outside of the Calendar component.",
                },
                {
                  title: "twoMonthsLayout always shows current + next",
                  body: "The second panel always follows the first. You cannot render two arbitrary months — the layout is always a consecutive pair.",
                },
                {
                  title: "No SSR calendar state",
                  body: "The Calendar is a client component. If you render it on the server without a 'use client' boundary, you will get a hydration mismatch for the current date. Wrap it in dynamic(() => import(...), { ssr: false }) or a client boundary.",
                },
                {
                  title: "Node.js < 13",
                  body: "Older Node versions shipped with small-icu — only the 'en' locale was guaranteed. Node 13+ includes full ICU by default. On older versions, install the full-icu package separately and set NODE_ICU_DATA.",
                },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  style={{ borderColor: "var(--border)" }}
                  className="rounded-xl border p-4"
                >
                  <p
                    style={{ color: "var(--text-primary)" }}
                    className="font-medium mb-1 text-sm"
                  >
                    {title}
                  </p>
                  <p style={{ color: "var(--text-muted)" }} className="text-sm">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
