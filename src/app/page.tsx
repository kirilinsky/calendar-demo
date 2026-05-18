import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InstallSnippet } from "./InstallSnippet";
import { SiteHeader } from "./SiteHeader";
import { CalendarPreview } from "./CalendarPreview";
import { RandomizeButton } from "./RandomizeButton";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";

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
    <main className="h-[100dvh] snap-y snap-mandatory overflow-y-auto bg-[#fbfbfd] text-zinc-950 lg:overflow-hidden lg:snap-none">
      {/* screen 1 */}
      <div className="flex h-[100dvh] w-full snap-start flex-col">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
          <SiteHeader coverage={coverage} />
          <section className="flex flex-1 flex-col py-2 text-center lg:gap-8 lg:py-6">
            <Reveal delay={0.05}>
              <h1 className="mt-2 mb-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-4xl lg:mt-0 lg:text-5xl lg:whitespace-nowrap">
                Build exactly the calendar your product needs.
              </h1>
            </Reveal>

            <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-0">
              {/* calendar */}
              <div className="order-1 flex flex-1 flex-col items-center justify-center gap-3 lg:order-2 lg:flex-none lg:items-end">
                <Reveal delay={0.18} y={18} className="w-full max-w-[320px] lg:max-w-[330px]">
                  <CalendarPreview width="100%" navLinks={[]} />
                </Reveal>
                <Reveal delay={0.32} className="flex flex-col items-center gap-2">
                  <RandomizeButton />
                  <Link
                    href="/themes"
                    className="text-sm font-medium text-zinc-400 transition hover:text-zinc-700"
                  >
                    Themes &amp; Looks →
                  </Link>
                </Reveal>
              </div>

              {/* content — desktop only in screen 1 */}
              <div className="order-2 hidden lg:order-1 lg:flex lg:flex-col lg:items-center lg:mt-0 lg:pr-12 lg:gap-4">
                <Reveal delay={0.12}>
                  <span className="text-[11px] font-medium tracking-tight text-zinc-500 lg:text-sm">
                    Monolithic pickers ship everything. DateForge ships only what
                    you use.
                  </span>
                </Reveal>
                <Reveal delay={0.2} className="hidden w-full max-w-md lg:block">
                  <InstallSnippet />
                </Reveal>
                <Reveal delay={0.28}>
                  <p className="hidden max-w-xl text-sm leading-6 text-zinc-600 lg:block lg:text-base">
                    Start minimal. Scale infinitely. Add only the modules you
                    need.
                  </p>
                </Reveal>
                <Reveal delay={0.36} className="flex w-full flex-row gap-1.5 lg:max-w-sm lg:flex-col lg:gap-2">
                  <BranchLink
                    href={STORYBOOK_URL}
                    title="Storybook"
                    text="Interactive playground"
                    external
                    variant="primary"
                  />
                  <BranchLink href="/docs" title="Docs" text="Complete API" />
                  <BranchLink
                    href="/examples"
                    title="Examples"
                    text="Polished recipes"
                    variant="secondary"
                  />
                </Reveal>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* screen 2 — mobile only */}
      <div className="flex h-[100dvh] w-full snap-start flex-col items-center justify-center gap-6 px-5 text-center lg:hidden">
        <Reveal delay={0.05}>
          <span className="text-sm font-medium tracking-tight text-zinc-500">
            Monolithic pickers ship everything. DateForge ships only what you use.
          </span>
        </Reveal>
        <Reveal delay={0.15} className="w-full max-w-md">
          <InstallSnippet />
        </Reveal>
        <Reveal delay={0.25}>
          <p className="max-w-xs text-sm leading-6 text-zinc-600">
            Start minimal. Scale infinitely. Add only the modules you need.
          </p>
        </Reveal>
        <Reveal delay={0.35} className="flex w-full flex-col gap-2">
          <BranchLink
            href={STORYBOOK_URL}
            title="Storybook"
            text="Interactive playground"
            external
            variant="primary"
          />
          <BranchLink href="/docs" title="Docs" text="Complete API" />
          <BranchLink
            href="/examples"
            title="Examples"
            text="Polished recipes"
            variant="secondary"
          />
        </Reveal>
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
    link: "border border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600 hover:border-emerald-600",
    title: "text-xs font-bold lg:text-base",
    sub: "hidden lg:block text-emerald-50/90",
    arrow: "hidden lg:block text-white",
    size: 16,
  },
  secondary: {
    link: "border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300",
    title: "text-xs font-semibold lg:text-sm",
    sub: "hidden lg:block text-emerald-700/70",
    arrow: "hidden lg:block text-emerald-400 group-hover:text-emerald-900",
    size: 15,
  },
  default: {
    link: "border border-zinc-200 bg-white/70 text-zinc-950 hover:border-zinc-300 hover:bg-white",
    title: "text-xs font-semibold lg:text-sm",
    sub: "hidden lg:block text-zinc-500",
    arrow: "hidden lg:block text-zinc-400 group-hover:text-zinc-950",
    size: 15,
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
    <Button
      asChild
      variant="outline"
      className={`group h-10 flex-1 justify-center gap-4 rounded-full px-4 text-left shadow-sm lg:h-16 lg:justify-between lg:px-6 lg:py-3 ${v.link}`}
    >
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
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
    </Button>
  );
}
