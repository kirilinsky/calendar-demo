"use client";

import { pageStateStore } from "@/stores/page-state.store";
import { useEffect, useRef } from "react";

export default function Home() {
  const { activeStep, setActiveStep } = pageStateStore();
  const isScrolling = useRef(false);
  const totalSteps = 6;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      isScrolling.current = true;

      if (e.deltaY > 0) {
        if (activeStep < totalSteps - 1) setActiveStep(activeStep + 1);
      } else {
        if (activeStep > 0) setActiveStep(activeStep - 1);
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeStep, setActiveStep]);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-50">
      <section className="relative flex flex-[0.8] items-center justify-center border-r border-zinc-200">
        <div className="aspect-square w-64 bg-white shadow-xl rounded-xl flex items-center justify-center border border-zinc-100">
          <span className="text-zinc-400 font-mono">Step: {activeStep}</span>
        </div>
      </section>

      <aside className="flex-[0.2] bg-white p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-8 text-zinc-900">Props</h2>

        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border transition-colors ${
                activeStep === i
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-transparent text-zinc-400"
              }`}
            >
              Prop {i + 1}
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
