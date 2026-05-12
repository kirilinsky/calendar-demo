"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Calendar, useToday } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";
import { THEMES, type ThemePreset } from "./themes-data";

const CARD_W = 164;
const CARD_GAP = 10;
const SLOT = CARD_W + CARD_GAP;

const N = THEMES.length;
const INFINITE = [...THEMES, ...THEMES, ...THEMES];

export function ThemesClient() {
  const today = useToday();
  const [date, setDate] = useState<Date | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeCenterRaw, setActiveCenterRaw] = useState(N);

  useEffect(() => {
    if (today) setDate((current) => current ?? today);
  }, [today]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isResetting = useRef(false);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<{
    startX: number;
    startScroll: number;
    lastX: number;
    lastT: number;
    vel: number;
  } | null>(null);
  const inertiaRef = useRef<number | null>(null);
  const isSnapping = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = N * SLOT + CARD_W / 2 - el.clientWidth / 2;
  }, []);

  const syncActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isResetting.current) return;
    const visCenter = el.scrollLeft + el.clientWidth / 2;
    const raw = Math.round((visCenter - CARD_W / 2) / SLOT);
    const real = (((raw - N) % N) + N) % N;
    setActiveCenterRaw(raw);
    setActiveIdx(real);
    if (raw < N) {
      isResetting.current = true;
      el.scrollLeft += N * SLOT;
      setActiveCenterRaw(raw + N);
      isResetting.current = false;
    } else if (raw >= 2 * N) {
      isResetting.current = true;
      el.scrollLeft -= N * SLOT;
      setActiveCenterRaw(raw - N);
      isResetting.current = false;
    }
  }, []);

  const snapToNearest = useCallback(() => {
    const el = scrollRef.current;
    if (!el || dragRef.current || isSnapping.current) return;
    const visCenter = el.scrollLeft + el.clientWidth / 2;
    const raw = Math.round((visCenter - CARD_W / 2) / SLOT);
    const target = raw * SLOT + CARD_W / 2 - el.clientWidth / 2;
    if (Math.abs(target - el.scrollLeft) > 1) {
      isSnapping.current = true;
      el.scrollTo({ left: target, behavior: "smooth" });
      el.addEventListener(
        "scrollend",
        () => {
          isSnapping.current = false;
        },
        { once: true },
      );
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let snapTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (dragRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncActive);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToNearest, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", snapToNearest);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", snapToNearest);
      clearTimeout(snapTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [syncActive, snapToNearest]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
    el.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      lastX: e.clientX,
      lastT: performance.now(),
      vel: 0,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      const drag = dragRef.current;
      if (!el || !drag) return;
      el.scrollLeft = drag.startScroll + (drag.startX - e.clientX);
      const now = performance.now();
      const dt = now - drag.lastT;
      if (dt > 0) drag.vel = (drag.lastX - e.clientX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = now;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncActive);
    },
    [syncActive],
  );

  const onPointerUp = useCallback(() => {
    const el = scrollRef.current;
    const drag = dragRef.current;
    if (!el || !drag) return;
    dragRef.current = null;
    let v = drag.vel * 16;
    const FRICTION = 0.88;
    const MIN_VEL = 0.4;
    const runInertia = () => {
      v *= FRICTION;
      el.scrollLeft += v;
      syncActive();
      if (Math.abs(v) > MIN_VEL) {
        inertiaRef.current = requestAnimationFrame(runInertia);
      } else {
        inertiaRef.current = null;
        snapToNearest();
      }
    };
    inertiaRef.current = requestAnimationFrame(runInertia);
  }, [syncActive, snapToNearest]);

  const active = THEMES[activeIdx];

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <section className="flex flex-1 flex-col items-center justify-center gap-5 py-6">
        <div
          className="transition-all duration-500 ease-out"
          style={{ filter: `drop-shadow(0 12px 40px ${active.highlight}2a)` }}
        >
          <Calendar
            value={date}
            onChange={setDate}
            width={300}
            theme={active.theme}
          >
            <CalendarNav showMonthPicker compactYears />
            <CalendarDays />
          </Calendar>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full transition-colors duration-500"
            style={{ backgroundColor: active.highlight }}
          />
          <span className="text-sm font-semibold capitalize text-zinc-800">
            {active.id}
          </span>
          <span className="text-[11px] text-zinc-300">·</span>
          <span className="text-xs text-zinc-400">{active.mood}</span>
        </div>
      </section>

      <section className="pb-8 select-none">
        <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Themes
        </p>
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10"
            style={{
              background:
                "linear-gradient(to right, #fbfbfd 0%, transparent 10%, transparent 90%, #fbfbfd 100%)",
            }}
          />
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll [scrollbar-width:none] [-webkit-overflow-scrolling:touch] cursor-grab active:cursor-grabbing py-2"
            style={{ gap: CARD_GAP, userSelect: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {INFINITE.map((preset, i) => (
              <ThemeCard
                key={`${preset.id}-${i}`}
                preset={preset}
                isCenter={i === activeCenterRaw}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const ThemeCard = memo(function ThemeCard({
  preset,
  isCenter,
}: {
  preset: ThemePreset;
  isCenter: boolean;
}) {
  return (
    <div
      aria-hidden
      className="shrink-0 flex items-center gap-3 px-3.5 rounded-2xl border bg-white transition-all duration-300 ease-out"
      style={{
        width: CARD_W,
        height: 64,
        scrollSnapAlign: "center",
        borderColor: isCenter
          ? `${preset.highlight}55`
          : "rgb(228 228 231 / 0.6)",
        boxShadow: isCenter
          ? `0 2px 12px ${preset.highlight}18, 0 1px 3px rgb(0 0 0 / 0.06)`
          : "0 1px 2px rgb(0 0 0 / 0.04)",
        opacity: isCenter ? 1 : 0.52,
        transform: isCenter ? "scale(1)" : "scale(0.93)",
      }}
    >
      <div
        className="shrink-0 w-8 h-8 rounded-xl overflow-hidden flex border border-zinc-100"
        style={{ boxShadow: "inset 0 0 0 0.5px rgb(0 0 0 / 0.06)" }}
      >
        <div
          className="w-1/2 h-full"
          style={{ backgroundColor: preset.backdrop }}
        />
        <div
          className="w-1/2 h-full"
          style={{ backgroundColor: preset.highlight }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold capitalize text-zinc-900 leading-tight truncate">
          {preset.id}
        </div>
        <div className="text-[11px] text-zinc-400 leading-tight mt-0.5 truncate">
          {preset.mood}
        </div>
      </div>
    </div>
  );
});
