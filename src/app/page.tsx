import Link from "next/link";
import Image from "next/image";
import {
  Accessibility,
  ArrowUpRight,
  BookOpen,
  Github,
  Package,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import { HomeCalendarPreview } from "./HomeCalendarPreview";
import { InstallSnippet } from "./InstallSnippet";

const STORYBOOK_URL = "https://kirilinsky.github.io/dateforge-react-calendar/";
const GITHUB_URL = "https://github.com/kirilinsky/dateforge-react-calendar";
const NPM_URL = "https://www.npmjs.com/package/@dateforge/react-calendar";
const CODECOV_URL =
  "https://app.codecov.io/gh/kirilinsky/dateforge-react-calendar";
const CODECOV_BADGE =
  "https://codecov.io/gh/kirilinsky/dateforge-react-calendar/branch/main/graph/badge.svg";
const SSR_URL =
  "https://github.com/kirilinsky/dateforge-react-calendar/actions/workflows/ssr.yml";
const A11Y_URL =
  "https://github.com/kirilinsky/dateforge-react-calendar/actions/workflows/a11y.yml";

export const revalidate = 3600;

async function getCoverage(): Promise<string | null> {
  try {
    const res = await fetch(CODECOV_BADGE, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const svg = await res.text();
    const match = svg.match(/>(\d+(?:\.\d+)?)%</);
    return match ? `${match[1]}%` : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const coverage = await getCoverage();
  const coverageLabel = coverage ? `${coverage} Test coverage` : "Test coverage";
  return (
    <main className="h-[100dvh] overflow-hidden bg-[#fbfbfd] text-zinc-950">
      <div className="mx-auto flex h-[100dvh] w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
        <header className="flex h-12 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 tracking-tight"
            aria-label="DateForge home"
          >
            <Image
              src="/logo.webp"
              alt=""
              width={44}
              height={44}
              className="size-11 object-contain"
              priority
            />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold">DateForge</span>
              <span className="hidden text-xs text-zinc-500 sm:block">
                Composable calendar for React interfaces.
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 lg:flex">
              <QualityBadge
                icon={<ServerCog size={13} />}
                label="SSR Safe"
                tone="emerald"
                href={SSR_URL}
              />
              <QualityBadge
                icon={<Accessibility size={13} />}
                label="AXE A11Y Passed"
                tone="violet"
                href={A11Y_URL}
              />
              <QualityBadge
                icon={<ShieldCheck size={13} />}
                label={coverageLabel}
                tone="sky"
                href={CODECOV_URL}
              />
            </div>
            <nav className="flex items-center gap-3 text-sm text-zinc-500 sm:gap-5">
              <Link
                href={STORYBOOK_URL}
                className="flex size-9 items-center justify-center rounded-md transition hover:bg-zinc-100 hover:text-zinc-950"
                target="_blank"
                rel="noreferrer"
                aria-label="Open DateForge Storybook"
              >
                <BookOpen size={18} />
              </Link>
              <Link
                href={GITHUB_URL}
                className="flex size-9 items-center justify-center rounded-md transition hover:bg-zinc-100 hover:text-zinc-950"
                target="_blank"
                rel="noreferrer"
                aria-label="DateForge on GitHub"
              >
                <Github size={18} />
              </Link>
              <Link
                href={NPM_URL}
                className="flex size-9 items-center justify-center rounded-md transition hover:bg-zinc-100 hover:text-zinc-950"
                target="_blank"
                rel="noreferrer"
                aria-label="DateForge on npm"
              >
                <Package size={18} />
              </Link>
            </nav>
          </div>
        </header>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 lg:hidden">
          <QualityBadge
            icon={<ServerCog size={13} />}
            label="SSR safe"
            tone="emerald"
            href={SSR_URL}
          />
          <QualityBadge
            icon={<Accessibility size={13} />}
            label="axe a11y"
            tone="violet"
            href={A11Y_URL}
          />
          <QualityBadge
            icon={<ShieldCheck size={13} />}
            label={coverageLabel}
            tone="sky"
            href={CODECOV_URL}
          />
        </div>

        <section className="flex flex-1 flex-col items-center justify-around gap-4 py-3 text-center">
          <div className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]">
            <HomeCalendarPreview />
          </div>

          <div className="flex flex-col items-center gap-3">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:max-w-none lg:text-6xl lg:whitespace-nowrap">
              A calendar that fits your product.
            </h1>
            <div className="w-full max-w-md">
              <InstallSnippet />
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              Start with a simple date picker, then add ranges, presets, time,
              themes, and custom product logic only when you need them and mix
              as you want.
            </p>
          </div>

          <div className="flex w-full max-w-2xl flex-col items-stretch justify-center gap-2 sm:flex-row">
            <BranchLink
              href="/examples"
              title="Browse examples"
              text="Polished recipes"
            />
            <BranchLink href="/docs" title="Read docs" text="Complete API" />
            <BranchLink
              href={STORYBOOK_URL}
              title="Open Storybook"
              text="Interactive playground"
              external
            />
          </div>
        </section>
      </div>
    </main>
  );
}

const TONE_CLASSES: Record<"emerald" | "violet" | "sky", string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
};

function QualityBadge({
  icon,
  label,
  tone,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "emerald" | "violet" | "sky";
  href?: string;
}) {
  const className = `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-tight shadow-sm transition ${TONE_CLASSES[tone]}`;
  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${className} hover:brightness-95`}
      >
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <span className={className}>
      {icon}
      {label}
    </span>
  );
}

function BranchLink({
  href,
  title,
  text,
  external = false,
}: {
  href: string;
  title: string;
  text: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex min-h-12 items-center justify-between gap-4 rounded-full border border-zinc-200 bg-white/70 px-4 text-left shadow-sm transition hover:border-zinc-300 hover:bg-white"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-zinc-500">{text}</span>
      </span>
      <ArrowUpRight
        size={16}
        className="shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-950"
      />
    </Link>
  );
}
