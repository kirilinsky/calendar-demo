import Link from "next/link";
import Image from "next/image";
import {
  Accessibility,
  BookOpen,
  GithubIcon,
  Package,
  ServerCog,
  ShieldCheck,
} from "lucide-react";

const STORYBOOK_URL = "https://kirilinsky.github.io/dateforge-react-calendar/";
const GITHUB_URL = "https://github.com/kirilinsky/dateforge-react-calendar";
const NPM_URL = "https://www.npmjs.com/package/@dateforge/react-calendar";
const CODECOV_URL =
  "https://app.codecov.io/gh/kirilinsky/dateforge-react-calendar";
const SSR_URL =
  "https://github.com/kirilinsky/dateforge-react-calendar/actions/workflows/ssr.yml";
const A11Y_URL =
  "https://github.com/kirilinsky/dateforge-react-calendar/actions/workflows/a11y.yml";

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
  return <span className={className}>{icon}{label}</span>;
}

export function SiteHeader({ coverage }: { coverage?: string | null }) {
  const coverageLabel = coverage ? `${coverage} Test coverage` : "Test coverage";

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
              <GithubIcon size={18} />
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
    </>
  );
}
