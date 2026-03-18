"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { CalendarDays } from "lucide-react";
import { useCalendarStateStore } from "@/stores/calendar-state.store";

export const DateOptions = () => {
  const { setProp, ...state } = useCalendarStateStore();

  const formatDateForInput = (date?: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    try {
      return d.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  return (
    <Wrapper
      title="Date & Constraints"
      description="Define the range, limits, and behavior of the calendar."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-zinc-600">Component Width</Label>
            <span className="text-[10px] font-mono text-zinc-400">
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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[11px] uppercase text-zinc-400">
              Min Date
            </Label>
            <Input
              type="date"
              className="h-8 text-xs px-2 cursor-pointer"
              value={formatDateForInput(state.minDate)}
              onChange={(e) => setProp("minDate", new Date(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] uppercase text-zinc-400">
              Max Date
            </Label>
            <Input
              type="date"
              className="h-8 text-xs px-2 cursor-pointer"
              value={formatDateForInput(state.maxDate)}
              onChange={(e) => setProp("maxDate", new Date(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between group">
            <Label
              htmlFor="highlight"
              className="text-zinc-600 cursor-pointer group-hover:text-zinc-900 transition-colors"
            >
              Highlight Weekends
            </Label>
            <Switch
              id="highlight"
              checked={state.highlightWeekends}
              onCheckedChange={(val) => setProp("highlightWeekends", val)}
            />
          </div>

          <div className="flex items-center justify-between group">
            <Label
              htmlFor="disableWeekends"
              className="text-zinc-600 cursor-pointer group-hover:text-zinc-900 transition-colors"
            >
              Disable Weekends
            </Label>
            <Switch
              id="disableWeekends"
              checked={state.disableWeekends}
              onCheckedChange={(val) => setProp("disableWeekends", val)}
            />
          </div>

          <div className="flex items-center justify-between group">
            <Label
              htmlFor="gestures"
              className="text-zinc-600 cursor-pointer group-hover:text-zinc-900 transition-colors"
            >
              Enable Gestures
            </Label>
            <Switch
              id="gestures"
              checked={state.gestures}
              onCheckedChange={(val) => setProp("gestures", val)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
          <CalendarDays className="size-4 text-zinc-400" />
          <span className="text-[11px] text-zinc-500 leading-tight">
            All changes will be reflected in the preview on the left.
          </span>
        </div>
      </div>
    </Wrapper>
  );
};
