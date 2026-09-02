"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { easeFast, springSnappy } from "./motion";

const COMMAND = "npm i @dateforge/react-calendar";

export function InstallSnippet({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={reduce ? { duration: 0 } : springSnappy}
      className={`flex items-center gap-2 rounded-xl border border-zinc-200 bg-[#101012] px-3 py-2 text-left shadow-sm transition-shadow duration-300 hover:shadow-md ${className}`}
    >
      <span className="select-none font-mono text-xs text-zinc-500">$</span>
      <code className="flex-1 truncate font-mono text-xs text-zinc-100 sm:text-sm">
        {COMMAND}
      </code>
      <motion.div
        whileTap={reduce ? undefined : { scale: 0.88 }}
        transition={reduce ? { duration: 0 } : springSnappy}
        className="inline-flex"
      >
        <Button
          type="button"
          onClick={copy}
          aria-label="Copy install command"
          variant="ghost"
          size="icon-sm"
          className="overflow-hidden text-zinc-100 hover:bg-white/10 hover:text-white"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "check" : "copy"}
              initial={reduce ? false : { opacity: 0, scale: 0.5, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 25 }}
              transition={reduce ? { duration: 0 } : easeFast}
              className="grid place-items-center"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </motion.div>
    </motion.div>
  );
}
