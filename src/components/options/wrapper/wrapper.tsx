"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const Wrapper = ({
  title,
  description,
  children,
}: WrapperProps): React.JSX.Element => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="overflow-hidden"
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold leading-none text-zinc-900">
          {title}
        </h4>
        {description && (
          <p className="text-[13px] text-zinc-500 leading-snug">
            {description}
          </p>
        )}
      </div>

      <div className="pt-1 flex flex-col gap-3">{children}</div>
    </motion.div>
  );
};
