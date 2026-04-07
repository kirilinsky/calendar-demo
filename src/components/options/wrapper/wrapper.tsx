"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
interface WrapperProps {
  description?: string;
  children: ReactNode;
  className?: string;
}

export const Wrapper = ({
  description,
  children,
  className,
}: WrapperProps): React.JSX.Element => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn("overflow-hidden text-zinc-950", className)}
    >
      {description && (
        <div className="pb-2">
          <p className="text-[13px] text-zinc-500 leading-snug font-normal">
            {description}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2">{children}</div>
    </motion.div>
  );
};
