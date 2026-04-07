"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CalendarProps } from "react-calendar-datetime";
import { useCalendarStateStore } from "@/stores/calendar-state.store";

export const ModulesOptions = () => {
  const { setProp, ...state } = useCalendarStateStore();

  const modules: { id: keyof CalendarProps; label: string }[] = [
    { id: "years", label: "Years" },
    { id: "months", label: "Months" },
    { id: "time", label: "Time" },
    { id: "timeGrid", label: "Time Grid" },
    { id: "presets", label: "Presets" },
    { id: "monthsGrid", label: "Months Grid" },
    { id: "compactMonths", label: "Compact Months" },
    { id: "compactYears", label: "Compact Years" },
    { id: "twoMonthsLayout", label: "Two Months Layout" },
    { id: "monthsColumn", label: "Months Column" },
    { id: "showSelectedDates", label: "Show Selected Dates" },
    { id: "hideWeekdays", label: "Hide Weekdays" },
    { id: "shortMonths", label: "Short Month Names" },
    { id: "showHomeButton", label: "Show Home Button" },
    { id: "showClearButton", label: "Show Clear Button" },
  ];

  return (
    <Wrapper description="Combine any modules to customize your calendar's functionality.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {modules.map((mod) => {
            const isChecked = !!state[mod.id];
            return (
              <div
                key={mod.id}
                className="flex items-center justify-between group min-w-0 py-1"
              >
                <Label
                  htmlFor={mod.id}
                  className="text-[11px] leading-tight transition-colors cursor-pointer truncate mr-1 text-zinc-500 group-hover:text-zinc-900"
                >
                  {mod.label}
                </Label>
                <Switch
                  id={mod.id}
                  checked={isChecked}
                  onCheckedChange={(val) => setProp(mod.id, val)}
                  className="scale-[0.65] origin-right shrink-0"
                />
              </div>
            );
          })}
        </div>

        <div className="space-y-3 mb-1">
          <div className="flex justify-between items-center">
            <Label className="text-zinc-600">Component Width</Label>
            <span className="text-[10px] font-mono text-zinc-500">
              {state.width}px
            </span>
          </div>
          <Slider
            value={[Number(state.width) || 400]}
            max={800}
            min={200}
            step={10}
            onValueChange={([val]) => setProp("width", val)}
          />
        </div>
      </div>
    </Wrapper>
  );
};
