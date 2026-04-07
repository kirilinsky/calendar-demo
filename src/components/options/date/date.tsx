"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { CalendarProps, StartOfWeek } from "react-calendar-datetime";

type CalendarMode = NonNullable<CalendarProps["mode"]>;

export const DAYS_OPTIONS = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

const MODE_OPTIONS: { label: string; value: CalendarMode }[] = [
  { label: "Single", value: "single" },
  { label: "Multiple", value: "multiple" },
  { label: "Range", value: "range" },
];

export const DateOptions = () => {
  const { setProp, ...state } = useCalendarStateStore();

  const formatDateForInput = (date?: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    try {
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <Wrapper description="Define the range, limits, and behavior of the calendar.">
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between group">
          <Label className="text-[13px] text-zinc-600">Mode</Label>
          <Select
            value={state.mode || "single"}
            onValueChange={(value) => setProp("mode", value as CalendarMode)}
          >
            <SelectTrigger className="w-[120px] h-8 text-[11px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {MODE_OPTIONS.map(({ label, value }) => (
                  <SelectItem key={value} value={value} className="text-[11px]">
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {state.mode === "multiple" && (
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Max Selectable Dates
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="Unlimited"
              className="h-8 text-[11px] px-2 bg-white border-zinc-200"
              value={state.max ?? ""}
              onChange={(e) =>
                setProp(
                  "max",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
        )}

        {state.mode === "range" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
                Min Days
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="–"
                className="h-8 text-[11px] px-2 bg-white border-zinc-200"
                value={state.rangeMinDays ?? ""}
                onChange={(e) =>
                  setProp(
                    "rangeMinDays",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
                Max Days
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="–"
                className="h-8 text-[11px] px-2 bg-white border-zinc-200"
                value={state.rangeMaxDays ?? ""}
                onChange={(e) =>
                  setProp(
                    "rangeMaxDays",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Start Date
            </Label>
            <Input
              type="date"
              className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
              value={formatDateForInput(state.startDate)}
              onChange={(e) =>
                setProp(
                  "startDate",
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              End Date
            </Label>
            <Input
              type="date"
              className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
              value={formatDateForInput(state.endDate)}
              onChange={(e) =>
                setProp(
                  "endDate",
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
            Start Month
          </Label>
          <Input
            type="month"
            className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
            value={
              state.startMonth
                ? `${state.startMonth.getFullYear()}-${String(state.startMonth.getMonth() + 1).padStart(2, "0")}`
                : ""
            }
            onChange={(e) =>
              setProp(
                "startMonth",
                e.target.value ? new Date(e.target.value + "-01") : undefined,
              )
            }
          />
        </div>

        <div className="space-y-4 pt-1">
          {[
            { id: "highlightWeekends", label: "Highlight Weekends" },
            { id: "gestures", label: "Enable Gestures" },
            { id: "showWeekNumber", label: "Show Week Number" },
            { id: "hour12", label: "12-hour (AM/PM) or 24-hour time" },
            { id: "hideLimited", label: "Hide Limited Dates" },
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
