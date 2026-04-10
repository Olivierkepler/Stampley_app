"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  ClipboardList, 
  BrainCircuit, 
  Users, 
  CheckCircle2
} from "lucide-react";
import { useCheckInStore, FocusDomain } from "../hooks/useCheckInStore";

// 1. Map out the 4 clinical domains with descriptions
const DOMAIN_CARDS = [
  { 
    id: "Physician-related distress", 
    label: "Physician-Related", 
    description: "Stress regarding appointments, feeling unheard, or medical advice.",
    icon: Stethoscope 
  },
  { 
    id: "Regimen-related distress", 
    label: "Regimen-Related", 
    description: "Burnout from tracking, eating rules, and medication routines.",
    icon: ClipboardList 
  },
  { 
    id: "Emotional burden", 
    label: "Emotional Burden", 
    description: "Feelings of isolation, fear of the future, or general burnout.",
    icon: BrainCircuit 
  },
  { 
    id: "Interpersonal distress", 
    label: "Interpersonal", 
    description: "Tension with family, friends, or coworkers regarding diabetes.",
    icon: Users 
  },
] as const;

export default function WeeklyDomainPage() {
  // 2. ZUSTAND IN ACTION: Pull the current domain and the setter function
  const { focusDomain, setFocusDomain } = useCheckInStore();

  return (
    <div className="max-w-4xl mx-auto w-full pb-10 pt-12 font-[Outfit,system-ui,sans-serif]">

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 justify-start py-12"
      >
        {/* Heading — Fraunces display font */}
        <h1 className="font-[Fraunces,Georgia,serif] text-4xl font-light tracking-[-0.02em] text-[#3c4043]/60 mb-3">
          Focus Domain
        </h1>

        {/* Subtext — Outfit body font */}
        <p className="font-[Outfit,system-ui,sans-serif] text-[13.5px] font-light leading-[1.7] text-[#5f6368]">
          Which area of diabetes distress are we focusing on today?
          <br /> Stampley will tailor your support based on this selection.
        </p>
      </motion.div>

      {/* 3. The Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {DOMAIN_CARDS.map((card, index) => {
          const isSelected = focusDomain === card.id;
          const Icon = card.icon;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFocusDomain(card.id as FocusDomain)}
              className={`
                relative p-6 rounded-2xl border cursor-pointer overflow-hidden transition-all duration-300
                ${isSelected 
                  ? "bg-[#FFB100]/5 border-[#FFB100] shadow-[0_8px_24px_-8px_rgba(255,177,0,0.2)]" 
                  : `bg-white border-[#e3e3e3] hover:border-[#c4c7c5] hover:shadow-sm ${focusDomain ? 'opacity-60 hover:opacity-100' : ''}`
                }
              `}
            >
              <div className="flex items-start gap-4">

                {/* Icon Container */}
                <div className={`
                  flex shrink-0 items-center justify-center w-10 h-10 rounded-lg transition-colors duration-300
                  ${isSelected ? "bg-[#FFB100] text-white shadow-md shadow-[#FFB100]/30" : "bg-[#f1f3f4] text-[#444746]"}
                `}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1">
                  {/* Card label — Outfit medium */}
                  <h3 className={`font-[Outfit,system-ui,sans-serif] text-[14px] font-medium mb-1.5 transition-colors duration-300 ${isSelected ? "text-[#996A00]" : "text-[#1f1f1f]"}`}>
                    {card.label}
                  </h3>
                  {/* Card description — Outfit light */}
                  <p className={`font-[Outfit,system-ui,sans-serif] text-[13px] font-light leading-[1.65] transition-colors duration-300 ${isSelected ? "text-[#996A00]/80" : "text-[#5f6368]"}`}>
                    {card.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div className="shrink-0 mt-1">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isSelected ? "border-[#FFB100] bg-[#FFB100]" : "border-[#e3e3e3] bg-transparent"}
                  `}>
                    <CheckCircle2 size={12} className={`text-white transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                  </div>
                </div>
              </div>

              {/* Active State Background Glow */}
              {isSelected && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFB100]/10 rounded-full blur-3xl pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}