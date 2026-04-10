"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { STEPS } from "../../constants/navigation";
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckInStore } from "./../../../check-in/hooks/useCheckInStore";

export default function StepDock() {
  const router = useRouter();
  const pathname = usePathname();
  const { submitCheckIn, isSubmitting } = useCheckInStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentIndex = STEPS.findIndex(s => s.path === pathname);
  const currentStepNum = currentIndex + 1;

  if (pathname.includes("stampley-support")) {
    return null;
  }

  const isLastStep = currentStepNum === 4 || currentStepNum === STEPS.length;

  const handleNavigate = (dir: "next" | "prev") => {
    setSubmitError(null);
    const targetIndex = dir === "next" ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < STEPS.length) {
      router.push(STEPS[targetIndex].path);
    }
  };

  const handleFinalize = async () => {
    setSubmitError(null);
    const ok = await submitCheckIn();
    if (!ok) {
      setSubmitError("Could not save your check-in. Please try again.");
      return;
    }
    router.push(STEPS[STEPS.length - 1].path);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        layout
        className="
        flex items-center gap-2 p-1.5
        bg-[#fefdfb]/85 backdrop-blur-xl
        border border-black/[0.07]
        rounded-[2.5rem]
        shadow-[0_8px_32px_rgba(10,10,15,0.1),0_2px_8px_rgba(10,10,15,0.06)]
      "
      >
      {/* Step counter pill */}
      <AnimatePresence initial={false}>
        {currentStepNum > 1 && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden"
          >
            <span className="
              flex items-center justify-center px-3
              font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.2em]
              text-black/30 select-none whitespace-nowrap
            ">
              {currentStepNum - 1} / {STEPS.length - 1}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <AnimatePresence initial={false}>
        {currentStepNum > 1 && (
          <motion.button
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 52, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            onClick={() => handleNavigate("prev")}
            className="
              flex h-12 items-center justify-center rounded-[1.8rem] shrink-0
              bg-black/[0.04] text-black/40 border border-black/[0.06]
              hover:bg-black/[0.07] hover:text-black/60
              active:scale-95 transition-all duration-200 cursor-pointer
              overflow-hidden
            "
          >
            <ChevronLeft size={17} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Primary action button */}
      <button
        onClick={() => isLastStep ? handleFinalize() : handleNavigate("next")}
        disabled={isSubmitting}
        className={`
          group relative flex-1 h-12 min-w-[180px] overflow-hidden rounded-[1.8rem]
          font-[JetBrains_Mono,monospace] font-medium text-[10px] uppercase tracking-[0.2em]
          transition-all duration-300 cursor-pointer
          ${isSubmitting
            ? "bg-[#3d5a80]/50 text-white/60 cursor-not-allowed shadow-none"
            : isLastStep
              ? "bg-[#9d7855] text-white shadow-[0_4px_16px_rgba(157,120,85,0.3)] hover:shadow-[0_8px_24px_rgba(157,120,85,0.35)] active:scale-[0.98]"
              : currentStepNum === 0
                ? "bg-[#0a0a0f] text-white shadow-[0_4px_14px_rgba(10,10,15,0.2)] hover:shadow-[0_8px_22px_rgba(10,10,15,0.28)] active:scale-[0.98]"
                : "bg-[#3d5a80] text-white shadow-[0_4px_14px_rgba(61,90,128,0.25)] hover:shadow-[0_8px_22px_rgba(61,90,128,0.32)] active:scale-[0.98]"
          }
        `}
      >
        <div className="relative z-10 flex items-center justify-center gap-2.5">
          {isSubmitting ? (
            <>
              <span>Submitting</span>
              <Loader2 size={14} className="animate-spin opacity-70" />
            </>
          ) : isLastStep ? (
            <>
              <span>Complete Check-in</span>
              <CheckCircle2 size={14} />
            </>
          ) : currentStepNum === 0 ? (
            <>
              <span>Start Check-in</span>
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </>
          )}
        </div>

        {/* Shimmer */}
        {!isSubmitting && (
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent skew-x-12 pointer-events-none" />
        )}
      </button>
      </motion.div>
      {submitError && (
        <p role="alert" className="text-xs text-red-600">
          {submitError}
        </p>
      )}
    </div>
  );
}