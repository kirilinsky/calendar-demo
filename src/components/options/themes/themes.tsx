"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { THEMES } from "@/constants/themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendarStateStore } from "@/stores/calendar-state.store";
import { useEffect, useState } from "react";
import { CalendarTheme } from "react-calendar-datetime";

export const ThemesOptions = () => {
  const { setProp, theme } = useCalendarStateStore();
  const [selectedTheme, setSelectedTheme] = useState<CalendarTheme>(theme);

  useEffect(() => {
    setProp("theme", selectedTheme);
  }, [selectedTheme]);

  return (
    <Wrapper
      title="Themes"
      description="Select a color palette for your interface."
    >
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((theme) => (
          <Button
            key={theme.id}
            variant="outline"
            onClick={() => setSelectedTheme(theme.id as CalendarTheme)}
            className={cn(
              "h-12 justify-start gap-3 px-3 transition-all",
              selectedTheme === theme.id
                ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50"
                : "border-zinc-200 hover:border-zinc-400",
            )}
          >
            <div className="flex size-5 shrink-0 overflow-hidden rounded-full border border-zinc-200">
              <div
                className="h-full w-1/2"
                style={{ backgroundColor: theme.backdrop }}
              />
              <div
                className="h-full w-1/2"
                style={{ backgroundColor: theme.highlight }}
              />
            </div>

            <span className="text-xs font-medium capitalize truncate">
              {theme.id}
            </span>
          </Button>
        ))}
      </div>
    </Wrapper>
  );
};
