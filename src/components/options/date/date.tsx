"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useCalendarStateStore } from "@/stores/calendar-state.store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StartOfWeek } from "react-calendar-datetime";

export const DAYS_OPTIONS = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

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
    <Wrapper description="Define the range, limits, and behavior of the calendar.">
      <div className="space-y-6 pt-2">
        <div className="space-y-3">
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

        <div className="flex items-center justify-between group">
          <Label className="text-zinc-600">Jelly Mode</Label>
          <Switch
            checked={state.jellyMode}
            onCheckedChange={(val) => setProp("jellyMode", val)}
            className="scale-90"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Min Date
            </Label>
            <Input
              type="date"
              className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
              value={formatDateForInput(state.minDate)}
              onChange={(e) => setProp("minDate", new Date(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Max Date
            </Label>
            <Input
              type="date"
              className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
              value={formatDateForInput(state.maxDate)}
              onChange={(e) => setProp("maxDate", new Date(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {[
            { id: "highlightWeekends", label: "Highlight Weekends" },
            { id: "disableWeekends", label: "Disable Weekends" },
            { id: "gestures", label: "Enable Gestures" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between group"
            >
              <Label
                htmlFor={item.id}
                className="text-[13px] cursor-pointer text-zinc-600 group-hover:text-zinc-900 transition-colors"
              >
                {item.label}
              </Label>
              <Switch
                id={item.id}
                checked={!!state[item.id as keyof typeof state]}
                onCheckedChange={(val) => setProp(item.id as any, val)}
                className="scale-90"
              />
            </div>
          ))}

          <div className="flex items-center justify-between group pt-2">
            <Label className="text-[13px] text-zinc-600">Start of Week</Label>
            <Select
              value={String(state.startOfWeek)}
              onValueChange={(value) =>
                setProp("startOfWeek", Number(value) as StartOfWeek)
              }
            >
              <SelectTrigger className="w-[120px] h-8 text-[11px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {DAYS_OPTIONS.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-[11px]"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
