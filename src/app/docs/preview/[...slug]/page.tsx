"use client";

import { notFound, useParams } from "next/navigation";
import {
  MODULE_NAMES,
  ModuleCalendar,
  MultiMonthCalendar,
  PREBUILT_NAMES,
  PrebuiltCalendar,
  QuickStartCalendar,
  RecipeCalendar,
  recipeSlug,
  type ModuleName,
  type PrebuiltName,
  type RecipeKind,
} from "../../showcases";

const RECIPE_KINDS: RecipeKind[] = [
  "Minimal single date",
  "Booking range",
  "Analytics range with presets",
  "Date and time",
  "Mobile tracks",
  "Bubble appearance",
  "Custom theme",
  "Monsoon theme",
  "Disabled dates example",
  "Holiday presets example",
];

export default function PreviewPage() {
  const params = useParams<{ slug: string[] }>();
  const slug = params.slug ?? [];

  const calendar = resolveCalendar(slug);
  if (!calendar) notFound();

  const wide =
    slug[0] === "multi-month" ||
    (slug[0] === "prebuilt" && slug[1] === "MultiMonthCalendar");

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div
        className={
          wide
            ? "w-full max-w-5xl overflow-x-auto"
            : "w-full max-w-[360px]"
        }
      >
        {calendar}
      </div>
    </main>
  );
}

function resolveCalendar(slug: string[]): React.ReactNode | null {
  if (slug.length === 1) {
    if (slug[0] === "quick-start") return <QuickStartCalendar />;
    if (slug[0] === "multi-month") return <MultiMonthCalendar />;
    return null;
  }

  if (slug.length === 2 && slug[0] === "prebuilt") {
    const name = slug[1] as PrebuiltName;
    if (!PREBUILT_NAMES.includes(name)) return null;
    return <PrebuiltCalendar name={name} />;
  }

  if (slug.length === 2 && slug[0] === "module") {
    const name = slug[1] as ModuleName;
    if (!MODULE_NAMES.includes(name)) return null;
    return <ModuleCalendar moduleName={name} />;
  }

  if (slug.length === 2 && slug[0] === "recipe") {
    const kind = RECIPE_KINDS.find((entry) => recipeSlug(entry) === slug[1]);
    if (!kind) return null;
    return <RecipeCalendar kind={kind} />;
  }

  return null;
}
