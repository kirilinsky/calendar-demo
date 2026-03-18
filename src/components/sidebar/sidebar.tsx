"use client";

import { usePageStateStore } from "@/stores/page-state.store";
import { motion, AnimatePresence } from "framer-motion";
import { ModulesOptions } from "@/components/options/modules/modules";
import { LocalesOptions } from "../options/locale/locale";
import { ThemesOptions } from "../options/themes/themes";
import { DateOptions } from "../options/date/date";
import { cn } from "@/lib/utils";
import { BaseOptions } from "../options/base/base";

const Sidebar = () => {
  const { activeStep, setActiveStep } = usePageStateStore();

  const steps = [
    { id: 0, label: "Base", component: <BaseOptions /> },
    { id: 1, label: "Modules", component: <ModulesOptions /> },
    { id: 2, label: "Locales", component: <LocalesOptions /> },
    { id: 3, label: "Themes", component: <ThemesOptions /> },
    { id: 4, label: "Date Settings", component: <DateOptions /> },
  ];

  return (
    <aside
      className={cn(
        "flex-[0.3] p-4 overflow-y-auto transition-colors duration-500 border-l",
        "bg-white border-zinc-200",
      )}
    >
      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <motion.div
            layout
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={cn(
              "p-4 rounded-2xl cursor-pointer border transition-all duration-300 relative overflow-hidden",
              activeStep === step.id,
              "border-zinc-200 bg-zinc-50 shadow-sm",
              "border-transparent text-zinc-400 hover:text-zinc-600",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-sm font-semibold transition-colors",
                  activeStep === step.id && "text-white",
                )}
              >
                {step.label}
              </span>

              {activeStep !== step.id && (
                <span className="text-[10px] font-mono opacity-50">
                  0{step.id + 1}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {activeStep === step.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {step.component}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
