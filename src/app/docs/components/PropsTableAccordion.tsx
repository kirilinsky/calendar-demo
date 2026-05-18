"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function PropsTableAccordion({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="mb-5 gap-0 border-[var(--border)] bg-[var(--doc-bg-secondary)] py-0 ring-0 shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-[var(--nav-active)]"
      >
        <span className="min-w-0">
          <span className="block text-base font-semibold tracking-tight text-[var(--text-primary)]">
            {title}
          </span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            {open ? "Hide props" : "Show props"}
          </span>
        </span>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--doc-bg)] text-[var(--text-muted)] transition hover:border-[var(--nav-active-border)] hover:text-[var(--text-primary)] ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={15} />
        </span>
      </button>

      {open && (
        <div className="border-t border-[var(--border)] px-4 pb-0 [&>div]:mb-0 [&>div]:rounded-none [&>div]:border-0 [&>div]:bg-transparent [&>div]:shadow-none">
          {children}
        </div>
      )}
    </Card>
  );
}
