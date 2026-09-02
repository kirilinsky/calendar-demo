"use client";

import { useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { appleEaseOut, springSnappy } from "./motion";

const CHANGELOG_URL = "/changelog";

const subscribeNoop = () => () => {};

function dismissKey(version: string) {
  return `dateforge:version-notice-dismissed:${version}`;
}

function readDismissed(version: string) {
  try {
    return window.localStorage.getItem(dismissKey(version)) === "1";
  } catch {
    return false;
  }
}

export function VersionBadge({ version }: { version: string }) {
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const reduce = useReducedMotion();

  if (!hydrated) return null;
  const hidden = dismissed ?? readDismissed(version);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(dismissKey(version), "1");
    } catch {
      // localStorage can be unavailable in private or restricted contexts.
    }
  };

  return (
    <AnimatePresence initial={false}>
      {!hidden && (
        <motion.div
          key="version-badge"
          className="flex justify-center"
          initial={reduce ? false : { opacity: 0, y: -8, scale: 0.94, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: -6, scale: 0.9, filter: "blur(6px)", transition: { duration: 0.24, ease: appleEaseOut } }
          }
          transition={reduce ? { duration: 0 } : { duration: 0.55, ease: appleEaseOut }}
        >
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 py-1 pl-3 pr-1.5 text-[11px] font-medium leading-none text-emerald-800 shadow-sm backdrop-blur-sm sm:text-xs">
        <span aria-hidden className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        v{version} is out
        <a
          href={CHANGELOG_URL}
          className="font-semibold text-emerald-700 underline-offset-2 transition hover:text-emerald-900 hover:underline"
        >
          What&apos;s new
        </a>
        <motion.button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss version notice"
          whileHover={reduce ? undefined : { rotate: 90 }}
          whileTap={reduce ? undefined : { scale: 0.85 }}
          transition={reduce ? { duration: 0 } : springSnappy}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-emerald-400 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
        >
          <X size={11} />
        </motion.button>
      </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
