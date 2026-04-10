"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smile, Zap, Frown, BatteryWarning } from "lucide-react";
import { useCheckInStore } from "./../../check-in/hooks/useCheckInStore";
import DailyWellnessRadar from "./DailyWellnessRadar";
import WhiteGlucometer from "./glucometer";
import BioMonitor from "./BioMonitor";

export default function DailyMetricsPage() {
  const { affect, setAffect } = useCheckInStore();

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
  }) => {
    const currentValue = value !== null ? value : 5;
    const percentage = ((currentValue - 0) / 10) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative border border-black/[0.08] p-7 md:p-8 rounded-[28px] mb-6 shadow-[0_2px_16px_rgba(10,10,15,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(10,10,15,0.1)] hover:border-[#3d5a80]/25 group w-full"
        style={{ background: 'linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)' }}
      >
        {/* Card Header */}
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d5a80] shadow-[0_0_5px_rgba(61,90,128,0.45)]" />
            <h2
              className="text-[9.5px] font-medium text-[#3d5a80] uppercase tracking-[0.2em] leading-none select-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {label}
            </h2>
          </div>
          <h3
            className="text-[17px] font-normal text-[#0a0a0f] leading-snug"
            style={{ fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em' }}
          >
            {question}
          </h3>
        </div>

        {/* The Precision Slider System */}
        <div className="relative py-8">

          {/* Floating Dynamic Tooltip */}
          <div
            className="absolute top-[-22px] -ml-4 w-8 h-8 flex items-center justify-center bg-[#0a0a0f] text-white text-[12px] font-medium rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-30 pointer-events-none shadow-[0_4px_10px_rgba(10,10,15,0.25)]"
            style={{ left: `${percentage}%`, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {currentValue}
            <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#0a0a0f]" />
          </div>

          {/* 1. The Ambient Glow Layer */}
          <div
            className="absolute top-1/2 left-0 h-[3px] bg-[#3d5a80] rounded-full -translate-y-1/2 blur-[6px] opacity-0 group-hover:opacity-40 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />

          {/* 2. Main Track Background */}
          <div className="absolute top-1/2 left-0 right-0 h-[2.5px] bg-black/[0.08] rounded-full -translate-y-1/2 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]" />

          {/* 3. Active Gradient Fill */}
          <div
            className="absolute top-1/2 left-0 h-[2.5px] rounded-full -translate-y-1/2 transition-all duration-150 ease-out z-10"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, rgba(61,90,128,0.4), #3d5a80)',
            }}
          />

          {/* 4. Smart Tick Marks */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-full pointer-events-none px-[1px] z-10">
            <div className="absolute left-[0%] w-[2px] h-[7px] bg-[#3d5a80]/40 rounded-full top-1/2 -translate-y-1/2" />
            <div
              className="absolute left-[50%] w-[2px] h-[7px] rounded-full top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ backgroundColor: percentage >= 50 ? 'rgba(61,90,128,0.5)' : 'rgba(10,10,15,0.1)' }}
            />
            <div
              className="absolute left-[100%] -ml-[2px] w-[2px] h-[7px] rounded-full top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ backgroundColor: percentage === 100 ? '#3d5a80' : 'rgba(10,10,15,0.1)' }}
            />
          </div>

          {/* The Invisible HTML Range Input */}
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={currentValue}
            onChange={(e) => setAffect(metricKey, parseInt(e.target.value))}
            className="absolute top-1/2 left-0 right-0 w-full -translate-y-1/2 h-10 opacity-0 cursor-pointer z-20 peer"
          />

          {/* 5. The Custom Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -ml-[10px] w-5 h-5 rounded-full bg-[#fefdfb] border-[2.5px] border-[#3d5a80] shadow-[0_2px_8px_rgba(61,90,128,0.25)] z-30 pointer-events-none transition-all duration-150 ease-out flex items-center justify-center peer-active:scale-90"
            style={{ left: `${percentage}%` }}
          >
            <div className="absolute inset-0 -m-3 rounded-full bg-[#3d5a80] opacity-0 peer-hover:opacity-8 peer-active:opacity-12 scale-50 peer-hover:scale-100 peer-active:scale-125 transition-all duration-300 ease-out" />
          </div>
        </div>

        {/* Min/Mid/Max Labels */}
        <div
          className="flex justify-between items-center text-[11.5px] font-normal text-black/40 mt-2 select-none"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          <div className={`flex flex-col items-center gap-2 w-24 text-center transition-all duration-300 ${currentValue <= 3 ? 'text-[#3d5a80] scale-105' : 'hover:text-black/60'}`}>
            <MinIcon size={18} className={currentValue <= 3 ? 'text-[#3d5a80]' : 'text-black/35'} />
            <span>{minLabel}</span>
          </div>

          <div className="flex flex-col items-center gap-2 w-24 text-center opacity-35">
            <span
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {midLabel}
            </span>
          </div>

          <div className={`flex flex-col items-center gap-2 w-24 text-center transition-all duration-300 ${currentValue >= 7 ? 'text-[#3d5a80] scale-105' : 'hover:text-black/60'}`}>
            <MaxIcon size={18} className={currentValue >= 7 ? 'text-[#3d5a80]' : 'text-black/35'} />
            <span>{maxLabel}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="max-w-5xl mx-auto w-full pb-50 pt-6 px-4 lg:px-0  "
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        {/* 1. Header & Radar Graph Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div className="w-full max-w-[600px]">

            {/* Section tag */}
            {/* <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-[#3d5a80]/40" />
              <span
                className="text-[9px] uppercase tracking-[0.24em] text-[#3d5a80]/70 select-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Daily Check-In
              </span>
            </div> */}

            <h1
              className="text-[32px] font-light text-[#0a0a0f]/70 mb-3 leading-[1.1]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.02em' }}
            >
              How are you feeling <em className="italic font-light text-black/30">today?</em>
            </h1>
            <p className="text-[13.5px] font-light leading-[1.7] text-black/50">
              Move each slider to reflect your experience. Stampley will use your
              responses to offer personalised support for your focus domain this week.
            </p>
          </div>

          <div className="w-full max-w-[300px]">
            <DailyWellnessRadar affect={affect} />
          </div>
        </motion.div>

        {/* 2. Main Sliders Area */}
        <div className="max-w-5xl mx-auto w-full">

          {/* Row 1: Distress Slider + Glucometer */}
          <div className="flex flex-col lg:flex-row gap-6 w-full items-start">

            <div className="flex-1 w-full">
              {renderSlider({
                id: "distress",
                label: "Distress",
                question: "How stressful did diabetes feel today?",
                minLabel: "No Stress (0)",
                midLabel: "Moderate",
                maxLabel: "High Stress (10)",
                minIcon: Smile,
                maxIcon: Frown,
                value: affect.distress,
                metricKey: "distress",
              })}
            </div>

            <div className="relative hidden lg:block w-[200px] shrink-0 translate-y-[-22px]">
              <WhiteGlucometer
                value={affect.distress ?? 5}  
                unit="Distress Lvl"
                label="Sys_Live"
              />
            </div>

          </div>

          {/* Row 2: Mood & Energy Sliders + BioMonitor */}
          <div className="flex flex-col lg:flex-row gap-6 w-full items-start">

            <div className="flex-1 w-full flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {renderSlider({
                  id: "mood",
                  label: "Mood",
                  question: "How are you feeling overall right now?",
                  minLabel: "Unpleasant (0)",
                  midLabel: "Neutral",
                  maxLabel: "Pleasant (10)",
                  minIcon: Frown,
                  maxIcon: Smile,
                  value: affect.mood,
                  metricKey: "mood",
                })}
              </div>

              <div className="flex-1">
                {renderSlider({
                  id: "energy",
                  label: "Energy",
                  question: "What is your current energy level?",
                  minLabel: "Drained (0)",
                  midLabel: "Moderate",
                  maxLabel: "Energised (10)",
                  minIcon: BatteryWarning,
                  maxIcon: Zap,
                  value: affect.energy,
                  metricKey: "energy",
                })}
              </div>
            </div>

            <div className="relative hidden lg:flex items-center justify-center w-[200px] shrink-0">
              <BioMonitor
                mood={affect.mood ?? 5}
                energy={affect.energy ?? 5}
              />
            </div>

          </div>

        </div>
      </div>
    </>
  );
}