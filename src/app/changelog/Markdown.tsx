import { Fragment, type ReactNode } from "react";

/** `**bold**`, `` `code` `` and `[text](url)` — the only inline markdown changesets emits. */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function Inline({ text }: { text: string }) {
  const nodes: ReactNode[] = [];

  text.split(INLINE).forEach((chunk, index) => {
    if (!chunk) return;
    const key = `${index}-${chunk.slice(0, 8)}`;

    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-zinc-900">
          <Inline text={chunk.slice(2, -2)} />
        </strong>,
      );
      return;
    }
    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[12px] text-zinc-800"
        >
          {chunk.slice(1, -1)}
        </code>,
      );
      return;
    }
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      nodes.push(
        <a
          key={key}
          href={link[2]}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-700 underline decoration-emerald-200 underline-offset-4 transition hover:decoration-emerald-500"
        >
          {link[1]}
        </a>,
      );
      return;
    }
    nodes.push(<Fragment key={key}>{chunk}</Fragment>);
  });

  return <>{nodes}</>;
}
