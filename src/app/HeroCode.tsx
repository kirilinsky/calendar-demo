const K = "text-violet-500";      // keywords
const N = "text-zinc-800";        // identifiers
const S = "text-emerald-600";     // strings
const C = "text-sky-600";         // components
const P = "text-zinc-400";        // punctuation

/** The shortest working DateForge snippet — one prebuilt, no composition. */
export function HeroCode({
  className = "",
  flat = false,
}: {
  className?: string;
  /** Square, black-ruled shell for the Mondrian hero. */
  flat?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden bg-white ${
        flat
          ? "border-2 border-zinc-950"
          : "rounded-2xl border border-zinc-200 shadow-sm backdrop-blur-sm"
      } ${className}`}
    >
      <div className="flex items-center gap-2 border-b-2 border-zinc-950 px-3 py-1.5">
        <span aria-hidden className="flex gap-1">
          <span className="h-2 w-2 bg-[#d0021b]" />
          <span className="h-2 w-2 bg-[#0b3d91]" />
          <span className="h-2 w-2 bg-[#f6c700]" />
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
