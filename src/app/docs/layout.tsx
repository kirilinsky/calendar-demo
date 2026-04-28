import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Complete DateForge React Calendar documentation covering Calendar props, modules, utilities, types, edge cases, SSR, accessibility, themes, appearances, disabled dates, and presets.",
  openGraph: {
    title: "DateForge React Calendar Docs",
    description:
      "Complete DateForge React Calendar documentation covering Calendar props, modules, utilities, types, edge cases, SSR, accessibility, themes, appearances, disabled dates, and presets.",
  },
  twitter: {
    title: "DateForge React Calendar Docs",
    description:
      "Complete DateForge React Calendar documentation covering Calendar props, modules, utilities, types, edge cases, SSR, accessibility, themes, appearances, disabled dates, and presets.",
  },
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
