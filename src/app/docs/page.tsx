"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, Moon, Sun } from "lucide-react";
import { DocsHero } from "./components/DocsHero";
import Content from "./content.mdx";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GITHUB_URL = "https://github.com/kirilinsky/dateforge-react-calendar";

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

type HeadingEntry = { id: string; text: string; level: number };

export default function DocsPage() {
  const [dark, setDark] = useState(false);
  const [headings, setHeadings] = useState<HeadingEntry[]>([]);
  const [active, setActive] = useState<string>("");
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!articleRef.current) return;
    const elements = Array.from(
      articleRef.current.querySelectorAll<HTMLElement>("h2[id], h3[id]"),
    );
    const list: HeadingEntry[] = elements.map((element) => ({
      id: element.id,
      text: element.textContent?.trim() ?? "",
      level: Number(element.tagName.slice(1)),
    }));
    setHeadings(list);
    if (list.length && !active) setActive(list[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-18% 0px -72% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [active]);

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
            {headings.map((heading) => (
              <option key={heading.id} value={heading.id}>
                {heading.text}
              </option>
            ))}
          </select>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden border-[var(--border)] bg-[var(--doc-bg-secondary)] font-mono text-xs text-[var(--text-muted)] shadow-sm hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)] sm:inline-flex"
            >
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub
                <ExternalLink size={12} />
              </a>
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  size="icon-sm"
                  aria-label="Back to home"
                  className="hidden border-[var(--border)] bg-[var(--doc-bg-secondary)] text-[var(--text-muted)] shadow-sm hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)] sm:inline-flex"
                >
                  <Link href="/">
                    <ArrowLeft size={14} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to home</TooltipContent>
            </Tooltip>
            <Button
              type="button"
              onClick={() => setDark((value) => !value)}
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-[var(--doc-bg-secondary)] font-mono text-xs text-[var(--text-muted)] shadow-sm hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)]"
            >
              {dark ? <Sun size={13} /> : <Moon size={13} />}
              <span>{dark ? "light" : "dark"}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-5 pt-24 sm:px-6">
        <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto border-r border-[var(--border)] pb-8 pr-4 md:block">
          <nav className="flex flex-col gap-0.5">
            {headings.map((heading) => (
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

          <article ref={articleRef} className="space-y-0">
            <Content />
          </article>
        </main>
      </div>
    </div>
  );
}
