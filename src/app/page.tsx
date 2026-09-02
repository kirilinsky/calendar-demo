import Link from "next/link";
import { InstallSnippet } from "./InstallSnippet";
import { HeroCode } from "./HeroCode";
import { SiteHeader } from "./SiteHeader";
import { CalendarPreview } from "./CalendarPreview";
import { RandomizeButton } from "./RandomizeButton";
import { Reveal } from "./Reveal";
import { VersionBadge } from "./VersionBadge";
import { COMPOSED_COUNT } from "./examples/examples-data";
import dateForgePackage from "../../node_modules/@dateforge/react-calendar/package.json";

const STORYBOOK_URL = "https://kirilinsky.github.io/dateforge-react-calendar/";
const CODECOV_BADGE =
  "https://codecov.io/gh/kirilinsky/dateforge-react-calendar/branch/main/graph/badge.svg";
const DATEFORGE_VERSION = dateForgePackage.version;

/**
 * Mondrian-influenced hero: white ground, black orthogonal rules instead of
 * soft cards, and three blocks carrying the primaries. Poster values, not the
 * literal painting — #d0021b / #0b3d91 / #f6c700 hold up next to the emerald
 * the brand keeps on the install snippet and the version dot.
 */

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
    <main className="h-[100dvh] snap-y snap-mandatory overflow-y-auto bg-white text-zinc-950 lg:overflow-hidden lg:snap-none">
      {/* screen 1 */}
      <div className="relative flex h-[100dvh] w-full snap-start flex-col">
        <Link
          href="/changelog"
          className="absolute bottom-3 left-4 z-10 font-mono text-[10px] leading-none text-zinc-300/65 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-zinc-500 sm:bottom-4 sm:left-5"
        >
          @dateforge/react-calendar v{DATEFORGE_VERSION}
        </Link>

        <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-5 py-3 sm:px-8 sm:py-4">
          <SiteHeader coverage={coverage} />
          <section className="flex flex-1 flex-col py-1 text-center lg:gap-4 lg:py-3">
            <Reveal delay={0.02}>
              <VersionBadge version={DATEFORGE_VERSION} />
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-1 mb-1 text-xl leading-tight font-semibold tracking-tight text-zinc-950 sm:mt-1.5 sm:mb-1.5 sm:text-3xl lg:mt-0 lg:mb-0 lg:text-[2.6rem] lg:whitespace-nowrap xl:text-5xl">
                Build exactly the calendar your product needs.
              </h1>
            </Reveal>

            <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-0">
              {/* calendar */}
              <div className="order-1 flex flex-1 flex-col items-center justify-center gap-3 lg:order-2 lg:flex-none lg:items-end">
                <div className="flex w-full max-w-[327px] flex-col gap-2 sm:max-w-[358px] sm:gap-3 lg:max-w-[370px]">
                  <Reveal
                    delay={0.18}
                    y={22}
                    scale
                    className="border-[3px] border-zinc-950 bg-white p-2"
                  >
                    <CalendarPreview
                      simple
                      width="100%"
                      navLinks={[]}
                      reserveHeight="min(440px, 58dvh)"
                      reserveTallestAppearance
                    />
                  </Reveal>
                  <Reveal delay={0.32}>
                    <CalendarControls />
                  </Reveal>
                </div>
              </div>

              {/* content — desktop only in screen 1 */}
              <div className="order-2 hidden lg:order-1 lg:mt-0 lg:flex lg:flex-col lg:items-start lg:gap-3 lg:pr-12 lg:text-left">
                <Reveal delay={0.12} className="[@media(max-height:700px)]:hidden">
                  <span className="inline-flex items-center gap-2 border-2 border-zinc-950 bg-[#f6c700] px-3 py-1.5 text-[11px] font-semibold leading-none text-zinc-950">
                    <span aria-hidden className="h-1.5 w-1.5 bg-zinc-950" />
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
                  <InstallSnippet flat />
                </Reveal>
                {/* short viewports keep the terminal, drop the editor card */}
                <Reveal
                  delay={0.3}
                  className="w-full max-w-md [@media(max-height:820px)]:hidden"
                >
                  <HeroCode flat />
                </Reveal>
                <Reveal delay={0.36} className="w-full max-w-md">
                  <ForkBlock />
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
          <InstallSnippet flat />
        </Reveal>
        <Reveal inView delay={0.18}>
          <p className="max-w-xs text-sm leading-6 text-zinc-600">
            Start minimal. Scale infinitely. Add only the modules you need.
          </p>
        </Reveal>
        <Reveal inView delay={0.26} className="w-full max-w-md">
          <ForkBlock />
        </Reveal>
      </div>
    </main>
  );
}

/** Surprise Me + Themes in one ruled bar — both act on the calendar above. */
function CalendarControls() {
  return (
    <div className="flex items-stretch divide-x-2 divide-zinc-950 border-2 border-zinc-950 bg-white">
      <RandomizeButton className="flex-1" />
      <Link
        href="/themes"
        className="flex flex-1 items-center justify-center px-3 text-center text-[13px] font-medium whitespace-nowrap text-zinc-950 sm:text-sm transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#f6c700]"
      >
        Themes &amp; Looks
      </Link>
    </div>
  );
}

/**
 * The fork. Two ways in, and the pitch is which one you are: take a prebuilt
 * and be done, or compose from the modules and use the recipes. Docs and the
 * sandbox sit under both because they serve either branch.
 */
function ForkBlock() {
  return (
    <div className="border-[3px] border-zinc-950 bg-white">
      <div className="grid grid-cols-2 divide-x-2 divide-zinc-950">
        <ForkCell
          href="/examples#prebuilt"
          eyebrow="Need it now"
          title="Prebuilt"
          text="One import. Done."
          variant="red"
        />
        <ForkCell
          href="/examples#composed"
          eyebrow="Need more"
          title="Compose"
          text={`${COMPOSED_COUNT} finished recipes.`}
          variant="blue"
        />
      </div>
      <div className="grid grid-cols-2 divide-x-2 divide-zinc-950 border-t-2 border-zinc-950">
        <ForkFootLink href="/docs" label="Docs" text="Complete API" />
        <ForkFootLink
          href={STORYBOOK_URL}
          label="Storybook"
          text="Open sandbox"
          external
        />
      </div>
    </div>
  );
}

type CellVariant = "red" | "blue";

const CELL_VARIANTS: Record<
  CellVariant,
  { cell: string; eyebrow: string; title: string; sub: string }
> = {
  red: {
    cell: "bg-[#d0021b] hover:bg-[#b00117] focus-visible:ring-white/70",
    eyebrow: "text-white/70",
    title: "font-bold text-white",
    sub: "text-white/85",
  },
  blue: {
    cell: "bg-[#0b3d91] hover:bg-[#092f70] focus-visible:ring-white/70",
    eyebrow: "text-white/70",
    title: "font-bold text-white",
    sub: "text-white/85",
  },
};

function ForkCell({
  href,
  eyebrow,
  title,
  text,
  variant,
}: {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  variant: CellVariant;
}) {
  const v = CELL_VARIANTS[variant];
  return (
    <Link
      href={href}
      className={`group flex h-[4.5rem] flex-col justify-center gap-0.5 px-4 text-left transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none focus-visible:ring-2 focus-visible:ring-inset lg:h-20 lg:px-5 ${v.cell}`}
    >
      <span
        className={`text-[10px] font-semibold tracking-wide uppercase ${v.eyebrow}`}
      >
        {eyebrow}
      </span>
      <span className={`truncate text-sm ${v.title}`}>{title}</span>
      <span className={`truncate text-xs ${v.sub}`}>{text}</span>
    </Link>
  );
}

function ForkFootLink({
  href,
  label,
  text,
  external = false,
}: {
  href: string;
  label: string;
  text: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex h-11 items-center gap-1.5 px-4 text-left transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none hover:bg-[#f6c700] focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-inset lg:px-5"
    >
      <span className="truncate text-xs font-semibold text-zinc-950">
        {label}
      </span>
      <span className="truncate text-xs text-zinc-500">{text}</span>
    </Link>
  );
}
