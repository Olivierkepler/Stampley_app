"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { STEPS } from "../../constants/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevIndex = useRef(0);

  // Find where we are in the flow
  const currentIndex = STEPS.findIndex(s => s.path === pathname);
  
  // If the new index is greater than the old one, we are moving forward (direction = 1)
  // Otherwise, we are moving backward (direction = -1)
  const direction = currentIndex >= prevIndex.current ? 1 : -1;

  useEffect(() => {
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  return (
    // mode="wait" ensures the old page finishes exiting before the new one enters
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}