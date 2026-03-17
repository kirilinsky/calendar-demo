"use client";
import { useEffect, useRef } from "react";
import { usePageStateStore } from "@/stores/page-state.store";
import Sidebar from "@/components/sidebar/sidebar";

export default function Home() {
  const { activeStep, setActiveStep } = usePageStateStore();
  const isScrolling = useRef(false);

  const totalSteps = 5;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const isInsideCommand =
        target.closest("[cmdk-root]") ||
        target.closest('[data-slot="command-list"]');

      if (isInsideCommand) {
        return;
      }

      e.preventDefault();
      if (isScrolling.current) return;

      isScrolling.current = true;

      if (e.deltaY > 0) {
        if (activeStep < totalSteps - 1) setActiveStep(activeStep + 1);
      } else {
        if (activeStep > 0) setActiveStep(activeStep - 1);
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 1200);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeStep, setActiveStep]);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-50">
      <section className="relative flex flex-[0.8] items-center justify-center border-r border-zinc-200">
        <div className="aspect-square w-64 bg-white shadow-xl rounded-xl flex items-center justify-center border border-zinc-100">
          <span className="text-zinc-400 font-mono">Step: {activeStep}</span>
        </div>
      </section>
      <Sidebar />
    </main>
  );
}
