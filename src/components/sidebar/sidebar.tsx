"use client";

import { BaseOptions } from "@/components/options/base/base";
import { ModulesOptions } from "@/components/options/modules/modules";
import { usePageStateStore } from "@/stores/page-state.store";
import { AnimatePresence } from "framer-motion";
import { LocalesOptions } from "../options/locale/locale";
import { ThemesOptions } from "../options/themes/themes";
import { DateOptions } from "../options/date/date";

const Sidebar = () => {
  const { activeStep, setActiveStep } = usePageStateStore();

  return (
    <aside className="flex-[0.3] bg-white p-5 overflow-y-auto">
      <div className="flex flex-col gap-3">
        <div
          onClick={() => setActiveStep(0)}
          className={`p-3 rounded-lg border transition-colors ${
            activeStep === 0
              ? "border-zinc-900 bg-zinc-50"
              : "border-transparent text-zinc-400"
          }`}
        >
          {activeStep !== 0 ? (
            "Base"
          ) : (
            <AnimatePresence>
              <BaseOptions />
            </AnimatePresence>
          )}
        </div>

        <div
          onClick={() => setActiveStep(1)}
          className={`p-3 rounded-lg border transition-colors ${
            activeStep === 1
              ? "border-zinc-900 bg-zinc-50"
              : "border-transparent text-zinc-400"
          }`}
        >
          {activeStep !== 1 ? (
            "Modules"
          ) : (
            <AnimatePresence>
              <ModulesOptions />
            </AnimatePresence>
          )}
        </div>

        <div
          onClick={() => setActiveStep(2)}
          className={`p-3 rounded-lg border transition-colors ${
            activeStep === 2
              ? "border-zinc-900 bg-zinc-50"
              : "border-transparent text-zinc-400"
          }`}
        >
          {activeStep !== 2 ? (
            "Locales"
          ) : (
            <AnimatePresence>
              <LocalesOptions />
            </AnimatePresence>
          )}
        </div>

        <div
          onClick={() => setActiveStep(3)}
          className={`p-3 rounded-lg border transition-colors ${
            activeStep === 3
              ? "border-zinc-900 bg-zinc-50"
              : "border-transparent text-zinc-400"
          }`}
        >
          {activeStep !== 3 ? (
            "Themes"
          ) : (
            <AnimatePresence>
              <ThemesOptions />
            </AnimatePresence>
          )}
        </div>

        <div
          onClick={() => setActiveStep(4)}
          className={`p-3 rounded-lg border transition-colors ${
            activeStep === 4
              ? "border-zinc-900 bg-zinc-50"
              : "border-transparent text-zinc-400"
          }`}
        >
          {activeStep !== 4 ? (
            "Rest Options"
          ) : (
            <AnimatePresence>
              <DateOptions />
            </AnimatePresence>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
