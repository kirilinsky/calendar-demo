"use client";

import { usePageStateStore } from "@/stores/page-state.store";
import Sidebar from "@/components/sidebar/sidebar";
import { Calendar } from "react-calendar-datetime";
import { useCalendarStateStore } from "@/stores/calendar-state.store";
import { Sun, Moon, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";
import { SiNpm } from "react-icons/si";

function CalendarPageContent() {
  const searchParams = useSearchParams();
  const { setActiveStep, lightMode, setLightMode } = usePageStateStore();
  const { setProp, ...calendarProps } = useCalendarStateStore();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam !== null) {
      const step = Number(stepParam);
      if (!isNaN(step) && step >= 0 && step <= 5) {
        setActiveStep(step);
      }
    }
  }, [searchParams, setActiveStep]);

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const effectiveWidth = isMobile
    ? Math.min(Number(calendarProps.width) || 480, viewportWidth - 32)
    : calendarProps.width;

  const mode = calendarProps.mode || "single";
  const locale = calendarProps.locale || "en-US";

  const formatDate = (d: Date) =>
    d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

  let selectedLabel = "";
  let selectedValue = "";

  if (mode === "single") {
    const d = calendarProps.value instanceof Date ? calendarProps.value : null;
    selectedLabel = "Selected Date";
    selectedValue = d ? formatDate(d) : "";
  } else if (mode === "multiple") {
    const dates = Array.isArray(calendarProps.value) ? (calendarProps.value as Date[]) : [];
    selectedLabel = "Selected Dates";
    selectedValue = dates.length
      ? dates.length === 1
        ? formatDate(dates[0])
        : `${dates.length} dates`
      : "";
  } else if (mode === "range") {
    const range = calendarProps.value as { from: Date | null; to: Date | null } | null;
    selectedLabel = "Date Range";
    if (range?.from && range?.to) {
      selectedValue = `${formatDate(range.from)} — ${formatDate(range.to)}`;
    } else if (range?.from) {
      selectedValue = `${formatDate(range.from)} — …`;
    } else {
      selectedValue = "";
    }
  }

  return (
    <main
      className={cn(
        "flex min-h-screen w-full   transition-colors duration-500",
        lightMode ? "bg-zinc-950" : "bg-zinc-50",
      )}
    >
      <section
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center transition-colors duration-500",
          lightMode
            ? "border-zinc-800 bg-zinc-900/20"
            : "border-zinc-200 bg-zinc-50/50",
        )}
      >
        <div
          className={cn(
            "absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all shadow-sm",
            lightMode
              ? "bg-zinc-900/40 border-zinc-700/50"
              : "bg-white/40 border-zinc-200/50",
          )}
        >
          <Sun
            size={14}
            className={!lightMode ? "text-amber-500" : "text-zinc-500"}
          />
          <Switch
            checked={lightMode}
            onCheckedChange={setLightMode}
            className="scale-75"
          />
          <Moon
            size={14}
            className={lightMode ? "text-indigo-400" : "text-zinc-400"}
          />

          <a
            href="https://github.com/kirilinsky/react-calendar-datetime"
            target="_blank"
          >
            <FaGithub
              className={lightMode ? "text-zinc-400" : "text-white-400"}
            />
          </a>
          <a
            href="https://www.npmjs.com/package/react-calendar-datetime"
            target="_blank"
          >
            <SiNpm className={"text-red-400"} />
          </a>
          <a
            href="/doc"
            className={cn(
              "text-[10px] font-mono uppercase tracking-wider transition-opacity hover:opacity-70",
              lightMode ? "text-zinc-400" : "text-zinc-500",
            )}
          >
            docs
          </a>

        </div>

        {selectedValue && (
          <div
            className={cn(
              "absolute top-4 right-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all shadow-sm",
              lightMode
                ? "bg-zinc-900/40 border-zinc-700/50"
                : "bg-white/40 border-zinc-200/50",
            )}
          >
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider font-semibold",
                lightMode ? "text-zinc-500" : "text-zinc-400",
              )}
            >
              {selectedLabel}
            </span>
            <span
              className={cn(
                "font-mono text-[11px]",
                lightMode ? "text-zinc-200" : "text-zinc-700",
              )}
            >
              {selectedValue}
            </span>
          </div>
        )}

        <button
          onClick={() => setShowSidebar(true)}
          className={cn(
            "absolute top-4 right-4 z-20 md:hidden p-2 rounded-full border backdrop-blur-md transition-all",
            !lightMode
              ? "bg-white/40 border-zinc-200/50 text-zinc-700"
              : "bg-zinc-900/40 border-zinc-700/50 text-zinc-300",
          )}
        >
          <SlidersHorizontal size={16} />
        </button>

        <div
          className={cn(
            "absolute inset-0 z-0 opacity-30",
            lightMode
              ? "[background-image:radial-gradient(#333_1px,transparent_1px)]"
              : "[background-image:radial-gradient(#e5e7eb_1px,transparent_1px)]",
            "[background-size:24px_24px]",
          )}
        />

        <div className="relative z-10 flex flex-col items-center px-4 w-full overflow-x-hidden">
          <Calendar
            {...calendarProps}
            width={effectiveWidth}
            onChange={(d) => setProp("value", d as Date)}
            onDatesChange={(dates) => setProp("value", dates as any)}
            onRangeChange={(range) => setProp("value", range as any)}
          />
        </div>
      </section>

      <div className="hidden md:flex h-full w-[24%] border-l border-zinc-200 shrink-0">
        <Sidebar />
      </div>

      {showSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSidebar(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-0 h-full w-4/5 max-w-sm overflow-y-auto shadow-xl",
              lightMode ? "bg-zinc-900" : "bg-white",
            )}
          >
            <Sidebar />
          </div>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-zinc-50" />}>
      <CalendarPageContent />
    </Suspense>
  );
}
