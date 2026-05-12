import type { Metadata } from "next";
import { SiteHeader } from "@/app/SiteHeader";
import { ThemesClient } from "./ThemesClient";

export const metadata: Metadata = {
  title: "Themes — DateForge",
  description: "Explore and preview all DateForge calendar themes.",
};

export default function ThemesPage() {
  return (
    <main className="min-h-[100dvh] bg-[#fbfbfd] text-zinc-950 flex flex-col">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
        <SiteHeader />
        <ThemesClient />
      </div>
    </main>
  );
}
