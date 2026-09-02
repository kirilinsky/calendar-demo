const K = "text-violet-500";      // keywords
const N = "text-zinc-800";        // identifiers
const S = "text-emerald-600";     // strings
const C = "text-sky-600";         // components
const P = "text-zinc-400";        // punctuation

/**
 * The shortest working DateForge snippet — one prebuilt, no composition. No
 * window chrome: the point is the two lines, and a filename tab only invited
 * the reader to wonder what file this is.
 */
export function HeroCode({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur-sm ${className}`}
    >
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-[1.5rem] lg:text-[13px] lg:leading-[1.65rem]">
        <code>
          <span className={K}>import</span>
          <span className={P}>{" { "}</span>
          <span className={N}>SimpleCalendar</span>
          <span className={P}>{" } "}</span>
          <span className={K}>from</span>{" "}
          <span className={S}>&quot;@dateforge/react-calendar/prebuilt&quot;</span>
          <span className={P}>;</span>
          {"\n\n"}
          <span className={P}>&lt;</span>
          <span className={C}>SimpleCalendar</span>{" "}
          <span className={N}>theme</span>
          <span className={P}>=</span>
          <span className={S}>&quot;aurora&quot;</span>{" "}
          <span className={N}>onChange</span>
          <span className={P}>={"{"}</span>
          <span className={N}>setDate</span>
          <span className={P}>{"}"} /&gt;</span>
        </code>
      </pre>
    </div>
  );
}
