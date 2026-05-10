"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

const COMMAND = "npm i @dateforge/react-calendar";

export function InstallSnippet({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-zinc-200 bg-[#101012] px-3 py-2 text-left shadow-sm ${className}`}
    >
      <span className="select-none font-mono text-xs text-zinc-500">$</span>
      <code className="flex-1 truncate font-mono text-xs text-zinc-100 sm:text-sm">
        {COMMAND}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        className="flex h-7 items-center gap-1.5 rounded-md bg-white/10 px-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/20"
      >
        {copied ? <Check size={13} /> : <Clipboard size={13} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
