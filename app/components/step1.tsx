"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import React, { useState, useEffect } from "react";
import Glucometer from "./glucometer";

// --- Professional Medical Typography Choice ---
// We'll use "Inter" for the UI and "IBM Plex Sans" (or a clean system stack) 
// for the data/numbers to give it a "clinical lab" feel.

export default function Step1() {
  const [formData, setFormData] = useState({ distress: 5 });

  const springDistress = useSpring(formData.distress, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    springDistress.set(formData.distress);
  }, [formData.distress, springDistress]);

  const colorShift = useTransform(
    springDistress,
    [0, 5, 10],
    ["#10b981", "#3b82f6", "#f43f5e"]
  );

  const fillWidth = useTransform(springDistress, [0, 10], ["0%", "100%"]);
  // Offset thumb position to prevent clipping at edges
  const thumbPosition = useTransform(springDistress, [0, 10], ["calc(0% + 18px)", "calc(100% - 18px)"]);
  const displayValue = useTransform(springDistress, (latest) => Math.round(latest));

  const titleText = "How stressful did diabetes feel today?";
  const words = titleText.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  const uiFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 1, duration: 0.8, ease: "easeOut" } 
    },
  };

  return (
    // font-sans (Inter) provides clinical clarity
    <div className="relative w-full   px-10 flex flex-col items-center justify-between overflow-hidden font-sans ">
      
      {/* Top Section: Title and Visual */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full  gap-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:w-2/3">
          <h1 className="text-5xl md:text-5xl font-bold dark:text-white text-slate-900 leading-[1.1] tracking-tight font-[Spectral]">
            {words.map((word, i) => (
              <motion.span key={i} variants={wordVariants as any} className="inline-block mr-[0.2em]">
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <div className="hidden lg:flex lg:w-1/4 justify-center">
          <Glucometer value={formData.distress} />
        </div>
      </div>

      {/* Bottom Section: Calibration UI */}
      <div className="w-full pb-20 ">
        <motion.p 
          variants={uiFadeIn as any} initial="hidden" animate="visible"
          className="text-lg font-medium opacity-60 dark:text-slate-400 text-slate-600 mb-8 border-l-2 border-slate-200 dark:border-slate-800 pl-4"
        >
          Calibrate the biometric simulation based on your current state.
        </motion.p>
          
        <motion.div variants={uiFadeIn as any} initial="hidden" animate="visible" className="w-full lg:w-1/2">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col space-y-1">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Patient Distress Metric
              </span>
              <span className="text-sm font-medium opacity-40 dark:text-slate-400 text-slate-500">
                Range: 0 (Baseline) — 10 (Critical)
              </span>
            </div>
            {/* font-mono or tabular-nums is essential for medical data */}
            <motion.span 
              style={{ color: colorShift }}
              className="text-7xl font-bold tabular-nums tracking-tighter"
            >
              {displayValue}
            </motion.span>
          </div>

          {/* Slider UI */}
          <div className="relative w-full h-16 flex items-center group select-none">
            <div className="absolute w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full left-0 top-0"
                style={{ width: fillWidth, backgroundColor: colorShift }}
              />
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={formData.distress}
              onChange={(e) => setFormData({ ...formData, distress: parseInt(e.target.value) })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
            />

            {/* Custom Thumb */}
            <motion.div
              className="absolute pointer-events-none z-20 w-10 h-10 bg-white dark:bg-slate-100 rounded-full shadow-2xl flex items-center justify-center border-[6px] border-slate-50 dark:border-slate-900"
              style={{
                left: thumbPosition,
                x: "-50%",
              }}
            >
              <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorShift }} />
            </motion.div>
          </div>

          <div className="flex justify-between mt-2 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 dark:text-white text-slate-900">
            <span>Baseline</span>
            <span>Severe</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}