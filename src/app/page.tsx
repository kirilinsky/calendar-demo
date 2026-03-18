"use client";

import { usePageStateStore } from "@/stores/page-state.store";
import Sidebar from "@/components/sidebar/sidebar";
import { Calendar } from "react-calendar-datetime";
import { useCalendarStateStore } from "@/stores/calendar-state.store";
import { Sun, Moon, Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function Home() {
  const { darkMode, setDarkMode } = usePageStateStore();
  const { setProp, ...calendarProps } = useCalendarStateStore();

  const formattedDate = calendarProps.date?.toLocaleDateString(
    calendarProps.locale || "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <main
      className={cn(
        "flex h-screen w-full overflow-hidden transition-colors duration-500",
        darkMode ? "bg-zinc-950" : "bg-zinc-50",
      )}
    >
      <section
        className={cn(
          "relative flex flex-[0.7] flex-col items-center justify-center border-r transition-colors duration-500",
          darkMode
            ? "border-zinc-800 bg-zinc-900/20"
            : "border-zinc-200 bg-zinc-50/50",
        )}
      >
        <div
          className={cn(
            "absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all shadow-sm",
            darkMode
              ? "bg-zinc-900/40 border-zinc-700/50"
              : "bg-white/40 border-zinc-200/50",
          )}
        >
          <Sun
            size={14}
            className={!darkMode ? "text-amber-500" : "text-zinc-500"}
          />
          <Switch
            checked={darkMode}
            onCheckedChange={(val) => setDarkMode(val)}
            className="scale-75"
          />
          <Moon
            size={14}
            className={darkMode ? "text-indigo-400" : "text-zinc-400"}
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 z-0 opacity-30 transition-opacity",
            darkMode
              ? "[background-image:radial-gradient(#333_1px,transparent_1px)]"
              : "[background-image:radial-gradient(#e5e7eb_1px,transparent_1px)]",
            "[background-size:24px_24px]",
          )}
        />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div
            className="no-scroll"
            style={{ width: "600px", transition: "all .3s ease-in-out" }}
          >
            <Calendar
              {...calendarProps}
              onChangeDate={(d) => setProp("date", d)}
            />
          </div>

          <div
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 translate-y-4",
              darkMode
                ? "bg-zinc-900/80 border-zinc-800 text-zinc-100 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                : "bg-white border-zinc-100 text-zinc-900 shadow-[0_10px_40px_rgba(0,0,0,0.03)]",
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg",
                darkMode ? "bg-zinc-800" : "bg-zinc-100",
              )}
            >
              <CalendarIcon
                size={16}
                className={darkMode ? "text-zinc-400" : "text-zinc-500"}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                Selected Date
              </span>
              <span className="text-sm font-medium font-mono">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </section>
      <Sidebar />
    </main>
  );
}
