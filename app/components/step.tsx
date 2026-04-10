"use client";
import { motion, useSpring, useTransform, AnimatePresence, useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import Glucometer from "./glucometer";

export default function Step1() {
  const [formData, setFormData] = useState({ distress: 5 });

  // Smooth out the value transitions
  const springDistress = useSpring(formData.distress, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    springDistress.set(formData.distress);
  }, [formData.distress, springDistress]);

  // Dynamic Color Palette: Green -> Blue -> Red
  const colorShift = useTransform(
    springDistress,
    [0, 5, 10],
    ["#10b981", "#3b82f6", "#f43f5e"]
  );

  const fillWidth = useTransform(springDistress, [0, 10], ["0%", "100%"]);
  const thumbPosition = useTransform(springDistress, [0, 10], ["0%", "100%"]);
  const displayValue = useTransform(springDistress, (latest) => Math.round(latest));

  // --- Animation Variants ---
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
      transition: { type: "spring", damping: 12, stiffness: 100 },
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      
      {/* 1. Dynamic Background Glow */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-30 blur-[140px]"
        style={{
          background: useTransform(colorShift, (c) => `radial-gradient(circle at 50% 50%, ${c}, transparent 70%)`)
        }}
      />

      <div className="relative z-10 w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Text & Slider */}
          <div className="flex flex-col space-y-12">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <h1 className="text-5xl md:text-7xl font-black dark:text-white text-slate-900 leading-[1.05] tracking-tight">
                {words.map((word, i) => (
                  <motion.span key={i} variants={wordVariants as any} className="inline-block mr-[0.25em] text-7xl">
                    {word}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            <motion.div variants={uiFadeIn as any} initial="hidden" animate="visible" className="w-full ">
              <div className="flex items-end justify-between mb-6">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-50 dark:text-white text-slate-900">
                    Distress Level
                  </span>
                  <span className="text-sm font-medium opacity-40 dark:text-slate-400 text-slate-500">
                    Slide to rate your day
                  </span>
                </div>
                <motion.span 
                  style={{ color: colorShift }}
                  className="text-6xl font-black tabular-nums tracking-tighter"
                >
                  {displayValue}
                </motion.span>
              </div>

              {/* Enhanced Slider UI */}
              <div className="relative w-full h-12 flex items-center group select-none">
                {/* Track Background */}
                <div className="absolute w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full left-0 top-0 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
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
                  className="absolute pointer-events-none z-20 w-9 h-9 bg-white dark:bg-slate-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 border-white dark:border-slate-800"
                  style={{
                    left: thumbPosition,
                    x: "-50%",
                  }}
                >
                  <motion.div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorShift }} />
                </motion.div>
              </div>

              <div className="flex justify-between mt-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 dark:text-white text-slate-900">
                <span>Minimal</span>
                <span>Extreme</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: The Physical Device Reveal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ 
              delay: 0.6, 
              duration: 1.4, 
              type: "spring", 
              bounce: 0.2 
            }}
            className="relative flex flex-col items-center justify-center"
          >
            <div className="relative">
               {/* Dynamic Shadow under the device */}
               <motion.div 
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 blur-3xl rounded-[100%]"
                style={{ 
                  backgroundColor: colorShift,
                  opacity: 0.4
                }}
              />
              <div className="relative z-10">
                <Glucometer value={formData.distress} />
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}