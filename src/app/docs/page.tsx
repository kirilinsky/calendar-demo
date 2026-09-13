"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ExternalLink, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { appleEaseOut } from "../motion";
import { DocsHero } from "./components/DocsHero";
import { ScrollToTop } from "../ScrollToTop";
import Content from "./content.mdx";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GITHUB_URL = "https://github.com/kirilinsky/dateforge-react-calendar";
const DARK_STORAGE_KEY = "dateforge:docs-dark";
const DARK_EVENT = "dateforge:docs-dark-change";

/** Saved choice wins; otherwise follow the OS. */
function readDark(): boolean {
  try {
    const saved = window.localStorage.getItem(DARK_STORAGE_KEY);
    if (saved === "1") return true;
    if (saved === "0") return false;
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function saveDark(dark: boolean) {
  try {
    window.localStorage.setItem(DARK_STORAGE_KEY, dark ? "1" : "0");
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
  window.dispatchEvent(new Event(DARK_EVENT));
}

function subscribeDark(onChange: () => void) {
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  window.addEventListener("storage", onChange);
  window.addEventListener(DARK_EVENT, onChange);
  media?.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(DARK_EVENT, onChange);
    media?.removeEventListener("change", onChange);
  };
}

function useDocsDark(): boolean {
  return useSyncExternalStore(subscribeDark, readDark, () => false);
}

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
    "--code-inline-bg": "rgba(255,255,255,0.06)",
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
    "--code-inline-bg": "rgba(24,24,27,0.04)",
    "--amber": "#b45309",
    "--sky": "#0284c7",
    "--emerald": "#059669",
    "--violet": "#7c3aed",
  },
} as const;

type HeadingEntry = { id: string; text: string; level: number };
type HeadingGroup = { parent: HeadingEntry; children: HeadingEntry[] };

/** h3s nest under the h2 above them; a leading h3 gets its own group. */
function groupHeadings(list: HeadingEntry[]): HeadingGroup[] {
  const groups: HeadingGroup[] = [];
  for (const heading of list) {
    const last = groups[groups.length - 1];
    if (heading.level === 3 && last) last.children.push(heading);
    else groups.push({ parent: heading, children: [] });
  }
  return groups;
}

export default function DocsPage() {
  const dark = useDocsDark();
  const [headings, setHeadings] = useState<HeadingEntry[]>([]);
  const [active, setActive] = useState<string>("");
  const articleRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const groups = useMemo(() => groupHeadings(headings), [headings]);

  const toggleDark = () => saveDark(!dark);

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
    if (list.length) setActive(list[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActive(topmost.target.id);
      },
      { rootMargin: "-18% 0px -72% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      style={themeVars[dark ? "dark" : "light"] as React.CSSProperties}
      className={`min-h-screen bg-[var(--doc-bg)] text-[var(--text-primary)] transition-colors ${dark ? "dark" : ""}`}
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
            aria-label="On this page"
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
              onClick={toggleDark}
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
        <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto pb-8 pr-4 md:block">
          <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            On this page
          </p>
          <nav className="flex flex-col border-l border-[var(--border)]">
            {groups.map(({ parent, children }) => {
              const open =
                active === parent.id ||
                children.some((child) => child.id === active);
              return (
                <div key={parent.id}>
                  <NavItem
                    heading={parent}
                    active={active === parent.id}
                    onSelect={scrollTo}
                  />
                  <AnimatePresence initial={false}>
                    {open && children.length > 0 && (
                      <motion.div
                        key="children"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { duration: 0.28, ease: appleEaseOut }
                        }
                        className="overflow-hidden"
                      >
                        {children.map((child) => (
                          <NavItem
                            key={child.id}
                            heading={child}
                            active={active === child.id}
                            onSelect={scrollTo}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-32">
          <DocsHero />

          <article ref={articleRef} className="space-y-0">
            <Content />
          </article>
        </main>
      </div>

      <ScrollToTop className="border-[var(--border)] bg-[var(--doc-bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
    </div>
  );
}

function NavItem({
  heading,
  active,
  onSelect,
}: {
  heading: HeadingEntry;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const nested = heading.level === 3;
  return (
    <button
      type="button"
      onClick={() => onSelect(heading.id)}
      aria-current={active ? "location" : undefined}
      className={`-ml-px block w-full cursor-pointer border-l-2 py-1.5 pr-2 text-left transition-colors duration-200 ${
        nested ? "pl-6 text-[11px]" : "pl-3 text-xs"
      } ${
        active
          ? "border-[var(--emerald)] bg-[var(--nav-active)] text-[var(--text-primary)]"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      } font-mono`}
    >
      {heading.text}
    </button>
  );
}
