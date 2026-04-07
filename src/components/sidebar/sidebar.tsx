"use client";

import { usePageStateStore } from "@/stores/page-state.store";
import { motion, AnimatePresence } from "framer-motion";
import { ModulesOptions } from "@/components/options/modules/modules";
import { LocalesOptions } from "../options/locale/locale";
import { ThemesOptions } from "../options/themes/themes";
import { DateOptions } from "../options/date/date";
import { DisabledOptions } from "../options/disabled/disabled";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BaseOptions } from "../options/base/base";

const Sidebar = () => {
  const router = useRouter();
  const { activeStep, setActiveStep } = usePageStateStore();

  const handleStepClick = (id: number) => {
    setActiveStep(id);
    router.push(`?step=${id}`, { scroll: false });
  };

  const steps = [
    { id: 0, label: "Base", component: <BaseOptions /> },
    { id: 1, label: "Modules", component: <ModulesOptions /> },
    { id: 2, label: "Locales", component: <LocalesOptions /> },
    { id: 3, label: "Themes", component: <ThemesOptions /> },
    { id: 4, label: "Date Settings", component: <DateOptions /> },
    { id: 5, label: "Disabled", component: <DisabledOptions /> },
  ];

  return (
    <aside className="light h-screen w-full p-3 overflow-y-auto border-l bg-white border-zinc-200 text-zinc-950 transition-colors duration-500">
      <div className="flex flex-col gap-1">
        {steps.map((step) => {
          const isActive = activeStep === step.id;

          return (
            <motion.div
              layout
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={cn(
                "p-4 rounded-2xl cursor-pointer border transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "border-zinc-900  text-white shadow-md"
                  : "border-transparent bg-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isActive ? "text-white" : "text-zinc-900",
                  )}
                >
                  {step.label}
                </span>

                {!isActive && (
                  <span className="text-[10px] font-mono opacity-50">
                    0{step.id + 1}
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {isActive && (
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
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
