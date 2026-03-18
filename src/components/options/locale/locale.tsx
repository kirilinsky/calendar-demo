"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { POPULAR_LANGUAGES, ALL_LANGUAGES } from "@/constants/languages";
import { useCalendarStateStore } from "@/stores/calendar-state.store";
import { useState } from "react";

export const LocalesOptions = () => {
  const { setProp, locale } = useCalendarStateStore();
  const [open, setOpen] = useState(false);

  return (
    <Wrapper description="Choose your preferred language and date formatting.">
      <div className="space-y-6 pt-2">
        <div className="space-y-3">
          <Label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
            Popular
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_LANGUAGES.map((lang) => {
              const isActive = locale === lang.value;
              return (
                <Button
                  key={lang.value}
                  variant="outline"
                  className={cn(
                    "text-[11px] h-8 font-normal transition-all",
                    isActive
                      ? "border-zinc-900 bg-zinc-950 text-white shadow-sm"
                      : "border-zinc-200 text-zinc-500 hover:text-zinc-900",
                  )}
                  onClick={() => setProp("locale", lang.value)}
                >
                  {lang.label}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
            Search All
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal h-9 transition-colors bg-white border-zinc-200 text-zinc-600"
              >
                <div className="flex items-center gap-2 text-[11px]">
                  <Globe className="h-3 w-3 opacity-50" />
                  {ALL_LANGUAGES.find((l) => l.value === locale)?.label ||
                    "Select language..."}
                </div>
                <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0 border-none shadow-2xl bg-white"
              align="start"
            >
              <Command className="rounded-xl border bg-white border-zinc-100">
                <CommandInput
                  placeholder="Type a language..."
                  className="h-9 text-xs"
                />
                <CommandList className="max-h-[220px] overflow-y-auto custom-scrollbar">
                  <CommandEmpty className="py-4 text-xs text-center text-zinc-500">
                    No results found.
                  </CommandEmpty>
                  <CommandGroup className="p-1">
                    {ALL_LANGUAGES.map((lang) => (
                      <CommandItem
                        key={lang.value}
                        value={lang.label}
                        onSelect={() => {
                          setProp("locale", lang.value);
                          setOpen(false);
                        }}
                        className="text-[11px] cursor-pointer rounded-lg mb-0.5 text-zinc-600"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3 w-3 text-zinc-900",
                            locale === lang.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {lang.label}
                        <span className="ml-auto text-[9px] font-mono opacity-30">
                          {lang.value}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Wrapper>
  );
};

const Label = ({ children, className }: any) => (
  <span className={cn("block font-medium leading-none", className)}>
    {children}
  </span>
);
