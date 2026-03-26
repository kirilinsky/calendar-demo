"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { THEMES } from "@/constants/themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendarStateStore } from "@/stores/calendar-state.store";
import { usePageStateStore } from "@/stores/page-state.store";
import { CalendarTheme } from "react-calendar-datetime";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const ThemesOptions = () => {
  const {
    setProp,
    theme: activeTheme,
    gradientBackground,
    brutalism,
  } = useCalendarStateStore();
  const { setLightMode } = usePageStateStore();

  return (
    <Wrapper description="Select a color palette for your interface.">
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between group">
          <Label
            className={cn(
              "text-[13px] transition-colors cursor-pointer text-zinc-600 group-hover:text-zinc-900",
            )}
          >
            Gradient Background
          </Label>
          <Switch
            checked={gradientBackground}
            onCheckedChange={(val) => setProp("gradientBackground", val)}
            className="scale-90"
          />
        </div>
        <div className="flex items-center justify-between group">
          <Label
            className={cn(
              "text-[13px] transition-colors cursor-pointer text-zinc-600 group-hover:text-zinc-900",
            )}
          >
            Brutalism Mode
          </Label>
          <Switch
            checked={brutalism}
            onCheckedChange={(val) => setProp("brutalism", val)}
            className="scale-90"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <Button
                key={theme.id}
                variant="outline"
                onClick={() => {
                  setLightMode(theme.type === "dark");
                  setProp("theme", theme.id as CalendarTheme);
                }}
                className={cn(
                  "h-11 justify-start gap-3 px-3 transition-all border",
                  isActive
                    ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                    : "border-zinc-200 text-zinc-500 hover:text-zinc-900",
                )}
              >
                <div className="flex size-4 shrink-0 overflow-hidden rounded-full border border-zinc-200/50">
                  <div
                    className="h-full w-1/2"
                    style={{ backgroundColor: theme.backdrop }}
                  />
                  <div
                    className="h-full w-1/2"
                    style={{ backgroundColor: theme.highlight }}
                  />
                </div>

                <span
                  className={cn(
                    "text-[11px] font-medium capitalize truncate",
                    isActive && "text-zinc-900",
                  )}
                >
                  {theme.id}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};
