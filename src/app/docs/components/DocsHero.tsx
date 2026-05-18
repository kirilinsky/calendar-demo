"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const INSTALL_COMMAND = "npm i @dateforge/react-calendar";

export function DocsHero() {
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge className="border-emerald-200 bg-emerald-50 font-mono text-[11px] uppercase tracking-widest text-emerald-700">
          React calendar
        </Badge>
        <Badge
          variant="outline"
          className="border-[var(--border)] bg-[var(--doc-bg-secondary)] font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]"
        >
          Modular · Composable · Tokenized
        </Badge>
      </div>

      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
        Build exactly the calendar your product needs.
      </h1>

      <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
        DateForge gives you a stateful calendar shell and a set of small
        modules: days, navigation, tracks, time, presets, selected chips, and
        custom context hooks. Start with one picker, then grow into the
        composition your workflow needs.
      </p>

      <div className="mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] px-3 py-2 text-[var(--code-text)] shadow-sm">
        <span className="select-none font-mono text-xs text-zinc-500">$</span>
        <code className="min-w-0 flex-1 truncate font-mono text-sm">
          {INSTALL_COMMAND}
        </code>
        <Button
          type="button"
          onClick={copyInstall}
          aria-label="Copy install command"
          variant="ghost"
          size="sm"
          className="border border-white/10 bg-white/[0.06] font-mono text-xs font-medium text-zinc-300 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "copied" : "copy"}</span>
        </Button>
      </div>
    </section>
  );
}
