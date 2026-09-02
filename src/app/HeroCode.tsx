const K = "text-violet-500";      // keywords
const N = "text-zinc-800";        // identifiers
const S = "text-emerald-600";     // strings
const C = "text-sky-600";         // components
const P = "text-zinc-400";        // punctuation

/** The shortest working DateForge snippet — one prebuilt, no composition. */
export function HeroCode({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-zinc-200/80 px-3 py-1.5">
        <span aria-hidden className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
        </span>
        <span className="font-mono text-[10px] leading-none text-zinc-400">
          Booking.tsx
        </span>
      </div>

      <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[11px] leading-5 lg:text-[12px] lg:leading-[1.55rem]">
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
