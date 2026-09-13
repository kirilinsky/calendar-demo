"use client";

import { Badge } from "@/components/ui/badge";
import { InstallSnippet } from "../../InstallSnippet";

export function DocsHero() {
  return (
    <section className="mb-12">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge className="border-[var(--nav-active-border)] bg-[var(--nav-active)] font-mono text-[11px] uppercase tracking-widest text-[var(--emerald)]">
          React calendar
        </Badge>
        <Badge
          variant="outline"
          className="border-[var(--border)] bg-[var(--doc-bg-secondary)] font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]"
        >
          Modular · Composable · Tokenized
        </Badge>
      </div>

      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] text-balance sm:text-5xl">
        Everything you need to compose a calendar.
      </h1>

      <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
        DateForge gives you a stateful calendar shell and a set of small
        modules: days, navigation, tracks, time, presets, selected chips, and
        custom context hooks. Start with one picker, then grow into the
        composition your workflow needs.
      </p>

      <InstallSnippet className="mt-6 max-w-xl" />
    </section>
  );
}
