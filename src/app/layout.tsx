import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kirilinsky.github.io/dateforge-react-calendar/"),
  title: {
    default: "DateForge React Calendar",
    template: "%s | DateForge React Calendar",
  },
  description:
    "Composable React calendar and date-time picker examples for product interfaces.",
  openGraph: {
    title: "DateForge React Calendar",
    description:
      "Composable React calendar and date-time picker examples for product interfaces.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DateForge React Calendar",
    description:
      "Composable React calendar and date-time picker examples for product interfaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
