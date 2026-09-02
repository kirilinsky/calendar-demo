import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InstallSnippet } from "./InstallSnippet";
import { HeroCode } from "./HeroCode";
import { SiteHeader } from "./SiteHeader";
import { CalendarPreview } from "./CalendarPreview";
import { RandomizeButton } from "./RandomizeButton";
import { Reveal } from "./Reveal";
import { VersionBadge } from "./VersionBadge";
import { Button } from "@/components/ui/button";
import dateForgePackage from "../../node_modules/@dateforge/react-calendar/package.json";

const STORYBOOK_URL = "https://kirilinsky.github.io/dateforge-react-calendar/";
const CODECOV_BADGE =
  "https://codecov.io/gh/kirilinsky/dateforge-react-calendar/branch/main/graph/badge.svg";
const DATEFORGE_VERSION = dateForgePackage.version;

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
      <div className="relative flex h-[100dvh] w-full snap-start flex-col">
        <span className="pointer-events-none absolute bottom-3 left-4 z-10 select-none font-mono text-[10px] leading-none text-zinc-300/65 sm:bottom-4 sm:left-5">
          @dateforge/react-calendar v{DATEFORGE_VERSION}
        </span>

        {/* pinned footer controls — desktop only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden justify-center sm:bottom-4 lg:flex">
          <Reveal
            delay={0.32}
            className="pointer-events-auto flex items-center gap-4"
          >
            <RandomizeButton />
            <Link
              href="/themes"
              className="text-sm font-medium text-zinc-400 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-zinc-700"
            >
              Themes &amp; Looks →
            </Link>
          </Reveal>
        </div>
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
          <SiteHeader coverage={coverage} />
          <section className="flex flex-1 flex-col py-2 text-center lg:gap-8 lg:py-6">
            <Reveal delay={0.02}>
              <VersionBadge version={DATEFORGE_VERSION} />
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-1 mb-1 text-xl font-semibold tracking-tight text-zinc-950 sm:mt-2 sm:mb-2 sm:text-4xl lg:mt-0 lg:text-5xl lg:whitespace-nowrap">
                Build exactly the calendar your product needs.
              </h1>
            </Reveal>

            <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-0">
              {/* calendar */}
              <div className="order-1 flex flex-1 flex-col items-center justify-center gap-3 lg:order-2 lg:flex-none lg:items-end">
                <Reveal
                  delay={0.18}
                  y={22}
                  scale
                  className="w-full max-w-[327px] sm:max-w-[358px] lg:max-w-[370px]"
                >
                  <CalendarPreview
                    width="100%"
                    navLinks={[]}
                    reserveHeight="min(440px, 58dvh)"
                  />
                </Reveal>
                <Reveal
                  delay={0.32}
                  className="flex flex-col items-center gap-2 lg:hidden"
                >
                  <RandomizeButton />
                  <Link
                    href="/themes"
                    className="text-sm font-medium text-zinc-400 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-zinc-700"
                  >
                    Themes &amp; Looks →
                  </Link>
                </Reveal>
              </div>

              {/* content — desktop only in screen 1 */}
              <div className="order-2 hidden lg:order-1 lg:mt-0 lg:flex lg:flex-col lg:items-start lg:gap-3 lg:pr-12 lg:text-left">
                <Reveal delay={0.12} className="[@media(max-height:700px)]:hidden">
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-[11px] font-medium leading-none text-zinc-500 shadow-sm">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                    />
                    Composable modules · zero config to start
                  </span>
                </Reveal>
                <Reveal delay={0.18} className="w-full max-w-md">
                  <p className="text-sm leading-6 text-zinc-600 lg:text-[15px]">
                    Monolithic pickers ship everything. DateForge ships only what
                    you use — start minimal, scale infinitely.
                  </p>
                </Reveal>
                <Reveal delay={0.24} className="w-full max-w-md">
                  <InstallSnippet />
                </Reveal>
                {/* short viewports keep the terminal, drop the editor card */}
                <Reveal
                  delay={0.3}
                  className="w-full max-w-md [@media(max-height:820px)]:hidden"
                >
                  <HeroCode />
                </Reveal>
                <Reveal
                  delay={0.36}
                  className="grid w-full max-w-md grid-cols-2 gap-2"
                >
                  <BranchLink
                    href={STORYBOOK_URL}
                    title="Storybook"
                    text="Interactive playground"
                    external
                    variant="primary"
                    className="col-span-2"
                  />
                  <BranchLink href="/docs" title="Docs" text="Complete API" />
                  <BranchLink
                    href="/examples"
                    title="Examples"
                    text="Polished recipes"
                    variant="secondary"
                  />
                </Reveal>
                <Reveal delay={0.42}>
                  <Link
                    href="/changelog"
                    className="text-xs font-medium text-zinc-400 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-zinc-700"
                  >
                    v{DATEFORGE_VERSION} changelog →
                  </Link>
                </Reveal>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* screen 2 — mobile only */}
      <div className="flex h-[100dvh] w-full snap-start flex-col items-center justify-center gap-6 px-5 text-center lg:hidden">
        <Reveal inView delay={0.02}>
          <span className="text-sm font-medium tracking-tight text-zinc-500">
            Monolithic pickers ship everything. DateForge ships only what you use.
          </span>
        </Reveal>
        <Reveal inView delay={0.1} className="w-full max-w-md">
          <InstallSnippet />
        </Reveal>
        <Reveal inView delay={0.18}>
          <p className="max-w-xs text-sm leading-6 text-zinc-600">
            Start minimal. Scale infinitely. Add only the modules you need.
          </p>
        </Reveal>
        <Reveal inView delay={0.26} className="flex w-full flex-col gap-2">
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
  className = "",
}: {
  href: string;
  title: string;
  text: string;
  external?: boolean;
  variant?: BranchVariant;
  className?: string;
}) {
  const v = BRANCH_VARIANTS[variant];
  return (
    <Button
      asChild
      variant="outline"
      className={`group h-10 flex-1 justify-center gap-4 rounded-full px-4 text-left shadow-sm transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97] active:duration-100 lg:h-16 lg:justify-between lg:px-6 lg:py-3 ${v.link} ${className}`}
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
          className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 ${v.arrow}`}
        />
      </Link>
    </Button>
  );
}
