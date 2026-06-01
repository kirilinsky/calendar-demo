"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Calendar,
  basicPresets,
  createAppearance,
  createDisabled,
  createTheme,
  type PresetEntry,
} from "@dateforge/react-calendar";
import {
  CalendarDays,
  CalendarDaysTrack,
  CalendarManualInput,
  CalendarMonthsTrack,
  CalendarPresets,
  CalendarSelectedDates,
  CalendarTimeWheel,
  CalendarToolbar,
  CalendarToolbarClear,
  CalendarToolbarHome,
  CalendarToolbarLabel,
  CalendarToolbarMonthLabel,
  CalendarToolbarMonthTrigger,
  CalendarToolbarNext,
  CalendarToolbarPrev,
  CalendarToolbarThemeToggle,
  CalendarToolbarTime,
  CalendarToolbarYearLabel,
  CalendarToolbarYearTrigger,
  CalendarYearsTrack,
} from "@dateforge/react-calendar/modules";
import {
  aurora,
  graphite,
  industrial,
  nebula,
  mint,
  riso,
  snow,
  temporal,
} from "@dateforge/react-calendar/themes";
import { airy, bubble, compact, loft, soft, square } from "@dateforge/react-calendar/appearances";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Code2,
  Eye,
  Layers3,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

type DemoMode = "single" | "range" | "multiple";
type DemoTab = "recipes" | "builder" | "gallery" | "code";
type PanelTab = "modules" | "props" | "theme" | "look" | "disabled" | "presets" | "code";
type ModuleKind =
  | "nav"
  | "days"
  | "selected"
  | "presets"
  | "manual"
  | "time"
  | "yearsTrack"
  | "monthsTrack"
  | "daysTrack";
type ThemeId = "auto" | "light" | "dark" | "custom" | keyof typeof themeObjects;
type AppearanceId = "default" | "custom" | keyof typeof appearanceObjects;
type PresetPackId = "none" | "basic" | "analytics" | "booking" | "sprint";

type DemoValue = Date | Date[] | { from: Date | null; to: Date | null } | null;

interface DemoModule {
  id: string;
  kind: ModuleKind;
  enabled: boolean;
  label: string;
  role: "navigation" | "interactive" | "display" | "hybrid";
  props?: Record<string, unknown>;
}

interface DemoState {
  tab: DemoTab;
  panelTab: PanelTab;
  recipeId: string;
  mode: DemoMode;
  modules: DemoModule[];
  value: DemoValue;
  themeId: ThemeId;
  appearanceId: AppearanceId;
  locale: string;
  timeZone: string;
  hour12: boolean;
  readOnly: boolean;
  gradient: boolean;
  minDate: string;
  maxDate: string;
  minRangeDays: number;
  maxRangeDays: number;
  maxDates: number;
  disabledPreset: "none" | "weekends" | "future90" | "blackout";
  presetPack: PresetPackId;
  customTheme: {
    highlight: string;
    accent: string;
    backdrop: string;
    text: string;
    stroke: string;
  };
  customAppearance: {
    radius: number;
    spacing: number;
    fontSize: number;
    dayRatio: string;
  };
  interactions: string[];
}

interface Recipe {
  id: string;
  short: string;
  title: string;
  useCase: string;
  mode: DemoMode;
  modules: DemoModule[];
  appearanceId?: AppearanceId;
  themeId?: ThemeId;
  presetPack?: PresetPackId;
  readOnly?: boolean;
  disabledPreset?: DemoState["disabledPreset"];
}

const themeObjects = {
  nebula,
  snow,
  temporal,
  mint,
  riso,
  aurora,
  graphite,
  industrial,
};

const appearanceObjects = {
  soft,
  compact,
  square,
  bubble,
  loft,
  airy,
};

const moduleMeta: Record<ModuleKind, Pick<DemoModule, "label" | "role">> = {
  nav: { label: "CalendarToolbar", role: "hybrid" },
  days: { label: "CalendarDays", role: "interactive" },
  selected: { label: "CalendarSelectedDates", role: "display" },
  presets: { label: "CalendarPresets", role: "interactive" },
  manual: { label: "CalendarManualInput", role: "interactive" },
  time: { label: "CalendarTimeWheel", role: "interactive" },
  yearsTrack: { label: "CalendarYearsTrack", role: "hybrid" },
  monthsTrack: { label: "CalendarMonthsTrack", role: "hybrid" },
  daysTrack: { label: "CalendarDaysTrack", role: "hybrid" },
};

const moduleGroups: { title: string; kinds: ModuleKind[] }[] = [
  { title: "Navigation", kinds: ["nav"] },
  { title: "Interactive", kinds: ["days", "manual", "time", "presets"] },
  { title: "Tracks", kinds: ["yearsTrack", "monthsTrack", "daysTrack"] },
  { title: "Display", kinds: ["selected"] },
];

let moduleIdSeq = 0;

const makeModule = (
  kind: ModuleKind,
  enabled = true,
  props: Record<string, unknown> = {},
): DemoModule => ({
  id: `${kind}-${moduleIdSeq++}`,
  kind,
  enabled,
  props,
  ...moduleMeta[kind],
});

const recipeModules = {
  basic: () => [
    makeModule("nav", true, { showMonthPicker: true, compactYears: true, clear: true }),
    makeModule("days"),
  ],
  range: () => [
    makeModule("nav", true, { showMonthPicker: true, compactYears: true, clear: true }),
    makeModule("days"),
    makeModule("selected", true, { allowClear: true, allowNavigate: true, animated: true }),
  ],
  multi: () => [
    makeModule("nav", true, { compactMonths: true, compactYears: true, clear: true }),
    makeModule("days"),
    makeModule("selected", true, { allowClear: true, animated: true }),
  ],
  dateTime: () => [
    makeModule("nav", true, { showTime: true, showMonthPicker: true, compactYears: true, clear: true }),
    makeModule("days"),
    makeModule("time", true, { seconds: false }),
    makeModule("selected", true, { showTime: true, allowClear: true }),
  ],
  manual: () => [
    makeModule("manual", true, { allowClear: true }),
    makeModule("nav", true, { showMonthPicker: true, compactYears: true }),
    makeModule("days"),
  ],
  tracks: () => [
    makeModule("yearsTrack"),
    makeModule("monthsTrack"),
    makeModule("daysTrack", true, { showMonthLabel: true }),
    makeModule("selected", true, { allowClear: true }),
  ],
  mobile: () => [
    makeModule("monthsTrack", true, { short: true }),
    makeModule("days"),
    makeModule("presets"),
    makeModule("selected", true, { allowClear: true }),
  ],
  readonly: () => [
    makeModule("nav", true, { monthLabel: true, yearLabel: true }),
    makeModule("days"),
    makeModule("selected", true, { allowNavigate: true, animated: true }),
  ],
};

const recipes: Recipe[] = [
  {
    id: "basic",
    short: "Basic",
    title: "Basic date picker",
    useCase: "Single date with month and year controls.",
    mode: "single",
    modules: recipeModules.basic(),
    themeId: "snow",
  },
  {
    id: "range",
    short: "Range",
    title: "Range picker",
    useCase: "Booking and report periods with visible feedback.",
    mode: "range",
    modules: recipeModules.range(),
    presetPack: "analytics",
    themeId: "temporal",
  },
  {
    id: "multi",
    short: "Multi",
    title: "Multiple dates with cap",
    useCase: "Meetings, delivery dates, shifts. Capped at three selections.",
    mode: "multiple",
    modules: recipeModules.multi(),
    appearanceId: "soft",
  },
  {
    id: "date-time",
    short: "Date + Time",
    title: "Date and time picker",
    useCase: "Appointments with committed date and time.",
    mode: "single",
    modules: recipeModules.dateTime(),
    themeId: "nebula",
    appearanceId: "loft",
  },
  {
    id: "manual",
    short: "Manual",
    title: "Manual input + grid",
    useCase: "Form-friendly entry with keyboard and tap selection.",
    mode: "single",
    modules: recipeModules.manual(),
    themeId: "mint",
  },
  {
    id: "tracks",
    short: "Tracks",
    title: "Track-driven picker",
    useCase: "Mobile drum-style date selection.",
    mode: "single",
    modules: recipeModules.tracks(),
    appearanceId: "bubble",
    themeId: "aurora",
  },
  {
    id: "mobile",
    short: "Compact",
    title: "Mobile compact booking",
    useCase: "Range picker optimized for a phone viewport.",
    mode: "range",
    modules: recipeModules.mobile(),
    appearanceId: "compact",
    disabledPreset: "weekends",
    presetPack: "booking",
  },
  {
    id: "readonly",
    short: "Read-only",
    title: "Read-only calendar",
    useCase: "Locked booking state or archive view.",
    mode: "single",
    modules: recipeModules.readonly(),
    readOnly: true,
    themeId: "graphite",
  },
];

const analyticsPresets: PresetEntry[] = [
  { label: "Today", value: 0 },
  { label: "Yesterday", value: -1 },
  { label: "Last 7 days", value: -6, range: 6 },
  { label: "Last 30 days", value: -29, range: 29 },
];

const bookingPresets: PresetEntry[] = [
  { label: "Tomorrow", value: 1 },
  { label: "Next 14 days", value: 1, range: 13 },
  { label: "Release week", value: 7, range: 6 },
];

const sprintPresets: PresetEntry[] = [
  { label: "Current sprint", value: 0, range: 13 },
  { label: "Next sprint", value: 14, range: 13 },
  { label: "Planning day", value: 2 },
];

const presetPacks: Record<PresetPackId, PresetEntry[]> = {
  none: [],
  basic: basicPresets,
  analytics: analyticsPresets,
  booking: bookingPresets,
  sprint: sprintPresets,
};

const firstRecipe = recipes[0];

const initialState: DemoState = {
  tab: "recipes",
  panelTab: "modules",
  recipeId: firstRecipe.id,
  mode: firstRecipe.mode,
  modules: firstRecipe.modules,
  value: null,
  themeId: firstRecipe.themeId ?? "auto",
  appearanceId: firstRecipe.appearanceId ?? "default",
  locale: "en",
  timeZone: "auto",
  hour12: false,
  readOnly: false,
  gradient: false,
  minDate: "",
  maxDate: "",
  minRangeDays: 2,
  maxRangeDays: 14,
  maxDates: 3,
  disabledPreset: "none",
  presetPack: "basic",
  customTheme: {
    highlight: "#2563eb",
    accent: "#ffffff",
    backdrop: "#f8fafc",
    text: "#0f172a",
    stroke: "#dbe3ef",
  },
  customAppearance: {
    radius: 8,
    spacing: 0.6,
    fontSize: 14,
    dayRatio: "1 / 1",
  },
  interactions: ["Loaded Basic recipe"],
};

export function DemoPage() {
  const [state, setState] = useState<DemoState>(initialState);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const theme = useMemo(() => {
    if (state.themeId === "custom") return createTheme(state.customTheme);
    if (state.themeId === "auto" || state.themeId === "light" || state.themeId === "dark") return state.themeId;
    return themeObjects[state.themeId];
  }, [state.themeId, state.customTheme]);

  const appearance = useMemo(() => {
    if (state.appearanceId === "custom") {
      return createAppearance({
        radius: `${state.customAppearance.radius}px`,
        containerRadius: `${state.customAppearance.radius + 2}px`,
        spacing: `${state.customAppearance.spacing}em`,
        fontSize: `${state.customAppearance.fontSize}px`,
        dayRatio: state.customAppearance.dayRatio,
      });
    }
    if (state.appearanceId === "default") return undefined;
    return appearanceObjects[state.appearanceId];
  }, [state.appearanceId, state.customAppearance]);

  const disabled = useMemo(() => {
    const today = startOfDay(new Date());
    if (state.disabledPreset === "weekends") return createDisabled({ weekends: true });
    if (state.disabledPreset === "future90") {
      const after = addDays(today, 90);
      return createDisabled({ before: today, after });
    }
    if (state.disabledPreset === "blackout") {
      return createDisabled({
        weekends: true,
        ranges: [{ from: addDays(today, 18), to: addDays(today, 22) }],
        dates: [addDays(today, 9)],
      });
    }
    return undefined;
  }, [state.disabledPreset]);

  const presets = useMemo(() => presetPacks[state.presetPack], [state.presetPack]);
  const code = useMemo(() => generateCode(state), [state]);
  const activeRecipe = recipes.find((recipe) => recipe.id === state.recipeId) ?? firstRecipe;
  const safetyHints = getSafetyHints(state);

  const patch = (next: Partial<DemoState>, event?: string) => {
    setState((current) => ({
      ...current,
      ...next,
      interactions: event ? [event, ...current.interactions].slice(0, 7) : current.interactions,
    }));
  };

  const applyRecipe = (recipe: Recipe) => {
    patch(
      {
        recipeId: recipe.id,
        mode: recipe.mode,
        modules: recipe.modules.map((module) => ({ ...module })),
        value: recipe.readOnly ? new Date(2026, 4, 12) : null,
        appearanceId: recipe.appearanceId ?? "default",
        themeId: recipe.themeId ?? state.themeId,
        presetPack: recipe.presetPack ?? "basic",
        readOnly: recipe.readOnly ?? false,
        disabledPreset: recipe.disabledPreset ?? "none",
      },
      `Applied ${recipe.short} recipe`,
    );
  };

  const setMode = (mode: DemoMode) => {
    patch({ mode, value: emptyValue(mode) }, `Mode changed to ${mode}`);
  };

  const toggleModule = (kind: ModuleKind) => {
    const exists = state.modules.find((module) => module.kind === kind);
    const modules = exists
      ? state.modules.map((module) =>
          module.kind === kind ? { ...module, enabled: !module.enabled } : module,
        )
      : [...state.modules, makeModule(kind)];
    patch({ modules }, `${moduleMeta[kind].label} toggled`);
  };

  const moveModule = (id: string, direction: -1 | 1) => {
    const index = state.modules.findIndex((module) => module.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= state.modules.length) return;
    const modules = [...state.modules];
    const [module] = modules.splice(index, 1);
    modules.splice(nextIndex, 0, module);
    patch({ modules }, `${module.label} reordered`);
  };

  const onCalendarChange = (value: DemoValue) => {
    patch({ value }, "Calendar value changed");
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f4] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col lg:grid lg:grid-cols-[300px_minmax(0,1fr)_400px]">
        <aside className="hidden border-r border-zinc-200 bg-white/70 px-4 py-5 lg:block">
          <BrandBlock />
          <RecipeList activeId={state.recipeId} onApply={applyRecipe} />
          <div className="mt-5">
            <ModulePalette state={state} onToggle={toggleModule} onMove={moveModule} compact={false} />
          </div>
        </aside>

        <section className="min-w-0">
          <TopBar state={state} onTab={(tab) => patch({ tab }, `Opened ${tab}`)} />
          <div className="hidden items-center justify-between border-b border-zinc-200 bg-white/65 px-8 py-4 lg:flex">
            <div>
              <div className="font-semibold">Interactive builder</div>
              <div className="text-sm text-zinc-500">Recipes, live preview, controls, and code stay in sync.</div>
            </div>
            <Segmented
              value={state.tab}
              options={[
                ["recipes", "Recipes"],
                ["builder", "Builder"],
                ["gallery", "Gallery"],
                ["code", "Code"],
              ]}
              onChange={(value) => patch({ tab: value as DemoTab }, `Opened ${value}`)}
            />
          </div>
          <div className="sticky top-0 z-20 border-b border-zinc-200 bg-[#f7f7f4]/95 px-3 py-3 backdrop-blur lg:static lg:border-b-0 lg:px-8 lg:pt-8">
            <LivePreview
              state={state}
              theme={theme}
              appearance={appearance}
              disabled={disabled}
              presets={presets}
              onChange={onCalendarChange}
            />
            <StatusBar state={state} />
            <RecipeRail activeId={state.recipeId} onApply={applyRecipe} />
          </div>

          <div className="px-3 pb-40 pt-4 lg:px-8 lg:pb-10">
            {state.tab === "recipes" && <RecipeGallery activeId={state.recipeId} onApply={applyRecipe} />}
            {state.tab === "builder" && (
              <div className="space-y-4">
                <SectionTitle icon={<Layers3 size={18} />} title="Module Builder" kicker={activeRecipe.title} />
                <ModulePalette state={state} onToggle={toggleModule} onMove={moveModule} compact={false} />
                <SafetyHints hints={safetyHints} />
              </div>
            )}
            {state.tab === "gallery" && <Gallery state={state} patch={patch} />}
            {state.tab === "code" && <CodePanel code={code} copied={copied} onCopy={copyCode} />}
          </div>
        </section>

        <aside className="hidden border-l border-zinc-200 bg-white/80 px-4 py-5 lg:block">
          <div className="sticky top-5 space-y-4">
            <PanelTabs active={state.panelTab} onChange={(panelTab) => patch({ panelTab })} />
            <PanelContent
              state={state}
              patch={patch}
              setMode={setMode}
              toggleModule={toggleModule}
              moveModule={moveModule}
              hints={safetyHints}
            />
            <CodePanel code={code} copied={copied} onCopy={copyCode} compact />
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.12)] lg:hidden">
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2 text-sm font-medium"
          onClick={() => setSheetOpen((open) => !open)}
        >
          {sheetOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          Builder controls
        </button>
        <PanelTabs active={state.panelTab} onChange={(panelTab) => patch({ panelTab })} />
        {sheetOpen && (
          <div className="max-h-[52vh] overflow-y-auto px-3 pb-4 pt-3">
            <PanelContent
              state={state}
              patch={patch}
              setMode={setMode}
              toggleModule={toggleModule}
              moveModule={moveModule}
              hints={safetyHints}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function BrandBlock() {
  return (
    <div className="mb-5">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <ArrowLeft size={16} />
        DateForge
      </Link>
      <p className="mt-1 text-sm leading-5 text-zinc-500">Composable calendar lab for React products.</p>
      <Link href="/examples" className="mt-3 inline-flex text-sm font-medium text-zinc-500 hover:text-zinc-950">
        View examples
      </Link>
    </div>
  );
}

function TopBar({ state, onTab }: { state: DemoState; onTab: (tab: DemoTab) => void }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-white/75 px-3 py-3 backdrop-blur lg:hidden">
      <div className="min-w-0">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles size={17} />
          DateForge
        </Link>
        <div className="truncate text-xs text-zinc-500">interactive calendar builder</div>
      </div>
      <Segmented
        value={state.tab}
        options={[
          ["recipes", "Recipes"],
          ["builder", "Builder"],
          ["gallery", "Gallery"],
          ["code", "Code"],
        ]}
        onChange={(value) => onTab(value as DemoTab)}
      />
    </header>
  );
}

function LivePreview({
  state,
  theme,
  appearance,
  disabled,
  presets,
  onChange,
}: {
  state: DemoState;
  theme: unknown;
  appearance: unknown;
  disabled: unknown;
  presets: PresetEntry[];
  onChange: (value: DemoValue) => void;
}) {
  return (
    <div className="mx-auto max-w-[520px] lg:max-w-[620px]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <SectionTitle icon={<Eye size={18} />} title="Live Preview" kicker="touch the calendar" />
        <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600">
          {state.mode}
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 shadow-sm sm:p-4">
        <Calendar
          mode={state.mode as never}
          value={state.value as never}
          onChange={onChange as never}
          theme={theme as never}
          appearance={appearance as never}
          disabled={disabled as never}
          locale={state.locale}
          timeZone={state.timeZone === "auto" ? undefined : state.timeZone}
          hour12={state.hour12}
          readOnly={state.readOnly}
          gradient={state.gradient}
          minDate={dateFromInput(state.minDate)}
          maxDate={dateFromInput(state.maxDate)}
          minRangeDays={state.mode === "range" ? state.minRangeDays : undefined}
          maxRangeDays={state.mode === "range" ? state.maxRangeDays : undefined}
          maxDates={state.mode === "multiple" ? state.maxDates : undefined}
          width="100%"
        >
          {state.modules
            .filter((module) => module.enabled)
            .map((module) => renderCalendarModule(module, presets))}
        </Calendar>
      </div>
    </div>
  );
}

function renderCalendarModule(module: DemoModule, presets: PresetEntry[]) {
  const props = module.props ?? {};
  if (module.kind === "nav") return (
    <CalendarToolbar key={module.id}>
      <CalendarToolbarPrev />
      <CalendarToolbarMonthTrigger />
      <CalendarToolbarNext />
      <CalendarToolbarYearTrigger compact />
    </CalendarToolbar>
  );
  if (module.kind === "days") return <CalendarDays key={module.id} {...props} />;
  if (module.kind === "selected") return <CalendarSelectedDates key={module.id} {...props} />;
  if (module.kind === "presets") return <CalendarPresets key={module.id} presets={presets} {...props} />;
  if (module.kind === "manual") return <CalendarManualInput key={module.id} {...props} />;
  if (module.kind === "time") return <CalendarTimeWheel key={module.id} {...props} />;
  if (module.kind === "yearsTrack") return <CalendarYearsTrack key={module.id} {...props} />;
  if (module.kind === "monthsTrack") return <CalendarMonthsTrack key={module.id} {...props} />;
  return <CalendarDaysTrack key={module.id} {...props} />;
}

function StatusBar({ state }: { state: DemoState }) {
  return (
    <div className="mx-auto mt-2 grid max-w-[620px] grid-cols-2 gap-2 text-xs sm:grid-cols-4">
      <StatusItem label="value" value={formatValue(state.value)} />
      <StatusItem label="theme" value={state.themeId} />
      <StatusItem label="look" value={state.appearanceId} />
      <StatusItem label="events" value={state.interactions[0] ?? "ready"} />
    </div>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-zinc-200 bg-white px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="truncate font-medium text-zinc-700">{value}</div>
    </div>
  );
}

function RecipeRail({ activeId, onApply }: { activeId: string; onApply: (recipe: Recipe) => void }) {
  return (
    <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:hidden">
      {recipes.map((recipe) => (
        <button
          type="button"
          key={recipe.id}
          onClick={() => onApply(recipe)}
          className={`h-10 shrink-0 rounded-md border px-3 text-sm font-medium ${
            activeId === recipe.id
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-200 bg-white text-zinc-700"
          }`}
        >
          {recipe.short}
        </button>
      ))}
    </div>
  );
}

function RecipeList({ activeId, onApply }: { activeId: string; onApply: (recipe: Recipe) => void }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Recipes</div>
      {recipes.map((recipe) => (
        <button
          key={recipe.id}
          type="button"
          onClick={() => onApply(recipe)}
          className={`w-full rounded-lg border p-3 text-left transition ${
            activeId === recipe.id
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-200 bg-white hover:border-zinc-300"
          }`}
        >
          <div className="font-medium">{recipe.title}</div>
          <div className={`mt-1 text-xs leading-4 ${activeId === recipe.id ? "text-zinc-300" : "text-zinc-500"}`}>
            {recipe.useCase}
          </div>
        </button>
      ))}
    </div>
  );
}

function RecipeGallery({ activeId, onApply }: { activeId: string; onApply: (recipe: Recipe) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle icon={<Sparkles size={18} />} title="Recipe Gallery" kicker="ready compositions" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <button
            type="button"
            key={recipe.id}
            onClick={() => onApply(recipe)}
            className={`rounded-lg border bg-white p-4 text-left shadow-sm transition ${
              activeId === recipe.id ? "border-zinc-950 ring-2 ring-zinc-950/10" : "border-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">{recipe.title}</div>
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium">{recipe.mode}</span>
            </div>
            <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-500">{recipe.useCase}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recipe.modules.map((module) => (
                <span key={module.id} className="rounded bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600">
                  {module.label.replace("Calendar", "")}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModulePalette({
  state,
  onToggle,
  onMove,
  compact,
}: {
  state: DemoState;
  onToggle: (kind: ModuleKind) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  compact: boolean;
}) {
  return (
    <div className="space-y-3">
      {moduleGroups.map((group) => (
        <div key={group.title} className="rounded-lg border border-zinc-200 bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">{group.title}</div>
          <div className="space-y-2">
            {group.kinds.map((kind) => {
              const demoModule = state.modules.find((item) => item.kind === kind);
              const enabled = demoModule?.enabled ?? false;
              return (
                <div key={kind} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggle(kind)}
                    className={`h-9 flex-1 rounded-md border px-2 text-left text-sm font-medium ${
                      enabled ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <span className="block truncate">{moduleMeta[kind].label}</span>
                  </button>
                  {!compact && demoModule && (
                    <>
                      <button
                        type="button"
                        className="grid size-9 place-items-center rounded-md border border-zinc-200 bg-white"
                        onClick={() => onMove(demoModule.id, -1)}
                        aria-label="Move module up"
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        type="button"
                        className="grid size-9 place-items-center rounded-md border border-zinc-200 bg-white"
                        onClick={() => onMove(demoModule.id, 1)}
                        aria-label="Move module down"
                      >
                        <ChevronDown size={15} />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelTabs({ active, onChange }: { active: PanelTab; onChange: (tab: PanelTab) => void }) {
  const tabs: [PanelTab, string][] = [
    ["modules", "Modules"],
    ["props", "Props"],
    ["theme", "Theme"],
    ["look", "Look"],
    ["disabled", "Disabled"],
    ["presets", "Presets"],
    ["code", "Code"],
  ];
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-zinc-200 px-2 py-2 lg:flex-wrap lg:border lg:bg-white lg:p-1">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`h-9 shrink-0 rounded-md px-3 text-sm font-medium ${
            active === id ? "bg-zinc-950 text-white" : "bg-transparent text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function PanelContent({
  state,
  patch,
  setMode,
  toggleModule,
  moveModule,
  hints,
}: {
  state: DemoState;
  patch: (next: Partial<DemoState>, event?: string) => void;
  setMode: (mode: DemoMode) => void;
  toggleModule: (kind: ModuleKind) => void;
  moveModule: (id: string, direction: -1 | 1) => void;
  hints: string[];
}) {
  if (state.panelTab === "modules") {
    return (
      <div className="space-y-3">
        <ModulePalette state={state} onToggle={toggleModule} onMove={moveModule} compact={false} />
        <SafetyHints hints={hints} />
      </div>
    );
  }
  if (state.panelTab === "props") return <PropsLab state={state} patch={patch} setMode={setMode} />;
  if (state.panelTab === "theme") return <ThemeLab state={state} patch={patch} />;
  if (state.panelTab === "look") return <AppearanceLab state={state} patch={patch} />;
  if (state.panelTab === "disabled") return <DisabledLab state={state} patch={patch} />;
  if (state.panelTab === "presets") return <PresetsLab state={state} patch={patch} />;
  return <CodePanel code={generateCode(state)} copied={false} onCopy={() => navigator.clipboard.writeText(generateCode(state))} />;
}

function PropsLab({
  state,
  patch,
  setMode,
}: {
  state: DemoState;
  patch: (next: Partial<DemoState>, event?: string) => void;
  setMode: (mode: DemoMode) => void;
}) {
  return (
    <PanelCard title="Calendar Props" icon={<SlidersHorizontal size={16} />}>
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Mode</div>
      <Segmented
        value={state.mode}
        options={[
          ["single", "Single"],
          ["range", "Range"],
          ["multiple", "Multi"],
        ]}
        onChange={(value) => setMode(value as DemoMode)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Toggle label="Read only" checked={state.readOnly} onChange={(readOnly) => patch({ readOnly }, "Read-only toggled")} />
        <Toggle label="Gradient" checked={state.gradient} onChange={(gradient) => patch({ gradient }, "Gradient toggled")} />
      </div>
      <ControlRow label="Locale">
        <Select value={state.locale} onChange={(locale) => patch({ locale }, `Locale changed to ${locale}`)}>
          {["en", "ru-RU", "de-DE", "fr-FR", "ja-JP", "ar-EG"].map((locale) => (
            <option key={locale}>{locale}</option>
          ))}
        </Select>
      </ControlRow>
      <ControlRow label="Timezone">
        <Select value={state.timeZone} onChange={(timeZone) => patch({ timeZone }, `Timezone changed`)}>
          {["auto", "UTC", "Europe/Belgrade", "America/New_York", "Asia/Tokyo"].map((zone) => (
            <option key={zone}>{zone}</option>
          ))}
        </Select>
      </ControlRow>
      <Toggle label="12-hour time" checked={state.hour12} onChange={(hour12) => patch({ hour12 }, "Time format changed")} />
      <div className="grid grid-cols-2 gap-2">
        <ControlRow label="Min date">
          <Input type="date" value={state.minDate} onChange={(minDate) => patch({ minDate }, "Min date changed")} />
        </ControlRow>
        <ControlRow label="Max date">
          <Input type="date" value={state.maxDate} onChange={(maxDate) => patch({ maxDate }, "Max date changed")} />
        </ControlRow>
      </div>
      {state.mode === "range" && (
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="Min range" value={state.minRangeDays} onChange={(minRangeDays) => patch({ minRangeDays })} />
          <NumberInput label="Max range" value={state.maxRangeDays} onChange={(maxRangeDays) => patch({ maxRangeDays })} />
        </div>
      )}
      {state.mode === "multiple" && (
        <NumberInput label="Max dates" value={state.maxDates} onChange={(maxDates) => patch({ maxDates })} />
      )}
      <ValueInspector state={state} />
    </PanelCard>
  );
}

function ThemeLab({ state, patch }: { state: DemoState; patch: (next: Partial<DemoState>, event?: string) => void }) {
  const themeOptions: ThemeId[] = ["auto", "light", "dark", "nebula", "snow", "temporal", "mint", "riso", "aurora", "graphite", "industrial", "custom"];
  return (
    <PanelCard title="Theme Lab" icon={<Palette size={16} />}>
      <div className="grid grid-cols-3 gap-2">
        {themeOptions.map((themeId) => (
          <button
            key={themeId}
            type="button"
            onClick={() => patch({ themeId }, `Theme changed to ${themeId}`)}
            className={`h-10 rounded-md border text-sm font-medium ${
              state.themeId === themeId ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-zinc-50"
            }`}
          >
            {themeId}
          </button>
        ))}
      </div>
      {state.themeId === "custom" && (
        <div className="space-y-2">
          {Object.entries(state.customTheme).map(([key, value]) => (
            <ControlRow key={key} label={key}>
              <input
                type="color"
                value={value}
                onChange={(event) =>
                  patch({
                    customTheme: { ...state.customTheme, [key]: event.target.value },
                  })
                }
                className="h-9 w-full rounded-md border border-zinc-200 bg-white"
              />
            </ControlRow>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

function AppearanceLab({ state, patch }: { state: DemoState; patch: (next: Partial<DemoState>, event?: string) => void }) {
  const options: AppearanceId[] = ["default", "soft", "compact", "square", "bubble", "loft", "airy", "custom"];
  return (
    <PanelCard title="Appearance Lab" icon={<SlidersHorizontal size={16} />}>
      <div className="grid grid-cols-3 gap-2">
        {options.map((appearanceId) => (
          <button
            key={appearanceId}
            type="button"
            onClick={() => patch({ appearanceId }, `Appearance changed to ${appearanceId}`)}
            className={`h-10 rounded-md border text-sm font-medium ${
              state.appearanceId === appearanceId ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-zinc-50"
            }`}
          >
            {appearanceId}
          </button>
        ))}
      </div>
      {state.appearanceId === "custom" && (
        <div className="space-y-3">
          <Range label="Radius" value={state.customAppearance.radius} min={0} max={24} onChange={(radius) => patch({ customAppearance: { ...state.customAppearance, radius } })} />
          <Range label="Spacing" value={state.customAppearance.spacing} min={0.2} max={1.2} step={0.05} onChange={(spacing) => patch({ customAppearance: { ...state.customAppearance, spacing } })} />
          <Range label="Font size" value={state.customAppearance.fontSize} min={11} max={18} onChange={(fontSize) => patch({ customAppearance: { ...state.customAppearance, fontSize } })} />
          <ControlRow label="Day ratio">
            <Select value={state.customAppearance.dayRatio} onChange={(dayRatio) => patch({ customAppearance: { ...state.customAppearance, dayRatio } })}>
              {["1 / 1", "1 / 0.85", "1 / 0.75"].map((ratio) => (
                <option key={ratio}>{ratio}</option>
              ))}
            </Select>
          </ControlRow>
        </div>
      )}
    </PanelCard>
  );
}

function DisabledLab({ state, patch }: { state: DemoState; patch: (next: Partial<DemoState>, event?: string) => void }) {
  return (
    <PanelCard title="Disabled Rules" icon={<RotateCcw size={16} />}>
      <Segmented
        value={state.disabledPreset}
        options={[
          ["none", "None"],
          ["weekends", "Weekends"],
          ["future90", "90 days"],
          ["blackout", "Blackout"],
        ]}
        onChange={(disabledPreset) => patch({ disabledPreset: disabledPreset as DemoState["disabledPreset"] }, "Disabled preset changed")}
      />
      <p className="text-sm leading-5 text-zinc-500">
        Rules are generated through <code className="rounded bg-zinc-100 px-1">createDisabled</code> and reflected in the copyable snippet.
      </p>
    </PanelCard>
  );
}

function PresetsLab({ state, patch }: { state: DemoState; patch: (next: Partial<DemoState>, event?: string) => void }) {
  return (
    <PanelCard title="Presets Lab" icon={<Sparkles size={16} />}>
      <Segmented
        value={state.presetPack}
        options={[
          ["none", "None"],
          ["basic", "Basic"],
          ["analytics", "Analytics"],
          ["booking", "Booking"],
          ["sprint", "Sprint"],
        ]}
        onChange={(presetPack) => patch({ presetPack: presetPack as PresetPackId }, "Preset pack changed")}
      />
      <p className="text-sm leading-5 text-zinc-500">
        Range presets render only when the calendar is in range mode; single-date presets remain available across modes.
      </p>
    </PanelCard>
  );
}

function Gallery({ state, patch }: { state: DemoState; patch: (next: Partial<DemoState>, event?: string) => void }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={<Palette size={18} />} title="Gallery Matrix" kicker="quick visual combinations" />
      <div>
        <div className="mb-2 text-sm font-semibold">Themes</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(themeObjects) as ThemeId[]).map((themeId) => (
            <button
              key={themeId}
              type="button"
              onClick={() => patch({ themeId }, `Theme changed to ${themeId}`)}
              className={`rounded-lg border bg-white p-3 text-left text-sm font-medium ${
                state.themeId === themeId ? "border-zinc-950" : "border-zinc-200"
              }`}
            >
              <span className="block h-2 rounded bg-zinc-950" />
              <span className="mt-2 block">{themeId}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-semibold">Appearances</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(["default", ...Object.keys(appearanceObjects)] as AppearanceId[]).map((appearanceId) => (
            <button
              key={appearanceId}
              type="button"
              onClick={() => patch({ appearanceId }, `Appearance changed to ${appearanceId}`)}
              className={`rounded-lg border bg-white p-3 text-left text-sm font-medium ${
                state.appearanceId === appearanceId ? "border-zinc-950" : "border-zinc-200"
              }`}
            >
              {appearanceId}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodePanel({
  code,
  copied,
  onCopy,
  compact = false,
}: {
  code: string;
  copied: boolean;
  onCopy: () => void;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 text-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Code2 size={16} />
          Component snippet
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="flex h-8 items-center gap-1 rounded-md bg-white px-2 text-xs font-semibold text-zinc-950"
        >
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={`overflow-x-auto p-3 text-xs leading-5 text-zinc-100 ${compact ? "max-h-72" : "max-h-[520px]"}`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ValueInspector({ state }: { state: DemoState }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Value inspector</div>
      <div className="text-sm font-medium text-zinc-800">{formatValue(state.value)}</div>
      <div className="mt-2 space-y-1 text-xs text-zinc-500">
        {state.interactions.slice(0, 4).map((event) => (
          <div key={event} className="truncate">
            {event}
          </div>
        ))}
      </div>
    </div>
  );
}

function SafetyHints({ hints }: { hints: string[] }) {
  if (!hints.length) return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900">
      {hints.map((hint) => (
        <div key={hint}>{hint}</div>
      ))}
    </div>
  );
}

function PanelCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 font-semibold">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title, kicker }: { icon: React.ReactNode; title: string; kicker: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 font-semibold">
        {icon}
        {title}
      </div>
      <div className="truncate text-xs text-zinc-500">{kicker}</div>
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex rounded-md border border-zinc-200 bg-zinc-100 p-1">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`h-8 rounded px-2 text-xs font-semibold sm:px-3 ${
            value === id ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex h-10 items-center justify-between gap-3 rounded-md border px-3 text-sm font-medium ${
        checked ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className={`h-4 w-7 rounded-full ${checked ? "bg-white/80" : "bg-zinc-300"}`} />
    </button>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm font-medium"
    >
      {children}
    </select>
  );
}

function Input({ type, value, onChange }: { type: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm font-medium"
    />
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <ControlRow label={label}>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm font-medium"
      />
    </ControlRow>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <ControlRow label={`${label}: ${value}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-zinc-950"
      />
    </ControlRow>
  );
}

function getSafetyHints(state: DemoState) {
  const enabled = state.modules.filter((module) => module.enabled).map((module) => module.kind);
  const hints: string[] = [];
  const hasInteractive = enabled.some((kind) => ["days", "manual", "time", "presets", "daysTrack"].includes(kind));
  if (enabled.includes("selected") && !hasInteractive) hints.push("SelectedDates can display value, but no enabled module commits a date.");
  if (enabled.includes("presets") && state.presetPack === "none") hints.push("CalendarPresets is enabled, but the preset pack is empty.");
  if (enabled.includes("time") && state.mode !== "single") hints.push("TimeGrid is clearest in single mode; range/multiple time can feel pending.");
  return hints;
}

function generateCode(state: DemoState) {
  const modules = state.modules.filter((module) => module.enabled);
  const moduleImports = modules.map((module) => moduleMeta[module.kind].label);
  const imports = [
    `import { useMemo, useState } from "react";`,
    `import { Calendar${state.themeId === "custom" ? ", createTheme" : ""}${state.appearanceId === "custom" ? ", createAppearance" : ""}${state.disabledPreset !== "none" ? ", createDisabled" : ""}${state.presetPack === "basic" ? ", basicPresets" : ""} } from "@dateforge/react-calendar";`,
    `import { ${Array.from(new Set(moduleImports)).join(", ")} } from "@dateforge/react-calendar/modules";`,
  ];
  if (!["auto", "light", "dark", "custom"].includes(state.themeId)) {
    imports.push(`import { ${state.themeId} } from "@dateforge/react-calendar/themes";`);
  }
  if (!["default", "custom"].includes(state.appearanceId)) {
    imports.push(`import { ${state.appearanceId} } from "@dateforge/react-calendar/appearances";`);
  }

  const valueType =
    state.mode === "range"
      ? `{ from: Date | null; to: Date | null }`
      : state.mode === "multiple"
        ? `Date[]`
        : `Date | null`;
  const initial = state.mode === "range" ? `{ from: null, to: null }` : state.mode === "multiple" ? `[]` : `null`;
  const config: string[] = [];
  if (state.themeId === "custom") config.push(`  const theme = useMemo(() => createTheme(${JSON.stringify(state.customTheme, null, 2).replace(/\n/g, "\n  ")}), []);`);
  if (state.appearanceId === "custom") {
    config.push(
      `  const appearance = useMemo(() => createAppearance({ radius: "${state.customAppearance.radius}px", spacing: "${state.customAppearance.spacing}em", fontSize: "${state.customAppearance.fontSize}px", dayRatio: "${state.customAppearance.dayRatio}" }), []);`,
    );
  }
  if (state.disabledPreset !== "none") config.push(`  const disabled = useMemo(() => ${disabledCode(state.disabledPreset)}, []);`);
  if (!["none", "basic"].includes(state.presetPack)) config.push(`  const presets = useMemo(() => ${presetCode(state.presetPack)}, []);`);

  const calendarProps = [
    `mode="${state.mode}"`,
    `value={value}`,
    `onChange={setValue}`,
    state.themeId === "custom" ? `theme={theme}` : state.themeId === "auto" ? "" : `theme={${state.themeId === "light" || state.themeId === "dark" ? `"${state.themeId}"` : state.themeId}}`,
    state.appearanceId === "custom" ? `appearance={appearance}` : state.appearanceId === "default" ? "" : `appearance={${state.appearanceId}}`,
    state.disabledPreset !== "none" ? `disabled={disabled}` : "",
    state.locale !== "en" ? `locale="${state.locale}"` : "",
    state.readOnly ? `readOnly` : "",
    state.gradient ? `gradient` : "",
  ].filter(Boolean);

  const jsx = modules
    .map((module) => `      ${moduleCode(module, state.presetPack)}`)
    .join("\n");

  return `${imports.join("\n")}

export function DateForgeDemo() {
  const [value, setValue] = useState<${valueType}>(${initial});
${config.length ? `${config.join("\n")}\n` : ""}
  return (
    <Calendar
${calendarProps.map((prop) => `      ${prop}`).join("\n")}
    >
${jsx}
    </Calendar>
  );
}`;
}

function moduleCode(module: DemoModule, presetPack: PresetPackId) {
  if (module.kind === "nav") return `<CalendarToolbar>\n        <CalendarToolbarPrev />\n        <CalendarToolbarMonthTrigger />\n        <CalendarToolbarYearTrigger compact />\n        <CalendarToolbarNext />\n      </CalendarToolbar>`;
  if (module.kind === "days") return `<CalendarDays />`;
  if (module.kind === "selected") return `<CalendarSelectedDates allowClear allowNavigate animated />`;
  if (module.kind === "presets") {
    const value = presetPack === "basic" ? "basicPresets" : presetPack === "none" ? "[]" : "presets";
    return `<CalendarPresets presets={${value}} />`;
  }
  if (module.kind === "manual") return `<CalendarManualInput allowClear />`;
  if (module.kind === "time") return `<CalendarTimeWheel />`;
  if (module.kind === "yearsTrack") return `<CalendarYearsTrack />`;
  if (module.kind === "monthsTrack") return `<CalendarMonthsTrack />`;
  return `<CalendarDaysTrack showMonthLabel />`;
}

function disabledCode(preset: DemoState["disabledPreset"]) {
  if (preset === "weekends") return `createDisabled({ weekends: true })`;
  if (preset === "future90") return `createDisabled({ before: new Date(), after: new Date(Date.now() + 90 * 86400000) })`;
  return `createDisabled({ weekends: true, ranges: [{ from: new Date("2026-06-10"), to: new Date("2026-06-14") }] })`;
}

function presetCode(pack: PresetPackId) {
  if (pack === "analytics") return `[
    { label: "Today", value: 0 },
    { label: "Last 7 days", value: -6, range: 6 },
    { label: "Last 30 days", value: -29, range: 29 },
  ]`;
  if (pack === "booking") return `[
    { label: "Tomorrow", value: 1 },
    { label: "Next 14 days", value: 1, range: 13 },
  ]`;
  return `[
    { label: "Current sprint", value: 0, range: 13 },
    { label: "Next sprint", value: 14, range: 13 },
  ]`;
}

function formatValue(value: DemoValue) {
  if (!value) return "null";
  if (value instanceof Date) return formatDate(value);
  if (Array.isArray(value)) return value.length ? value.map(formatDate).join(", ") : "[]";
  return `${value.from ? formatDate(value.from) : "from?"} -> ${value.to ? formatDate(value.to) : "to?"}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function emptyValue(mode: DemoMode): DemoValue {
  if (mode === "range") return { from: null, to: null };
  if (mode === "multiple") return [];
  return null;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dateFromInput(value: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
