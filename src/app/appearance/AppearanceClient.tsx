"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CalendarAppearance } from "@dateforge/react-calendar";
import {
  bubble,
  compact,
  loft,
  soft,
  square,
} from "@dateforge/react-calendar/appearances";
import {
  readSavedAppearanceId,
  saveAppearanceId,
  type AppearanceId,
} from "../calendar-preferences";
import { CalendarPreview, APPEARANCE_NAV } from "../CalendarPreview";

type AppearancePreset = {
  id: AppearanceId;
  mood: string;
  appearance?: CalendarAppearance;
  radius: string;
  spacing: string;
};

const CARD_W = 178;
const CARD_GAP = 10;
const SLOT = CARD_W + CARD_GAP;
const CLICK_DRAG_THRESHOLD = 6;
const PREVIEW_DATE = new Date(2026, 4, 13);
const PREVIEW_VIEW_DATE = new Date(2026, 4, 1);

function getSliderIndex(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLElement>("[data-slider-index]");
  if (!item?.dataset.sliderIndex) return null;
  const index = Number(item.dataset.sliderIndex);
  return Number.isFinite(index) ? index : null;
}

const APPEARANCES: AppearancePreset[] = [
  {
    id: "default",
    mood: "Balanced",
    radius: "0.5em",
    spacing: "0.55em",
  },
  {
    id: "soft",
    mood: "Comfortable",
    appearance: soft,
    radius: "0.75em",
    spacing: "0.7em",
  },
  {
    id: "compact",
    mood: "Dense",
    appearance: compact,
    radius: "0.3em",
    spacing: "0.35em",
  },
  {
    id: "square",
    mood: "Sharp",
    appearance: square,
    radius: "0",
    spacing: "0.5em",
  },
  {
    id: "bubble",
    mood: "Playful",
    appearance: bubble,
    radius: "1.5em",
    spacing: "0.7em",
  },
  {
    id: "loft",
    mood: "Spacious",
    appearance: loft,
    radius: "1em",
    spacing: "1em",
  },
];

const N = APPEARANCES.length;

export function AppearanceClient() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeCenterRaw, setActiveCenterRaw] = useState(N);
  const [ready, setReady] = useState(false);

  const infiniteAppearances = useMemo(
    () => [...APPEARANCES, ...APPEARANCES, ...APPEARANCES],
    [],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const isResetting = useRef(false);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<{
    startX: number;
    startScroll: number;
    lastX: number;
    lastT: number;
    vel: number;
    moved: boolean;
    targetRawIndex: number | null;
  } | null>(null);
  const inertiaRef = useRef<number | null>(null);
  const isSnapping = useRef(false);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    const frame = requestAnimationFrame(() => {
      const savedId = readSavedAppearanceId();
      const savedIdx = Math.max(
        0,
        APPEARANCES.findIndex((appearance) => appearance.id === savedId),
      );
      const raw = N + savedIdx;
      setActiveIdx(savedIdx);
      setActiveCenterRaw(raw);
      if (el) {
        el.scrollLeft = raw * SLOT + CARD_W / 2 - el.clientWidth / 2;
      }
      setReady(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const syncActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isResetting.current) return;
    const visCenter = el.scrollLeft + el.clientWidth / 2;
    const raw = Math.round((visCenter - CARD_W / 2) / SLOT);
    const real = (((raw - N) % N) + N) % N;
    setActiveCenterRaw(raw);
    setActiveIdx(real);
    saveAppearanceId(APPEARANCES[real].id);
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

  const selectRawIndex = useCallback((rawIndex: number, force = false) => {
    if (suppressClickRef.current && !force) {
      suppressClickRef.current = false;
      return;
    }

    const el = scrollRef.current;
    const real = (((rawIndex - N) % N) + N) % N;
    const raw = N + real;
    setActiveCenterRaw(raw);
    setActiveIdx(real);
    saveAppearanceId(APPEARANCES[real].id);

    if (!el) return;
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
    inertiaRef.current = null;
    isSnapping.current = true;
    const target = raw * SLOT + CARD_W / 2 - el.clientWidth / 2;
    el.scrollTo({ left: target, behavior: "smooth" });
    el.addEventListener(
      "scrollend",
      () => {
        isSnapping.current = false;
      },
      { once: true },
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let snapTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (dragRef.current || isSnapping.current) return;
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
      moved: false,
      targetRawIndex: getSliderIndex(e.target),
    };
    suppressClickRef.current = false;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      const drag = dragRef.current;
      if (!el || !drag) return;
      if (Math.abs(e.clientX - drag.startX) > CLICK_DRAG_THRESHOLD) {
        drag.moved = true;
      }
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
    if (!drag.moved && drag.targetRawIndex !== null) {
      selectRawIndex(drag.targetRawIndex, true);
      return;
    }
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    }
    let v = drag.vel * 16;
    const runInertia = () => {
      v *= 0.88;
      el.scrollLeft += v;
      syncActive();
      if (Math.abs(v) > 0.4) {
        inertiaRef.current = requestAnimationFrame(runInertia);
      } else {
        inertiaRef.current = null;
        snapToNearest();
      }
    };
    inertiaRef.current = requestAnimationFrame(runInertia);
  }, [selectRawIndex, syncActive, snapToNearest]);

  const onPointerCancel = useCallback(() => {
    dragRef.current = null;
  }, []);

  const active = APPEARANCES[activeIdx];
  const previewWidth =
    active.id === "loft" ? "min(70vw, 320px)" : "min(78vw, 340px)";

  return (
    <div
      className="flex min-h-0 flex-1 flex-col transition-opacity duration-200"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <section className="flex min-h-0 flex-1 items-center justify-center py-3 sm:py-6">
        <div className="flex h-[min(53dvh,440px)] min-h-[280px] w-full items-center justify-center  sm:h-[490px] sm:min-h-[399px]">
          <div
            className="origin-center transition-all duration-500 ease-out"
            style={{
              filter: "drop-shadow(0 12px 40px rgb(24 24 27 / 0.12))",
            }}
          >
            <CalendarPreview
              appearance={active.appearance}
              defaultViewDate={PREVIEW_VIEW_DATE}
              initialDate={PREVIEW_DATE}
              useSavedAppearanceFallback={false}
              width={previewWidth}
              navLinks={APPEARANCE_NAV}
            />
          </div>
        </div>
      </section>

      <section className="shrink-0 select-none pb-4 sm:pb-8">
        <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Appearances - you can decide
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
            className="flex cursor-grab overflow-x-scroll py-2 active:cursor-grabbing [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
            style={{ gap: CARD_GAP, userSelect: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            {infiniteAppearances.map((preset, i) => (
              <AppearanceCard
                key={`${preset.id}-${i}`}
                preset={preset}
                isCenter={i === activeCenterRaw}
                rawIndex={i}
                onSelect={(force) => selectRawIndex(i, force)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const AppearanceCard = memo(function AppearanceCard({
  preset,
  isCenter,
  rawIndex,
  onSelect,
}: {
  preset: AppearancePreset;
  isCenter: boolean;
  rawIndex: number;
  onSelect: (force?: boolean) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      data-slider-index={rawIndex}
      className="flex shrink-0 items-center gap-3 rounded-2xl border bg-white px-3.5 transition-all duration-300 ease-out"
      style={{
        width: CARD_W,
        height: 64,
        scrollSnapAlign: "center",
        borderColor: isCenter ? "rgb(24 24 27)" : "rgb(228 228 231 / 0.6)",
        boxShadow: isCenter
          ? "0 2px 12px rgb(24 24 27 / 0.08), 0 1px 3px rgb(0 0 0 / 0.06)"
          : "0 1px 2px rgb(0 0 0 / 0.04)",
        opacity: isCenter ? 1 : 0.52,
        transform: isCenter ? "scale(1)" : "scale(0.93)",
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onSelect(true);
      }}
    >
      <div className="grid h-8 w-8 shrink-0 grid-cols-2 gap-1 rounded-xl border border-zinc-100 bg-zinc-50 p-1">
        <span
          className="bg-zinc-900"
          style={{
            borderRadius: preset.radius,
          }}
        />
        <span
          className="rounded-sm bg-zinc-200"
          style={{
            margin: preset.spacing,
          }}
        />
        <span className="col-span-2 rounded-sm bg-zinc-900" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold capitalize leading-tight text-zinc-900">
          {preset.id}
        </div>
        <div className="mt-0.5 truncate text-[11px] leading-tight text-zinc-400">
          {preset.mood}
        </div>
      </div>
    </div>
  );
});
