import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeCalendarPreview } from "./HomeCalendarPreview";
import { InstallSnippet } from "./InstallSnippet";
import { SiteHeader } from "./SiteHeader";

const STORYBOOK_URL = "https://kirilinsky.github.io/dateforge-react-calendar/";
const CODECOV_BADGE =
  "https://codecov.io/gh/kirilinsky/dateforge-react-calendar/branch/main/graph/badge.svg";

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
  return (
    <main className="min-h-[100dvh] bg-[#fbfbfd] text-zinc-950 lg:h-[100dvh] lg:overflow-hidden">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-5 py-4 sm:px-8 lg:h-[100dvh] lg:min-h-0">
        <SiteHeader coverage={coverage} />

        <section className="flex flex-1 flex-col items-center justify-around gap-4 py-3 text-center lg:justify-center lg:gap-10">
          <div className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]">
            <HomeCalendarPreview />
          </div>
          <div className="flex flex-col items-center gap-3">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:max-w-none lg:text-6xl lg:whitespace-nowrap">
              A calendar that fits your product.
            </h1>

            <p className="max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              Start with a simple date picker, then add ranges, presets, time,
              themes, and custom product logic only when you need them and mix
              as you want.
            </p>
          </div>
          <div className="w-full max-w-md">
            <InstallSnippet />
          </div>
          <div className="flex w-full max-w-2xl flex-col items-stretch justify-center gap-2 sm:flex-row">
            <BranchLink
              href="/examples"
              title="Browse examples"
              text="Polished recipes"
            />
            <BranchLink href="/docs" title="Read docs" text="Complete API" />
            <BranchLink href="/themes" title="Theming" text="Explore themes" />
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
