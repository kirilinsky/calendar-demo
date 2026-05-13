import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InstallSnippet } from "./InstallSnippet";
import { SiteHeader } from "./SiteHeader";
import { CalendarPreview } from "./CalendarPreview";

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

        <section className="flex flex-1 flex-col items-center justify-around gap-6 py-4 text-center lg:justify-evenly lg:gap-0 lg:py-6">
          <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:max-w-none lg:text-6xl lg:whitespace-nowrap">
            Build exactly the calendar your product needs.
          </h1>
          <div className="w-full max-w-[225px] sm:max-w-[265px] lg:max-w-[300px]">
            <CalendarPreview width="100%" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-medium tracking-tight text-zinc-500">
              Monolithic pickers ship everything. DateForge ships only what you
              use.
            </span>
            <div className="w-full max-w-md">
              <InstallSnippet />
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              Start minimal. Scale infinitely. Add only the modules you need.
            </p>
          </div>

          <div className="flex w-full max-w-2xl flex-col items-stretch justify-center gap-2 sm:flex-row">
            <BranchLink
              href="/examples"
              title="Browse Examples"
              text="Polished recipes"
              variant="secondary"
            />
            <BranchLink
              href={STORYBOOK_URL}
              title="Open Storybook"
              text="Interactive playground"
              external
              variant="primary"
            />
            <BranchLink
              href="/docs"
              title="Read Documentation"
              text="Complete API"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

type BranchVariant = "default" | "secondary" | "primary";

const BRANCH_VARIANTS: Record<
  BranchVariant,
  { link: string; title: string; sub: string; arrow: string; size: number }
> = {
  primary: {
    link: "min-h-14 px-5 border border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600 hover:border-emerald-600",
    title: "text-base font-bold",
    sub: "text-emerald-50/90",
    arrow: "text-white",
    size: 18,
  },
  secondary: {
    link: "min-h-14 px-5 border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300",
    title: "text-sm font-semibold",
    sub: "text-emerald-700/70",
    arrow: "text-emerald-400 group-hover:text-emerald-900",
    size: 16,
  },
  default: {
    link: "min-h-14 px-5 border border-zinc-200 bg-white/70 text-zinc-950 hover:border-zinc-300 hover:bg-white",
    title: "text-sm font-semibold",
    sub: "text-zinc-500",
    arrow: "text-zinc-400 group-hover:text-zinc-950",
    size: 16,
  },
};

function BranchLink({
  href,
  title,
  text,
  external = false,
  variant = "default",
}: {
  href: string;
  title: string;
  text: string;
  external?: boolean;
  variant?: BranchVariant;
}) {
  const v = BRANCH_VARIANTS[variant];
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`group flex items-center justify-between gap-4 rounded-full text-left shadow-sm transition ${v.link}`}
    >
      <span className="min-w-0">
        <span className={`block truncate ${v.title}`}>{title}</span>
        <span className={`block truncate text-xs ${v.sub}`}>{text}</span>
      </span>
      <ArrowUpRight
        size={v.size}
        className={`shrink-0 transition group-hover:translate-x-0.5 ${v.arrow}`}
      />
    </Link>
  );
}
