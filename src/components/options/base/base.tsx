"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { ArrowDown, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export const BaseOptions = () => {
  return (
    <Wrapper description="Welcome to the configurator.">
      <Alert
        className={cn(
          "border-none overflow-hidden relative group transition-colors duration-500",
          "bg-zinc-900 text-zinc-50",
        )}
      >
        <AlertTitle className="flex items-center gap-2 font-semibold">
          <Sparkles size={14} className={"text-amber-400"} />
          <span>Explore more</span>
        </AlertTitle>

        <AlertDescription
          className={cn("mt-2 text-[13px] leading-relaxed", "text-zinc-400")}
        >
          All settings are hidden below. Proceed step by step to build your
          perfect calendar.
        </AlertDescription>

        <div
          className={cn(
            "absolute -right-4 -top-4 size-16 rounded-full blur-3xl opacity-20",
            "bg-white",
          )}
        />
      </Alert>

      <div className="flex justify-center pt-6 opacity-50 animate-bounce">
        <ArrowDown size={15} className={"text-zinc-400"} />
      </div>
    </Wrapper>
  );
};
