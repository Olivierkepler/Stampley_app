"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ShieldHalf, PenLine, Info, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCheckInStore } from "../hooks/useCheckInStore";

const NarrativeBox = ({
  id,
  label,
  question,
  icon: Icon,
  value,
  onChange,
  placeholder,
  delay,
  suggestions,
}: {
  id: string;
  label: string;
  question: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  delay: number;
  suggestions?: string[];
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 180 : -180, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="mb-8"
    >
      {/* Card header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-black/[0.04] border border-black/[0.06] text-black/40"
        >
          <Icon size={16} />
        </motion.div>
        <div>
          <h2 className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.2em] text-[#3d5a80]/75 leading-none mb-1.5">
            {label}
          </h2>
          <h3 className="font-[Fraunces,Georgia,serif] text-[16px] font-light tracking-[-0.01em] text-[#0a0a0f]/80 leading-none">
            {question}
          </h3>
        </div>
      </div>

      {/* Suggestion chips with scroll arrows */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex items-center gap-2 mb-3">

          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 flex cursor-pointer items-center justify-center w-7 h-7 rounded-full border border-black/[0.08] bg-[#fefdfb] text-black/35 hover:border-[#3d5a80]/25 hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.03] transition-all duration-200 shadow-[0_1px_3px_rgba(10,10,15,0.04)]"
            aria-label="Scroll suggestions left"
          >
            <ChevronLeft size={13} />
          </button>

          {/* Scrollable chip row */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-1 px-0.5 w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onChange(suggestion)}
                className="whitespace-nowrap cursor-pointer px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-[#fefdfb] text-black/50 text-[12px] font-light hover:border-[#3d5a80]/30 hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.03] transition-all duration-200 flex-shrink-0 shadow-[0_1px_3px_rgba(10,10,15,0.04)]"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 flex cursor-pointer items-center justify-center w-7 h-7 rounded-full border border-black/[0.08] bg-[#fefdfb] text-black/35 hover:border-[#3d5a80]/25 hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.03] transition-all duration-200 shadow-[0_1px_3px_rgba(10,10,15,0.04)]"
            aria-label="Scroll suggestions right"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Textarea */}
      <div className="relative group">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[150px] p-5 rounded-[18px] resize-none outline-none transition-all duration-300
            bg-[#fefdfb] text-[#0a0a0f] text-[13.5px] font-light leading-[1.7] placeholder:text-black/30
            border border-black/[0.08]
            hover:border-[#3d5a80]/25
            focus:border-[#3d5a80]/50 focus:ring-[3px] focus:ring-[#3d5a80]/10 focus:shadow-[0_4px_20px_rgba(61,90,128,0.08)]
            font-[Outfit,system-ui,sans-serif]"
        />
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 translate-y-1.5 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300 ease-out">
          <PenLine size={14} className="text-[#3d5a80]/50" />
        </div>
      </div>
    </motion.div>
  );
};

export default function ClinicalNarrativePage() {
  const { narrative, setNarrative } = useCheckInStore();
  const [showContext, setShowContext] = useState(false);

  const reflectionDefaults = [
    "I felt overwhelmed by fluctuating numbers.",
    "Things went fairly smoothly today.",
    "I was stressed about managing my meals.",
    "I felt burnt out from constant management.",
  ];

  const copingDefaults = [
    "I took a short walk to clear my head.",
    "I took a moment to breathe deeply.",
    "I talked to a friend or family member.",
    "I just tried to be patient with myself.",
  ];

  return (
    <div className="max-w-3xl mx-auto w-full pb-10 pt-10 px-4 lg:px-0 font-[Outfit,system-ui,sans-serif]">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[Fraunces,Georgia,serif] text-[30px] font-light tracking-[-0.02em] text-[#0a0a0f]/70 mb-2 leading-tight">
              Open <em className="italic font-light text-[#0a0a0f]/25">Reflection</em>
            </h1>
            <p className="text-[13.5px] font-light leading-[1.7] text-black/45">
              Take a moment to describe your experience today in your own words.
            </p>
          </div>

          <button
            onClick={() => setShowContext((prev) => !prev)}
            className="flex items-center cursor-pointer gap-1.5 shrink-0 mt-1 px-3.5 py-2 rounded-full border border-black/[0.08] bg-[#fefdfb] text-black/40 text-[11px] font-[JetBrains_Mono,monospace] uppercase tracking-[0.14em] hover:border-[#3d5a80]/30 hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.03] transition-all duration-200 shadow-[0_1px_3px_rgba(10,10,15,0.04)]"
          >
            <Info size={12} />
            Why we ask
          </button>
        </div>

        <AnimatePresence>
          {showContext && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-[16px] border border-[#3d5a80]/15 bg-[#3d5a80]/[0.03] px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-3">
                    <p className="text-[12.5px] font-light leading-[1.75] text-black/60">
                      These reflections help Stampley understand the full context of your day —
                      not just the numbers, but what you were feeling and how you coped.
                      Your responses are private, used only by the research team to
                      provide personalised support and improve the AIDES-T2D study.
                    </p>
                    <div className="flex items-center gap-4">
                      {[
                        { label: "Private", icon: "🔒" },
                        { label: "IRB Approved", icon: "✓" },
                        { label: "Optional", icon: "↩" },
                      ].map((badge) => (
                        <div
                          key={badge.label}
                          className="flex items-center gap-1.5 font-[JetBrains_Mono,monospace] text-[8.5px] uppercase tracking-[0.16em] text-[#3d5a80]/60"
                        >
                          <span className="text-[10px]">{badge.icon}</span>
                          {badge.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContext(false)}
                    className="shrink-0 mt-0.5 text-black/25 hover:text-black/50 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Box 1: The Reflection */}
      <NarrativeBox
        id="reflection"
        label="Contextual Impact"
        question="What most shaped your day with diabetes?"
        icon={BookOpen}
        value={narrative.reflection}
        onChange={(val) => setNarrative("reflection", val)}
        placeholder="E.g., I was incredibly frustrated by a sudden spike after lunch, or I felt really proud of managing my glucose during my presentation..."
        delay={0.1}
        suggestions={reflectionDefaults}
      />

      {/* Box 2: The Coping Action */}
      <NarrativeBox
        id="copingAction"
        label="Resilience & Action"
        question="What helped you get through the day?"
        icon={ShieldHalf}
        value={narrative.copingAction}
        onChange={(val) => setNarrative("copingAction", val)}
        placeholder="E.g., Taking a short walk, calling a friend, drinking water, or just giving myself some grace..."
        delay={0.2}
        suggestions={copingDefaults}
      />

    </div>
  );
}