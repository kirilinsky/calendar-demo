import Link from "next/link";
import Image from "next/image";
import {
  Accessibility,
  GithubIcon,
  Package,
  ServerCog,
  ShieldCheck,
} from "lucide-react";

const GITHUB_URL = "https://github.com/kirilinsky/dateforge-react-calendar";
const NPM_URL = "https://www.npmjs.com/package/@dateforge/react-calendar";
const CODECOV_URL =
  "https://app.codecov.io/gh/kirilinsky/dateforge-react-calendar";
const SSR_URL =
  "https://github.com/kirilinsky/dateforge-react-calendar/actions/workflows/ssr.yml";
const A11Y_URL =
  "https://github.com/kirilinsky/dateforge-react-calendar/actions/workflows/a11y.yml";

type BadgeTone = "emerald" | "violet" | "sky" | "amber" | "zinc" | "rose" | "red";

const TONE_CLASSES: Record<BadgeTone, string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  zinc: "border-zinc-200 bg-zinc-50 text-zinc-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  red: "border-red-200 bg-red-50 text-red-700",
};

function QualityBadge({
  icon,
  label,
  tone,
  href,
  ariaLabel,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  tone: BadgeTone;
  href?: string;
  ariaLabel?: string;
}) {
  const className = `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium leading-none tracking-tight shadow-sm transition ${TONE_CLASSES[tone]}`;
  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        className={`${className} hover:brightness-95`}
      >
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <span className={className} aria-label={ariaLabel}>
      {icon}
      {label}
    </span>
  );
}

export function SiteHeader({ coverage }: { coverage?: string | null }) {
  const coverageLabel = coverage ? `${coverage} cov` : "Coverage";

  return (
    <>
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
              The modular calendar for React{" "}
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <QualityBadge
              icon={<ServerCog size={11} />}
              label="SSR Safe"
              tone="emerald"
              href={SSR_URL}
            />
            <QualityBadge
              icon={<Accessibility size={11} />}
              label="A11Y"
              tone="violet"
              href={A11Y_URL}
            />
            <QualityBadge
              icon={<ShieldCheck size={11} />}
              label={coverageLabel}
              tone="sky"
              href={CODECOV_URL}
            />
          </div>
          <nav className="flex items-center gap-2">
            <QualityBadge
              icon={<GithubIcon size={11} />}
              label={<span className="hidden sm:inline">GitHub</span>}
              tone="zinc"
              href={GITHUB_URL}
              ariaLabel="DateForge on GitHub"
            />
            <QualityBadge
              icon={<Package size={11} />}
              label={<span className="hidden sm:inline">npm</span>}
              tone="red"
              href={NPM_URL}
              ariaLabel="DateForge on npm"
            />
          </nav>
        </div>
      </header>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 lg:hidden">
        <QualityBadge
          icon={<ServerCog size={11} />}
          label="SSR safe"
          tone="emerald"
          href={SSR_URL}
        />
        <QualityBadge
          icon={<Accessibility size={11} />}
          label="axe a11y"
          tone="violet"
          href={A11Y_URL}
        />
        <QualityBadge
          icon={<ShieldCheck size={11} />}
          label={coverageLabel}
          tone="sky"
          href={CODECOV_URL}
        />
      </div>
    </>
  );
}
