"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { MousePointer2, ArrowDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const BaseOptions = () => {
  return (
    <Wrapper title="Base" description="Welcome to the configurator.">
      <Alert className="bg-zinc-900 text-zinc-50 border-none overflow-hidden relative group">
        <div className="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform">
          <MousePointer2   size={64} />
        </div>

        <AlertTitle  className="flex items-center gap-2 font-semibold">
          <span>Explore more</span>
        </AlertTitle>

        <AlertDescription className="text-zinc-400 mt-2">
          All settings are hidden below. Just
          <span className="text-white font-medium mx-1">scroll down</span>
          or use your trackpad to reveal the magic.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center pt-4 opacity-50 animate-bounce">
        <ArrowDown size={18} className="text-zinc-400" />
      </div>
    </Wrapper>
  );
};
