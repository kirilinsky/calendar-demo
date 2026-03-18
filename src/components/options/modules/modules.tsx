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
    { id: "compactMonths", label: "Compact Months" },
    { id: "compactYears", label: "Compact Years" },
  ];

  return (
    <Wrapper
      title="Modules"
      description="Combine any modules to customize your calendar's functionality."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          {modules.map((mod) => {
            const isChecked = !!state[mod.id];

            return (
              <div
                key={mod.id}
                className="flex items-center justify-between group min-w-0"
              >
                <Label
                  htmlFor={mod.id}
                  className="text-[13px] text-zinc-600 group-hover:text-zinc-900 transition-colors cursor-pointer truncate mr-2"
                >
                  {mod.label}
                </Label>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    id={mod.id}
                    checked={isChecked}
                    onCheckedChange={(val) => setProp(mod.id, val)}
                    className="scale-90" 
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 pt-4 border-t border-zinc-100">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            Ready for more?
          </span>
          <div className="opacity-50 animate-bounce">
            <ArrowDown size={16} className="text-zinc-400" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
