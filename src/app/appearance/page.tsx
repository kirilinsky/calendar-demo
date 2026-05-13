import type { Metadata } from "next";
import { SiteHeader } from "@/app/SiteHeader";
import { AppearanceClient } from "./AppearanceClient";

export const metadata: Metadata = {
  title: "Appearance — DateForge",
  description: "Explore and preview DateForge calendar appearances.",
};

export default function AppearancePage() {
  return (
    <main className="min-h-[100dvh] bg-[#fbfbfd] text-zinc-950 flex flex-col">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
        <SiteHeader />
        <AppearanceClient />
      </div>
    </main>
  );
}
