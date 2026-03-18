"use client";
import { act, useEffect, useRef } from "react";
import { usePageStateStore } from "@/stores/page-state.store";
import Sidebar from "@/components/sidebar/sidebar";
import { Calendar } from "react-calendar-datetime";
import { useCalendarStateStore } from "@/stores/calendar-state.store";

export default function Home() {
  const { activeStep, setActiveStep } = usePageStateStore();
  const props = useCalendarStateStore();
  const isScrolling = useRef(false);

  const totalSteps = 4;

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
        if (activeStep <= totalSteps - 1) setActiveStep(activeStep + 1);
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
      <span className="text-zinc-400 font-mono">Step: {activeStep}</span>
      <section className="relative flex flex-[0.8] items-center justify-center border-r border-zinc-200 bg-zinc-50/50 p-12">
        <div className="absolute inset-0 z-0 opacity-30 [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]" />

        <div style={{ width: "600px", transition: "all .3 linear" }}>
          <Calendar {...props} onChangeDate={(date) => console.log(date)} />
        </div>
      </section>
      <Sidebar />
    </main>
  );
}
