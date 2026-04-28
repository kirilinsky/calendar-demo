import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Github, Package } from "lucide-react";
import { HomeCalendarPreview } from "./HomeCalendarPreview";

const STORYBOOK_URL = "https://kirilinsky.github.io/dateforge-react-calendar/";
const GITHUB_URL = "https://github.com/kirilinsky/dateforge-react-calendar";
const NPM_URL = "https://www.npmjs.com/package/@dateforge/react-calendar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfbfd] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
        <header className="flex h-12 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-base font-semibold tracking-tight"
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
            DateForge
          </Link>
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
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-6 text-center sm:py-8">
          <div className="mb-7 w-full max-w-[340px] sm:mb-8 lg:max-w-[320px]">
            <HomeCalendarPreview />
          </div>

          <p className="mb-3 text-sm font-medium text-zinc-500">
            Composable calendar for React interfaces.
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            A calendar that feels made for your product.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
            DateForge is assembled from small modules: navigation, days,
            presets, tracks, time, themes, and appearance. Start simple, then
            shape the interaction.
          </p>

          <div className="mt-6 flex w-full max-w-2xl flex-col items-stretch justify-center gap-2 sm:flex-row">
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
