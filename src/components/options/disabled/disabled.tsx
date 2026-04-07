"use client";

import { useState, useEffect } from "react";
import { Wrapper } from "@/components/options/wrapper/wrapper";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useCalendarStateStore } from "@/stores/calendar-state.store";

type DisabledRule =
  | boolean
  | Date
  | { from: Date; to: Date }
  | { dayOfWeek: number[] }
  | { before?: Date; after?: Date };

const WEEKDAY_OPTIONS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export const DisabledOptions = () => {
  const { setProp, hideDisabled } = useCalendarStateStore();

  const [disableAll, setDisableAll] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [beforeDate, setBeforeDate] = useState("");
  const [afterDate, setAfterDate] = useState("");

  const [specificDateInput, setSpecificDateInput] = useState("");
  const [specificDates, setSpecificDates] = useState<string[]>([]);

  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  useEffect(() => {
    if (disableAll) {
      setProp("disabled", true);
      return;
    }

    const rules: DisabledRule[] = [];

    if (selectedDays.length > 0) {
      rules.push({ dayOfWeek: selectedDays });
    }

    const beforeAndAfter: { before?: Date; after?: Date } = {};
    if (beforeDate) beforeAndAfter.before = new Date(beforeDate);
    if (afterDate) beforeAndAfter.after = new Date(afterDate);
    if (beforeDate || afterDate) rules.push(beforeAndAfter as DisabledRule);

    for (const iso of specificDates) {
      rules.push(new Date(iso));
    }

    if (rangeFrom && rangeTo) {
      rules.push({ from: new Date(rangeFrom), to: new Date(rangeTo) });
    }

    if (rules.length === 0) {
      setProp("disabled", undefined);
    } else if (rules.length === 1) {
      setProp("disabled", rules[0]);
    } else {
      setProp("disabled", rules as any);
    }
  }, [
    disableAll,
    selectedDays,
    beforeDate,
    afterDate,
    specificDates,
    rangeFrom,
    rangeTo,
  ]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const addSpecificDate = () => {
    if (!specificDateInput || specificDates.includes(specificDateInput)) return;
    setSpecificDates((prev) => [...prev, specificDateInput]);
    setSpecificDateInput("");
  };

  const hasAnyRule =
    selectedDays.length > 0 ||
    beforeDate ||
    afterDate ||
    specificDates.length > 0 ||
    rangeFrom ||
    rangeTo;

  const resetAll = () => {
    setSelectedDays([]);
    setBeforeDate("");
    setAfterDate("");
    setSpecificDates([]);
    setRangeFrom("");
    setRangeTo("");
  };

  return (
    <Wrapper description="Configure which dates are disabled and how they appear.">
      <div className="space-y-5 pt-2">
        <div className="flex items-center justify-between group">
          <Label
            htmlFor="hideDisabled"
            className="text-[13px] cursor-pointer text-zinc-600 group-hover:text-zinc-900 transition-colors"
          >
            Hide Disabled Dates
          </Label>
          <Switch
            id="hideDisabled"
            checked={!!hideDisabled}
            onCheckedChange={(val) => setProp("hideDisabled", val)}
            className="scale-90"
          />
        </div>

        <div className="w-full h-px bg-zinc-100" />

        <div className="flex items-center justify-between group">
          <Label
            htmlFor="disableAll"
            className="text-[13px] cursor-pointer text-zinc-600 group-hover:text-zinc-900 transition-colors"
          >
            Disable All
          </Label>
          <Switch
            id="disableAll"
            checked={disableAll}
            onCheckedChange={(val) => {
              setDisableAll(val);
              if (val) resetAll();
            }}
            className="scale-90"
          />
        </div>

        <div
          className={
            disableAll
              ? "opacity-40 pointer-events-none space-y-5"
              : "space-y-5"
          }
        >
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Days of Week
            </Label>
            <div className="flex gap-1 flex-wrap">
              {WEEKDAY_OPTIONS.map(({ label, value }) => {
                const active = selectedDays.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleDay(value)}
                    className={`h-7 w-9 rounded text-[10px] font-medium border transition-all ${
                      active
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={() => setSelectedDays([0, 6])}
                className="text-[10px] text-zinc-500 hover:text-zinc-900 transition-colors underline underline-offset-2"
              >
                Weekends
              </button>
              <button
                onClick={() => setSelectedDays([1, 2, 3, 4, 5])}
                className="text-[10px] text-zinc-500 hover:text-zinc-900 transition-colors underline underline-offset-2"
              >
                Weekdays
              </button>
              {selectedDays.length > 0 && (
                <button
                  onClick={() => setSelectedDays([])}
                  className="text-[10px] text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Specific Dates
            </Label>
            <div className="flex gap-2">
              <Input
                type="date"
                className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200 flex-1"
                value={specificDateInput}
                onChange={(e) => setSpecificDateInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSpecificDate()}
              />
              <button
                onClick={addSpecificDate}
                disabled={!specificDateInput}
                className="h-8 px-3 text-[11px] font-medium rounded border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {specificDates.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {specificDates.map((iso) => (
                  <span
                    key={iso}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-700"
                  >
                    {fmt(iso)}
                    <button
                      onClick={() =>
                        setSpecificDates((prev) =>
                          prev.filter((d) => d !== iso),
                        )
                      }
                      className="text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400">From</span>
                <Input
                  type="date"
                  className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400">To</span>
                <Input
                  type="date"
                  className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                />
              </div>
            </div>
            {(rangeFrom || rangeTo) && !(rangeFrom && rangeTo) && (
              <p className="text-[10px] text-amber-500">
                Both dates required to apply range.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Before / After
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400">Before</span>
                <Input
                  type="date"
                  className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
                  value={beforeDate}
                  onChange={(e) => setBeforeDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400">After</span>
                <Input
                  type="date"
                  className="h-8 text-[11px] px-2 cursor-pointer bg-white border-zinc-200"
                  value={afterDate}
                  onChange={(e) => setAfterDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {hasAnyRule && (
            <button
              onClick={resetAll}
              className="text-[10px] text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2"
            >
              Reset all rules
            </button>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
