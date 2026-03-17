"use client";

import { Wrapper } from "@/components/options/wrapper/wrapper";
import { ArrowDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const ModulesOptions = () => {
  const modules = [
    { id: "years", label: "Years", default: false },
    { id: "months", label: "Months", default: true },
    { id: "time", label: "Time", default: false },
    { id: "presets", label: "Presets", default: false },
    { id: "compact", label: "Compact Months", default: false },
  ];

  return (
    <Wrapper
      title="Modules"
      description="Here you can combine any modules exactly how you want them to
          appear."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="flex items-center justify-between group"
            >
              <Label
                htmlFor={mod.id}
                className="text-zinc-600 group-hover:text-zinc-900 transition-colors cursor-pointer"
              >
                {mod.label}
              </Label>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase text-zinc-400">
                  {mod.default ? "ON" : "OFF"}
                </span>
                <Switch id={mod.id} defaultChecked={mod.default} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 pt-4 border-t border-zinc-100">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            Ready for more?
          </span>
          <div className="opacity-50 animate-bounce">
            <ArrowDown size={16} className="text-zinc-400" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
