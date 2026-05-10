"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, RefreshCw } from "lucide-react";

const DOC_URL =
  "https://raw.githubusercontent.com/kirilinsky/dateforge-react-calendar/main/DOCUMENTATION.md";
const SOURCE_URL =
  "https://github.com/kirilinsky/dateforge-react-calendar/blob/main/DOCUMENTATION.md";

type Block =
  | { type: "heading"; level: number; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "quote"; text: string }
  | { type: "hr" };

type Heading = Extract<Block, { type: "heading" }>;

const themeVars = {
  dark: {
    "--doc-bg": "#0a0a0a",
    "--doc-bg-secondary": "#111111",
    "--text-primary": "rgba(255,255,255,0.88)",
    "--text-secondary": "rgba(255,255,255,0.58)",
    "--text-muted": "rgba(255,255,255,0.34)",
    "--border": "rgba(255,255,255,0.08)",
    "--nav-active": "rgba(255,255,255,0.07)",
    "--code-bg": "rgba(0,0,0,0.62)",
    "--code-border": "rgba(255,255,255,0.09)",
    "--code-text": "#d4d4d8",
    "--amber": "#fbbf24",
    "--sky": "#38bdf8",
    "--emerald": "#34d399",
    "--violet": "#c4b5fd",
  },
  light: {
    "--doc-bg": "#ffffff",
    "--doc-bg-secondary": "#f8f8f7",
    "--text-primary": "#111111",
    "--text-secondary": "#555555",
    "--text-muted": "#999999",
    "--border": "rgba(0,0,0,0.08)",
    "--nav-active": "rgba(0,0,0,0.05)",
    "--code-bg": "#f4f4f5",
    "--code-border": "rgba(0,0,0,0.08)",
    "--code-text": "#3f3f46",
    "--amber": "#b45309",
    "--sky": "#0369a1",
    "--emerald": "#059669",
    "--violet": "#7c3aed",
  },
} as const;

const fallbackMarkdown = `# @dateforge/react-calendar — Documentation

The full documentation is loaded from GitHub:

${SOURCE_URL}

If this page cannot reach GitHub from your network, open the source link above.`;

const primerMarkdown = `## Install

\`\`\`bash
npm install @dateforge/react-calendar
# or
pnpm add @dateforge/react-calendar
# or
yarn add @dateforge/react-calendar
\`\`\`

## Quick Start

\`\`\`tsx
import { useState } from "react";
import { Calendar } from "@dateforge/react-calendar";
import {
  CalendarDays,
  CalendarNav,
  CalendarSelectedDates,
} from "@dateforge/react-calendar/modules";

export function MyPicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Calendar mode="single" value={date} onChange={setDate}>
      <CalendarNav showMonthPicker compactYears />
      <CalendarDays />
      <CalendarSelectedDates />
    </Calendar>
  );
}
\`\`\`

## Core idea in 30 seconds

DateForge is headless and modular. The \`<Calendar>\` shell owns state (mode, value, view date, theme, appearance, disabled rules, time step). You compose visible UI from small modules: \`CalendarNav\`, \`CalendarDays\`, \`CalendarMonthsGrid\`, \`CalendarYearsGrid\`, \`CalendarTimeGrid\`, \`CalendarPresets\`, \`CalendarSelectedDates\`, plus track variants for compact bound pickers. Mount only what the UI needs and the calendar wires itself together.

## Common recipes

- **Single date** — \`mode="single"\` + \`CalendarNav\` + \`CalendarDays\`.
- **Date range** — \`mode="range"\`; range highlight comes for free.
- **Multiple dates** — \`mode="multiple"\` with optional \`maxDates\`.
- **Two months side by side** — \`cols={2}\` and two \`CalendarDays\` (one with \`offset={1}\`).
- **Year-only / month-only picker** — drop \`CalendarDays\` and mount \`CalendarYearsGrid\` or \`CalendarMonthsGrid\` solo with \`onYearSelect\` / \`onMonthSelect\`.
- **Time slot picker** — only \`CalendarTimeGrid\`, plus \`timeStep={{ minute: 10 }}\` for snapped slots.
- **Disabled dates** — \`createDisabled({ before, weekends, ranges, dates, weekdays })\`.
- **Theming** — pass \`theme\` (built-in or \`createTheme(...)\`) and \`appearance\` (\`compact\`, \`soft\`, \`bubble\`, \`loft\`, \`square\`, or \`createAppearance(...)\`).

---
`;

export default function DocsPage() {
  const [dark, setDark] = useState(true);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState("dateforge-react-calendar-documentation");

  const blocks = useMemo(
    () =>
      parseMarkdown(`${primerMarkdown}\n${markdown || fallbackMarkdown}`),
    [markdown],
  );
  const headings = useMemo(
    () => blocks.filter((block): block is Heading => block.type === "heading"),
    [blocks],
  );
  const navHeadings = headings.filter(
    (heading) => heading.level <= 3 && heading.text !== "Table of Contents",
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDocs() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(DOC_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        const text = await response.text();
        if (!cancelled) setMarkdown(text);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load docs");
          setMarkdown(fallbackMarkdown);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDocs();
    return () => {
      cancelled = true;
    };
  }, []);

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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--doc-bg)]/92 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 font-mono text-sm text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={15} />
              Home
            </Link>
            <span className="hidden truncate font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] sm:inline">
              @dateforge/react-calendar / docs
            </span>
          </div>

          <select
            value={active}
            onChange={(event) => scrollTo(event.target.value)}
            className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-2 py-1 font-mono text-xs text-[var(--text-secondary)] outline-none md:hidden"
          >
            {navHeadings.map((heading) => (
              <option key={heading.id} value={heading.id}>
                {heading.text}
              </option>
            ))}
          </select>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--text-muted)] transition hover:text-[var(--text-primary)] sm:flex"
            >
              Source
              <ExternalLink size={12} />
            </a>
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              className="rounded-md border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
            >
              {dark ? "light" : "dark"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-5 pt-20 sm:px-6">
        <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-56 shrink-0 self-start overflow-y-auto pb-8 md:block">
          <nav className="flex flex-col gap-0.5">
            {navHeadings.map((heading) => (
              <button
                key={heading.id}
                type="button"
                onClick={() => scrollTo(heading.id)}
                className="rounded-lg px-3 py-1.5 text-left font-mono text-xs transition-colors"
                style={{
                  color:
                    active === heading.id
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  background:
                    active === heading.id ? "var(--nav-active)" : "transparent",
                  paddingLeft: heading.level === 3 ? "1.5rem" : "0.75rem",
                }}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-32">
          <div className="mb-8 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            {loading && (
              <span className="flex items-center gap-2 font-mono">
                <Loader2 size={14} className="animate-spin" />
                Loading GitHub documentation
              </span>
            )}
            {error && (
              <span className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 py-2 font-mono">
                <RefreshCw size={14} />
                {error}
              </span>
            )}
          </div>

          <article className="space-y-0">
            {blocks.map((block, index) => (
              <MarkdownBlock key={`${block.type}-${index}`} block={block} />
            ))}
          </article>
        </main>
      </div>
    </div>
  );
}

function MarkdownBlock({ block }: { block: Block }) {
  if (block.type === "heading") {
    const Tag = `h${Math.min(block.level, 4)}` as "h1" | "h2" | "h3" | "h4";
    const className =
      block.level === 1
        ? "mb-5 scroll-mt-20 text-3xl font-semibold tracking-tight sm:text-5xl"
        : block.level === 2
          ? "mb-6 mt-14 scroll-mt-20 border-b border-[var(--border)] pb-3 text-xl font-medium"
          : block.level === 3
            ? "mb-4 mt-9 scroll-mt-20 text-base font-semibold text-[var(--text-primary)]"
            : "mb-3 mt-7 scroll-mt-20 text-sm font-semibold text-[var(--text-primary)]";

    return (
      <Tag id={block.id} className={className}>
        {renderInline(block.text)}
      </Tag>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="mb-5 text-[15px] leading-7 text-[var(--text-secondary)]">
        {renderInline(block.text)}
      </p>
    );
  }

  if (block.type === "code") {
    return (
      <pre className="mb-6 overflow-x-auto rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] p-4 font-mono text-sm leading-relaxed text-[var(--code-text)]">
        <code>{block.text}</code>
      </pre>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="mb-6 space-y-2 pl-5 text-[15px] leading-7 text-[var(--text-secondary)]">
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
      <div className="mb-7 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-[var(--doc-bg-secondary)] text-[var(--text-primary)]">
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
              <tr key={rowIndex} className="border-b border-[var(--border)] last:border-0">
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

  if (block.type === "quote") {
    return (
      <blockquote className="mb-6 border-l-2 border-[var(--border)] pl-4 text-[15px] italic leading-7 text-[var(--text-secondary)]">
        {renderInline(block.text)}
      </blockquote>
    );
  }

  return <hr className="my-8 border-[var(--border)]" />;
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
          className="rounded-md bg-[var(--doc-bg-secondary)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--amber)]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${token}-${match.index}`} className="font-semibold text-[var(--text-primary)]">
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
