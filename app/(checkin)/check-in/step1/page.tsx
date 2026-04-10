"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Smile, Zap, Frown, Battery, BatteryWarning } from "lucide-react";
import { useCheckInStore } from "./../../check-in/hooks/useCheckInStore";

export default function DailyMetricsPage() {
  // 1. ZUSTAND IN ACTION: We instantly pull the current values and the update function
  const { affect, setAffect } = useCheckInStore();

  // Helper function to render our premium custom sliders
  const renderSlider = ({
    id,
    label,
    question,
    minLabel,
    midLabel,
    maxLabel,
    minIcon: MinIcon,
    maxIcon: MaxIcon,
    value,
    metricKey,
    reverseTrack = false,
  }: {
    id: string;
    label: string;
    question: string;
    minLabel: string;
    midLabel: string;
    maxLabel: string;
    minIcon: any;
    maxIcon: any;
    value: number | null;
    metricKey: "distress" | "mood" | "energy";
    reverseTrack?: boolean;
  }) => {
    // If value is null, default to 5 visually, but we know it's untouched in state
    const currentValue = value !== null ? value : 5;
    const percentage = ((currentValue - 0) / 10) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-xl border border-[#0033A0]/10 p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,51,160,0.05)] mb-6"
      >
        <div className="mb-8">
          <h2 className="text-[10px] font-black text-[#FFB100] uppercase tracking-widest mb-2">
            {label}
          </h2>
          <h3 className="text-xl font-bold text-[#0033A0]">{question}</h3>
        </div>

        <div className="relative pt-4 pb-8">
          {/* Custom Slider Track Background */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-slate-100 rounded-full -translate-y-1/2 overflow-hidden">
            {/* Active Track Progress (Deep Blue) */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-[#0033A0] transition-all duration-150 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Invisible Native Input (The actual interactive element) */}
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={currentValue}
            // 2. ZUSTAND IN ACTION: One line instantly updates global state!
            onChange={(e) => setAffect(metricKey, parseInt(e.target.value))}
            className="absolute top-1/2 left-0 right-0 w-full -translate-y-1/2 h-8 opacity-0 cursor-pointer z-20"
          />

          {/* Custom Gold Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 rounded-full bg-[#FFB100] border-4 border-white shadow-[0_4px_12px_rgba(255,177,0,0.4)] z-10 pointer-events-none transition-all duration-150 ease-out flex items-center justify-center"
            style={{ left: `${percentage}%` }}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        {/* Labels & Icons */}
        <div className="flex justify-between items-center text-[11px] font-bold text-[#0033A0]/60 uppercase tracking-wider mt-2">
          <div className="flex flex-col items-center gap-2 w-24 text-center">
            <MinIcon size={18} className="text-[#0033A0]/40" />
            <span>{minLabel}</span>
          </div>
          <div className="flex flex-col items-center gap-2 w-24 text-center opacity-50">
            <div className="w-1 h-1 rounded-full bg-[#0033A0]/40" />
            <span>{midLabel}</span>
          </div>
          <div className="flex flex-col items-center gap-2 w-24 text-center">
            <MaxIcon size={18} className="text-[#0033A0]/40" />
            <span>{maxLabel}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-serif text-[#0033A0] mb-3">Daily Metrics me</h1>
        <p className="text-[#0033A0]/60 font-medium">
          Please rate your distress and affect for today.
        </p>
      </motion.div>

      {/* Render the 3 Clinical Sliders */}
      {renderSlider({
        id: "distress",
        label: "Domain 1: Distress",
        question: "How stressful did diabetes feel today?",
        minLabel: "No Stress (0)",
        midLabel: "Moderate (5)",
        maxLabel: "High Stress (10)",
        minIcon: Smile,
        maxIcon: Frown,
        value: affect.distress,
        metricKey: "distress",
      })}

      {renderSlider({
        id: "mood",
        label: "Domain 2: Mood",
        question: "How are you feeling overall right now?",
        minLabel: "Unpleasant (0)",
        midLabel: "Neutral (5)",
        maxLabel: "Pleasant (10)",
        minIcon: Frown,
        maxIcon: Smile,
        value: affect.mood,
        metricKey: "mood",
      })}

      {renderSlider({
        id: "energy",
        label: "Domain 3: Energy",
        question: "What is your current energy level?",
        minLabel: "Drained (0)",
        midLabel: "Moderate (5)",
        maxLabel: "Energized (10)",
        minIcon: BatteryWarning,
        maxIcon: Zap,
        value: affect.energy,
        metricKey: "energy",
      })}
    </div>
  );
}