"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const label = lang || "text";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-[var(--code-text)] shadow-sm">
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-white/[0.03] px-3">
        <Badge
          variant="outline"
          className="border-transparent bg-transparent font-mono text-[11px] uppercase tracking-widest text-zinc-500"
        >
          {label}
        </Badge>
        <Button
          type="button"
          onClick={copyCode}
          aria-label="Copy code"
          variant="ghost"
          size="xs"
          className="border border-white/10 bg-white/[0.06] font-mono text-[11px] font-medium text-zinc-300 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "copied" : "copy"}</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={normalizeCodeLang(lang)}
        style={oneDark}
        PreTag="div"
        customStyle={{
          margin: 0,
          minWidth: "max-content",
          overflowX: "auto",
          padding: "1rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: 1.7,
        }}
        codeTagProps={{
          style: {
            fontFamily:
              "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function normalizeCodeLang(lang: string) {
  const normalized = lang.toLowerCase();

  if (normalized === "sh" || normalized === "shell" || normalized === "zsh") {
    return "bash";
  }

  if (normalized === "ts") return "typescript";
  if (normalized === "js") return "javascript";

  return normalized || "text";
}
