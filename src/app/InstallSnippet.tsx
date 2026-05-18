"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <Button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        variant="ghost"
        size="icon-sm"
        className="text-zinc-100 hover:bg-white/10 hover:text-white"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </Button>
    </div>
  );
}
