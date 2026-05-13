"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { createTheme } from "@dateforge/react-calendar";
import {
  DEFAULT_CUSTOM_THEME_TOKENS,
  readSavedTheme,
  saveCustomTheme,
  saveThemePreset,
} from "../calendar-preferences";
import { CalendarPreview } from "../CalendarPreview";
import { THEMES, type ThemePreset } from "./themes-data";

type ThemeCardPreset = ThemePreset & {
  adjustable?: boolean;
};

type EditableThemeTokens = typeof DEFAULT_CUSTOM_THEME_TOKENS;
type EditableThemeTokenKey = keyof EditableThemeTokens;

const CARD_W = 176;
const CARD_GAP = 10;
const SLOT = CARD_W + CARD_GAP;
const CLICK_DRAG_THRESHOLD = 6;

const N = THEMES.length + 1;

function getSliderIndex(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const item = target.closest<HTMLElement>("[data-slider-index]");
  if (!item?.dataset.sliderIndex) return null;
  const index = Number(item.dataset.sliderIndex);
  return Number.isFinite(index) ? index : null;
}

const TOKEN_LABELS: Array<{ key: EditableThemeTokenKey; label: string }> = [
  { key: "accent", label: "Accent" },
  { key: "activeText", label: "Active text" },
  { key: "todayDot", label: "Today dot" },
  { key: "backdrop", label: "Backdrop" },
  { key: "highlight", label: "Highlight" },
  { key: "tone", label: "Tone" },
  { key: "text", label: "Text" },
  { key: "stroke", label: "Stroke" },
  { key: "shadow", label: "Shadow" },
  { key: "disabled", label: "Disabled" },
  { key: "mutedText", label: "Muted text" },
  { key: "disabledText", label: "Disabled text" },
  { key: "weekend", label: "Weekend" },
  { key: "range", label: "Range" },
  { key: "error", label: "Error" },
];

export function ThemesClient() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeCenterRaw, setActiveCenterRaw] = useState(N);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [customTokens, setCustomTokens] = useState<EditableThemeTokens>(
    DEFAULT_CUSTOM_THEME_TOKENS,
  );
  const [draftTokens, setDraftTokens] = useState<EditableThemeTokens>(
    DEFAULT_CUSTOM_THEME_TOKENS,
  );

  const customTheme = useMemo<ThemeCardPreset>(
    () => ({
      id: "custom theme",
      backdrop: customTokens.backdrop,
      highlight: customTokens.highlight,
      type: "light",
      mood: "Light base",
      theme: createTheme(customTokens),
      adjustable: true,
    }),
    [customTokens],
  );

  const themePresets = useMemo<ThemeCardPreset[]>(
    () => [...THEMES, customTheme],
    [customTheme],
  );

  const infiniteThemes = useMemo(
    () => [...themePresets, ...themePresets, ...themePresets],
    [themePresets],
  );

  useEffect(() => {
    if (!adjustOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAdjustOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [adjustOpen]);

  const openAdjust = useCallback(() => {
    setDraftTokens(customTokens);
    setAdjustOpen(true);
  }, [customTokens]);

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
      const savedTheme = readSavedTheme();
      let savedIdx = 0;
      if (savedTheme?.type === "custom") {
        setCustomTokens(savedTheme.tokens);
        setDraftTokens(savedTheme.tokens);
        savedIdx = THEMES.length;
      } else if (savedTheme?.type === "preset") {
        const presetIdx = THEMES.findIndex(
          (theme) => theme.id === savedTheme.id,
        );
        if (presetIdx >= 0) {
          savedIdx = presetIdx;
        }
      }

      const raw = N + savedIdx;
      setActiveIdx(savedIdx);
      setActiveCenterRaw(raw);
      if (el) {
        el.scrollLeft = raw * SLOT + CARD_W / 2 - el.clientWidth / 2;
      }
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
    const preset = themePresets[real];
    if (preset.adjustable) {
      saveCustomTheme(customTokens);
    } else {
      saveThemePreset(preset.id);
    }
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
  }, [customTokens, themePresets]);

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

  const selectRawIndex = useCallback(
    (rawIndex: number, force = false) => {
      if (suppressClickRef.current && !force) {
        suppressClickRef.current = false;
        return;
      }

      const el = scrollRef.current;
      const real = (((rawIndex - N) % N) + N) % N;
      const raw = N + real;
      const preset = themePresets[real];
      setActiveCenterRaw(raw);
      setActiveIdx(real);
      if (preset.adjustable) {
        saveCustomTheme(customTokens);
      } else {
        saveThemePreset(preset.id);
      }

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
    },
    [customTokens, themePresets],
  );

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
  }, [selectRawIndex, syncActive, snapToNearest]);

  const onPointerCancel = useCallback(() => {
    dragRef.current = null;
  }, []);

  const active = themePresets[activeIdx];

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <section className="flex flex-1 flex-col items-center justify-center gap-4 py-6">
        <div
          className="transition-all duration-500 ease-out"
          style={{ filter: `drop-shadow(0 12px 40px ${active.highlight}2a)` }}
        >
          <CalendarPreview theme={active.theme} width={345} />
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
            onPointerCancel={onPointerCancel}
          >
            {infiniteThemes.map((preset, i) => (
              <ThemeCard
                key={`${preset.id}-${i}`}
                preset={preset}
                isCenter={i === activeCenterRaw}
                rawIndex={i}
                onAdjust={openAdjust}
                onSelect={(force) => selectRawIndex(i, force)}
              />
            ))}
          </div>
        </div>
      </section>

      <CustomThemeModal
        open={adjustOpen}
        tokens={draftTokens}
        onClose={() => setAdjustOpen(false)}
        onReset={() => setDraftTokens(DEFAULT_CUSTOM_THEME_TOKENS)}
        onApply={() => {
          setCustomTokens(draftTokens);
          if (active.adjustable) {
            saveCustomTheme(draftTokens);
          }
          setAdjustOpen(false);
        }}
        onTokenChange={(key, value) =>
          setDraftTokens((current) => ({ ...current, [key]: value }))
        }
      />
    </div>
  );
}

const ThemeCard = memo(function ThemeCard({
  preset,
  isCenter,
  rawIndex,
  onAdjust,
  onSelect,
}: {
  preset: ThemeCardPreset;
  isCenter: boolean;
  rawIndex: number;
  onAdjust: () => void;
  onSelect: (force?: boolean) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      data-slider-index={rawIndex}
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
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onSelect(true);
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
      {preset.adjustable && (
        <button
          type="button"
          className="shrink-0 rounded-full border border-zinc-200 bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold leading-none text-white transition hover:bg-zinc-800"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onAdjust();
          }}
        >
          Adjust
        </button>
      )}
    </div>
  );
});

function ColorSwatchField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hex = value.slice(0, 7);
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="group flex flex-col items-center gap-2 rounded-2xl px-2 py-3 transition hover:bg-zinc-50"
    >
      <span
        aria-hidden
        className="block h-11 w-11 rounded-full ring-1 ring-inset ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition group-hover:scale-[1.04] group-active:scale-95 sm:h-12 sm:w-12"
        style={{ backgroundColor: hex }}
      />
      <span className="block w-full truncate text-center text-[11px] font-medium text-zinc-700 sm:text-xs">
        {label}
      </span>
      <input
        ref={inputRef}
        type="color"
        value={hex}
        onChange={(event) => onChange(event.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-label={label}
      />
    </button>
  );
}

function CustomThemeModal({
  open,
  tokens,
  onClose,
  onReset,
  onApply,
  onTokenChange,
}: {
  open: boolean;
  tokens: EditableThemeTokens;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
  onTokenChange: (key: EditableThemeTokenKey, value: string) => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/55 p-0 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-theme-title"
      onMouseDown={onClose}
    >
      <div
        className="relative flex h-dvh max-h-dvh w-screen flex-col overflow-hidden rounded-none border-0 bg-white shadow-[0_30px_100px_rgba(24,24,27,0.32)] sm:h-auto sm:max-h-[calc(100dvh-32px)] sm:min-h-[60dvh] sm:w-[min(980px,calc(100vw-32px))] sm:rounded-[28px] sm:border sm:border-white/70 md:min-w-[60vw]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative flex items-center justify-between gap-3 px-4 py-3 sm:items-start sm:gap-6 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:block">
              Theme editor
            </p>
            <h2
              id="custom-theme-title"
              className="text-xl font-semibold tracking-tight text-zinc-950 sm:mt-1 sm:text-2xl"
            >
              Custom theme
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
              onClick={onReset}
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              aria-label="Close custom theme editor"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="relative grid flex-1 gap-4 overflow-y-auto p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid grid-cols-3 content-start gap-2 sm:grid-cols-4 sm:gap-3">
            {TOKEN_LABELS.map(({ key, label }) => (
              <ColorSwatchField
                key={key}
                label={label}
                value={tokens[key]}
                onChange={(value) => onTokenChange(key, value)}
              />
            ))}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-3 sm:p-4">
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                backgroundColor: tokens.backdrop,
                borderColor: tokens.stroke,
                color: tokens.text,
                boxShadow: `0 18px 60px ${tokens.shadow}`,
              }}
            >
              <div
                className="flex items-center justify-between border-b px-3 py-2.5 sm:px-4 sm:py-3"
                style={{
                  backgroundColor: tokens.accent,
                  borderColor: tokens.stroke,
                }}
              >
                <span className="text-sm font-semibold">Preview</span>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tokens.highlight }}
                />
              </div>
              <div className="grid grid-cols-6 gap-1.5 p-3 sm:grid-cols-3 sm:gap-2 sm:p-4">
                {[12, 13, 14, 19, 20, 21].map((day, index) => (
                  <div
                    key={day}
                    className="flex aspect-square items-center justify-center rounded-xl text-xs font-semibold sm:text-sm"
                    style={
                      index === 4
                        ? {
                            backgroundColor: tokens.highlight,
                            color: tokens.activeText,
                          }
                        : {
                            backgroundColor: tokens.tone,
                            color: index === 3 ? tokens.weekend : tokens.text,
                          }
                    }
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-end gap-2 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            className="h-10 rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            onClick={onApply}
          >
            <Check size={16} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
