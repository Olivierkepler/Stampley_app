"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  Activity, 
  Pill, 
  Briefcase, 
  MessageSquareWarning, 
  HeartHandshake, 
  ThermometerSnowflake,
  CheckCircle2
} from "lucide-react";
import { useCheckInStore } from "../hooks/useCheckInStore";

// 1. Map out the protocol exactly as you defined it
const CONTEXT_CARDS = [
  { id: "doctorAppt", label: "Doctor's appointment", icon: Stethoscope  },
  { id: "bloodSugar", label: "High or low blood sugar", icon: Activity },
  { id: "missedMedication", label: "Missed a medication or meal", icon: Pill },
  { id: "stress", label: "Stress at work or school", icon: Briefcase },
  { id: "conflict", label: "Conflict or tension with someone", icon: MessageSquareWarning },
  { id: "supported", label: "Felt supported by someone", icon: HeartHandshake },
  { id: "unwell", label: "Felt physically unwell or tired", icon: ThermometerSnowflake },
] as const;

type ContextKey = typeof CONTEXT_CARDS[number]["id"];

export default function ContextualFactorsPage() {
  // 2. ZUSTAND IN ACTION: Pull the tags and the toggle function
  const { contextTags, toggleContextTag } = useCheckInStore();

  return (
    <div className="max-w-3xl mx-auto w-full pb-10 pt-10 px-4 lg:px-0 font-[Outfit,system-ui,sans-serif]">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        {/* <div className="flex items-center gap-2.5 mb-4">
          <span className="h-px w-5 bg-[#3d5a80]/40" />
          <span className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.24em] text-[#3d5a80]/70 select-none">
            Daily Check-In
          </span>
        </div> */}
        <h1 className="font-[Fraunces,Georgia,serif] text-[30px] font-light tracking-[-0.02em] text-[#0a0a0f]/70 mb-2 leading-tight">
          What shaped your <em className="italic font-light text-[#0a0a0f]/25">day?</em>
        </h1>
        <p className="text-[13.5px] font-light leading-[1.7] text-black/45">
          Which of these applied to your day? Tap all that fit.
        </p>
      </motion.div>

      {/* 3. The Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CONTEXT_CARDS.map((card, index) => {
          const isSelected = contextTags[card.id as ContextKey];
          const Icon = card.icon;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleContextTag(card.id as ContextKey)}
              className={`
                relative p-5 rounded-[18px] border transition-all duration-300 cursor-pointer flex items-center gap-4 overflow-hidden
                ${isSelected
                  ? "bg-[#3d5a80]/[0.04] border-[#3d5a80]/50 shadow-[0_4px_16px_rgba(61,90,128,0.1)]"
                  : "bg-[#fefdfb] border-black/[0.08] hover:border-[#3d5a80]/25 hover:bg-[#3d5a80]/[0.02] shadow-[0_1px_4px_rgba(10,10,15,0.04)]"
                }
              `}
            >
              {/* Animated Card Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: (index * 0.05) + 0.2,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className={`
                  flex items-center justify-center shrink-0 w-11 h-11 rounded-[12px] transition-all duration-300
                  ${isSelected
                    ? "bg-[#3d5a80] text-white shadow-[0_2px_8px_rgba(61,90,128,0.25)]"
                    : "bg-black/[0.04] text-black/40 border border-black/[0.06]"
                  }
                `}
              >
                <Icon size={18} />
              </motion.div>

              {/* Card Label */}
              <span className={`
                flex-1 text-[13.5px] leading-snug transition-colors duration-300
                ${isSelected ? "text-[#3d5a80] font-medium" : "text-[#0a0a0f]/70 font-normal"}
              `}>
                {card.label}
              </span>

              {/* Active Checkmark Indicator */}
              <div className={`
                transition-all duration-300 transform shrink-0
                ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"}
              `}>
                <CheckCircle2 size={18} className="text-[#3d5a80]" />
              </div>

              {/* Subtle Background Shine on Active */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}