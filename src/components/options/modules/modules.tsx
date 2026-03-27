"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { ArrowDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarProps } from "react-calendar-datetime";
import { useCalendarStateStore } from "@/stores/calendar-state.store";

export const ModulesOptions = () => {
  const { setProp, ...state } = useCalendarStateStore();

  const modules: { id: keyof CalendarProps; label: string }[] = [
    { id: "years", label: "Years" },
    { id: "months", label: "Months" }, 
    { id: "time", label: "Time" },
    { id: "presets", label: "Presets" },
    { id: "monthsGrid", label: "Months Grid" },
    { id: "compactMonths", label: "Compact Months" },
    { id: "compactYears", label: "Compact Years" },
  ];

  return (
    <Wrapper description="Combine any modules to customize your calendar's functionality.">
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {modules.map((mod) => {
            const isChecked = !!state[mod.id];

            return (
              <div
                key={mod.id}
                className="flex items-center justify-between group min-w-0"
              >
                <Label
                  htmlFor={mod.id}
                  className="text-[12px] transition-colors cursor-pointer truncate mr-2 text-zinc-600 group-hover:text-zinc-900"
                >
                  {mod.label}
                </Label>
                <div className="flex items-center shrink-0">
                  <Switch
                    id={mod.id}
                    checked={isChecked}
                    onCheckedChange={(val) => setProp(mod.id, val)}
                    className="scale-75 origin-right"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 pt-4 border-t border-zinc-100 transition-colors">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
            Next Step
          </span>
          <div className="opacity-50 animate-bounce text-zinc-400">
            <ArrowDown size={14} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
