import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Examples",
  description:
    "Live DateForge calendar recipes for booking, scheduling, dashboards, forms, read-only views, presets, tracks, themes, and time selection.",
  openGraph: {
    title: "DateForge React Calendar Examples",
    description:
      "Live DateForge calendar recipes for booking, scheduling, dashboards, forms, read-only views, presets, tracks, themes, and time selection.",
  },
  twitter: {
    title: "DateForge React Calendar Examples",
    description:
      "Live DateForge calendar recipes for booking, scheduling, dashboards, forms, read-only views, presets, tracks, themes, and time selection.",
  },
};

export default function ExamplesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
