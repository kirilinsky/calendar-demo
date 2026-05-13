"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Loader2,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";
import { CalendarPreview } from "../CalendarPreview";

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

const fallbackMarkdown = `# @dateforge/react-calendar — Documentation

The full documentation is loaded from GitHub:

${SOURCE_URL}

If this page cannot reach GitHub from your network, open the source link above.`;

const primerMarkdown = `## Simple preset

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
  const [dark, setDark] = useState(false);
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
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 py-1.5 font-mono text-xs text-[var(--text-muted)] shadow-sm transition hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)] sm:flex"
            >
              Source
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
                className="border px-3 py-1.5 text-left font-mono text-xs transition-colors"
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
          <div className="mb-8 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            {loading && (
              <span className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 py-1.5 font-mono shadow-sm">
                <Loader2 size={14} className="animate-spin" />
                Loading GitHub documentation
              </span>
            )}
            {error && (
              <span className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-3 py-2 font-mono shadow-sm">
                <RefreshCw size={14} />
                {error}
              </span>
            )}
          </div>

          <article className="space-y-0">
            {renderDocBlocks(blocks)}
          </article>
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
      previousBlock.text === "Simple preset"
    ) {
      nodes.push(
        <SimplePresetShowcase
          key={`${block.type}-${index}`}
          block={block}
        />,
      );
      continue;
    }

    if (block.type === "table") {
      nodes.push(
        <PropsTableAccordion
          key={`${block.type}-${index}`}
          table={block}
          context={findNearestHeading(blocks, index)}
          index={index}
        />,
      );
      continue;
    }

    nodes.push(<MarkdownBlock key={`${block.type}-${index}`} block={block} />);
  }

  return nodes;
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
          className="rounded-md border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--emerald)]"
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
