// src/options/locales/locales.tsx
"use client";

import * as React from "react";
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

export const LocalesOptions = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("en-US");

  return (
    <Wrapper
      title="Locales"
      description="Choose your preferred language and date formatting."
    >
      <div className="space-y-6 scroll-overloaded">
        <div className="space-y-3">
          <Label className="text-[11px] uppercase tracking-wider text-zinc-400">
            Popular
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_LANGUAGES.map((lang) => (
              <Button
                key={lang.value}
                variant="outline"
                className={cn(
                  "text-xs h-8  font-normal transition-all  text-center",
                  value === lang.value
                    ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                    : "border-zinc-200 text-zinc-500 hover:text-zinc-900",
                )}
                onClick={() => setValue(lang.value)}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[11px] uppercase tracking-wider text-zinc-400">
            Search All
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal text-zinc-600 h-10"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Globe className="h-3 w-3 opacity-50" />
                  {ALL_LANGUAGES.find((l) => l.value === value)?.label ||
                    "Select language..."}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Type a language..."
                  className="h-9"
                />
                <CommandList className="max-h-[200px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {ALL_LANGUAGES.map((lang) => (
                      <CommandItem
                        key={lang.value}
                        value={lang.label}
                        onSelect={() => {
                          setValue(lang.value);
                          setOpen(false);
                        }}
                        className="text-sm cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === lang.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {lang.label}
                        <span className="ml-auto text-[10px] font-mono opacity-30">
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
