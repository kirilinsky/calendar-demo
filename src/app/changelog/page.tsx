import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GitCommitHorizontal, GitPullRequest } from "lucide-react";
import { SiteHeader } from "@/app/SiteHeader";
import { Reveal } from "@/app/Reveal";
import { ScrollToTop } from "@/app/ScrollToTop";
import { Inline } from "./Markdown";
import {
  CHANGELOG_FILE_URL,
  RELEASES_URL,
  getChangelog,
  type Entry,
  type ReleaseKind,
  type Version,
} from "./changelog-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Changelog — DateForge",
  description:
    "Every released version of @dateforge/react-calendar, straight from the repository changelog.",
  openGraph: {
    title: "DateForge React Calendar Changelog",
    description:
      "Every released version of @dateforge/react-calendar, straight from the repository changelog.",
  },
  twitter: {
    title: "DateForge React Calendar Changelog",
    description:
      "Every released version of @dateforge/react-calendar, straight from the repository changelog.",
  },
};

const KIND_BADGE: Record<ReleaseKind, string> = {
  major: "border-rose-200 bg-rose-50 text-rose-700",
  minor: "border-emerald-200 bg-emerald-50 text-emerald-700",
  patch: "border-sky-200 bg-sky-50 text-sky-700",
  other: "border-zinc-200 bg-zinc-50 text-zinc-600",
};

const KIND_LABEL: Record<ReleaseKind, string> = {
  major: "Major",
  minor: "Minor",
  patch: "Patch",
  other: "Release",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function KindBadge({ kind }: { kind: ReleaseKind }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none tracking-tight ${KIND_BADGE[kind]}`}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <li className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm sm:p-5">
      <p className="text-[15px] font-medium leading-6 text-zinc-900">
        <Inline text={entry.title} />
      </p>

      {entry.body.length > 0 && (
        <div className="mt-3 space-y-2">
          {entry.body.map((block, index) =>
            block.type === "p" ? (
              <p
                key={index}
                className="text-[14px] leading-6 text-zinc-600"
              >
                <Inline text={block.text} />
              </p>
            ) : (
              <div
                key={index}
                className={`flex gap-2 text-[14px] leading-6 text-zinc-600 ${
                  block.depth > 0 ? "pl-4" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-emerald-400"
                />
                <span>
                  <Inline text={block.text} />
                </span>
              </div>
            ),
          )}
        </div>
      )}

      {(entry.prUrl || entry.commitUrl) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {entry.prUrl && (
            <a
              href={entry.prUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[11px] leading-none text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
            >
              <GitPullRequest size={11} />#{entry.pr}
            </a>
          )}
          {entry.commitUrl && (
            <a
              href={entry.commitUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[11px] leading-none text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
            >
              <GitCommitHorizontal size={11} />
              {entry.commit}
            </a>
          )}
        </div>
      )}
    </li>
  );
}

function VersionBlock({ version, index }: { version: Version; index: number }) {
  const date = formatDate(version.date);

  return (
    <Reveal inView delay={Math.min(index, 4) * 0.04} y={16}>
      <section id={version.id} className="scroll-mt-24 border-t border-zinc-200 pt-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            v{version.version}
          </h2>
          <KindBadge kind={version.kind} />
          {date && <span className="text-xs text-zinc-500">{date}</span>}
        </div>

        {version.sections.map((section) => (
          <div key={section.heading} className="mt-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              {section.heading}
            </h3>
            <ul className="space-y-3">
              {section.entries.map((entry, entryIndex) => (
                <EntryCard key={entry.pr ?? entryIndex} entry={entry} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Reveal>
  );
}

function VersionNav({ versions }: { versions: Version[] }) {
  return (
    <nav
      aria-label="Versions"
      className="hidden lg:block lg:sticky lg:top-8 lg:h-fit lg:w-44 lg:shrink-0"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        Versions
      </p>
      <ul className="max-h-[70dvh] space-y-1 overflow-y-auto pr-1">
        {versions.map((version) => (
          <li key={version.id}>
            <a
              href={`#${version.id}`}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition hover:bg-white hover:text-zinc-950"
            >
              <span className="font-medium">v{version.version}</span>
              <KindBadge kind={version.kind} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function ChangelogPage() {
  const versions = await getChangelog();

  return (
    <main className="min-h-[100dvh] bg-[#fbfbfd] text-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-5 py-4 sm:px-8">
        <SiteHeader />

        <Reveal delay={0.04}>
          <header className="py-10 sm:py-14">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Changelog
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-zinc-600">
              Every released version of{" "}
              <code className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[12px] text-zinc-800">
                @dateforge/react-calendar
              </code>
              , generated from the repository changelog.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <a
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-emerald-700 transition hover:text-emerald-900"
              >
                GitHub releases <ArrowUpRight size={14} />
              </a>
              <a
                href={CHANGELOG_FILE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-zinc-500 transition hover:text-zinc-900"
              >
                CHANGELOG.md <ArrowUpRight size={14} />
              </a>
              <Link
                href="/docs"
                className="font-medium text-zinc-500 transition hover:text-zinc-900"
              >
                Docs
              </Link>
            </div>
          </header>
        </Reveal>

        {versions.length === 0 ? (
          <p className="rounded-2xl border border-zinc-200 bg-white/70 p-6 text-sm text-zinc-600">
            The changelog could not be loaded right now. Read it on{" "}
            <a
              href={CHANGELOG_FILE_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-700 underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        ) : (
          <div className="flex gap-10 pb-24">
            <VersionNav versions={versions} />
            <div className="min-w-0 flex-1 space-y-10">
              {versions.map((version, index) => (
                <VersionBlock key={version.id} version={version} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
      <ScrollToTop />
    </main>
  );
}
