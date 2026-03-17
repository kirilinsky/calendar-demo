"use client";

import { BaseOptions } from "@/components/options/base/base";
import { ModulesOptions } from "@/components/options/modules/modules";
import { usePageStateStore } from "@/stores/page-state.store";
import { AnimatePresence } from "framer-motion";
import { LocalesOptions } from "../options/locale/locale";

const Sidebar = () => {
  const { activeStep, setActiveStep } = usePageStateStore();

  return (
    <aside className="flex-[0.2] bg-white p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-8 text-zinc-900">Props</h2>

      <div className="flex flex-col gap-4">
        <div
          onClick={() => setActiveStep(0)}
          className={`p-4 rounded-lg border transition-colors ${
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
          className={`p-4 rounded-lg border transition-colors ${
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
          className={`p-4 rounded-lg border transition-colors ${
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
      </div>
    </aside>
  );
};

export default Sidebar;
