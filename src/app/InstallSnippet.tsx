"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { easeFast, springPill, springSnappy } from "./motion";

const PACKAGE = "@dateforge/react-calendar";

const MANAGERS = [
  { id: "npm", command: `npm i ${PACKAGE}` },
  { id: "pnpm", command: `pnpm add ${PACKAGE}` },
  { id: "yarn", command: `yarn add ${PACKAGE}` },
  { id: "bun", command: `bun add ${PACKAGE}` },
] as const;

type ManagerId = (typeof MANAGERS)[number]["id"];

export function InstallSnippet({
  className = "",
  flat = false,
}: {
  className?: string;
  /** Square, black-ruled shell for the Mondrian hero. Rounded card elsewhere. */
  flat?: boolean;
}) {
  const reduce = useReducedMotion();
  const [manager, setManager] = useState<ManagerId>("npm");
  const [copied, setCopied] = useState(false);

  const command =
    MANAGERS.find((entry) => entry.id === manager)?.command ?? MANAGERS[0].command;

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={reduce ? { duration: 0 } : springSnappy}
      className={`overflow-hidden bg-[#101012] text-left ${
        flat
          ? "border-2 border-zinc-950"
          : "rounded-2xl border border-zinc-800/80 shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg"
      } ${className}`}
    >
      <div className="flex items-center gap-1 border-b border-white/8 px-2 py-1.5">
        {MANAGERS.map((entry) => {
          const active = entry.id === manager;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setManager(entry.id);
                setCopied(false);
              }}
              aria-pressed={active}
              className={`relative rounded-full px-2.5 py-1 font-mono text-[11px] leading-none transition-colors duration-200 ${
                active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="install-manager-pill"
                  transition={reduce ? { duration: 0 } : springPill}
                  className="absolute inset-0 rounded-full bg-white/10"
                />
              )}
              <span className="relative">{entry.id}</span>
            </button>
          );
        })}

        <motion.div
          whileTap={reduce ? undefined : { scale: 0.88 }}
          transition={reduce ? { duration: 0 } : springSnappy}
          className="ml-auto inline-flex"
        >
          <Button
            type="button"
            onClick={copy}
            aria-label={`Copy ${manager} install command`}
            variant="ghost"
            size="icon-sm"
            className="overflow-hidden text-zinc-400 hover:bg-white/10 hover:text-white"
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
                {copied ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5">
        <span aria-hidden className="select-none font-mono text-xs text-emerald-400/80">
          $
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.code
            key={command}
            initial={reduce ? false : { opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={reduce ? { duration: 0 } : easeFast}
            className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-100 sm:text-[13px]"
          >
            {command}
          </motion.code>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
