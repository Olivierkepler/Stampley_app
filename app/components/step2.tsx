"use client";

import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Heart, Zap, Activity } from "lucide-react";
import BioMonitor from "./BioMonitor";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

const SliderCard = ({ 
  title, value, onChange, min, max, labels, icon: Icon, colorRange 
}: any) => {
  const springValue = useSpring(value, { stiffness: 150, damping: 25 });
  useEffect(() => { springValue.set(value); }, [value, springValue]);

  const colorShift = useTransform(springValue as any, [0, 5, 10], colorRange);
  const fillWidth = useTransform(springValue as any, [0, 10], ["0%", "100%"]);

  return (
    <motion.div 
      variants={itemVariants as any}
      className="group relative p-5 md:p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all duration-500 overflow-hidden w-full"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <motion.div 
            style={{ backgroundColor: `${colorRange[1]}15`, color: colorShift as any as string }} 
            className="p-2.5 rounded-2xl"
          >
            <Icon size={18} strokeWidth={2.5} className="md:w-5 md:h-5" />
          </motion.div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {title}
          </span>
        </div>
        <motion.span 
          style={{ color: colorShift as any as string }} 
          className="text-3xl md:text-4xl font-black tabular-nums tracking-tighter"
        >
          {value}
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        <motion.h3 
          key={value > 5 ? 'high' : value < 5 ? 'low' : 'mid'}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="text-lg md:text-xl font-bold text-slate-800 mb-6 md:mb-8"
        >
          {value === 5 ? labels.mid : value > 5 ? labels.high : labels.low}
        </motion.h3>
      </AnimatePresence>

      <div className="relative h-3 flex items-center">
        <div className="absolute w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full" 
            style={{ width: fillWidth as any, backgroundColor: colorShift as any as string }}   
          />
        </div>
        <input
          type="range" min={min} max={max} step="1" value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-10 opacity-0 cursor-pointer z-20"
        />
        <motion.div
          style={{ left: fillWidth as any, x: "-50%" }}
          className="absolute w-6 h-6 md:w-7 md:h-7 bg-white rounded-full border-[5px] md:border-[6px] shadow-lg pointer-events-none z-10 transition-shadow"
        />
      </div>
    </motion.div>
  );
};

export default function Step1() {
  const [formData, setFormData] = useState({ mood: 5, energy: 5 });
  const heading = "How are you feeling today?".split(" ");

  return (
    <div className="relative  w-full bg-[#F8FAFC] flex flex-col items-center overflow-x-hidden">
      
      {/* 1. Header Section with Adaptive Monitor */}
      <div className="relative w-full max-w-7xl px-6 pt-10 md:pt-20 pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
        
        <div className="z-20 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black font-[Spectral] text-slate-900 leading-[0.9] tracking-tight max-w-2xl ">
  {heading.map((word, i) => (
    <motion.span
      key={i}
      variants={itemVariants as any}
      initial="hidden"
      animate="visible"
      custom={i} // Pass index for smoother stagger logic
      className={`inline-block mr-[0.3em] last:mr-0 ${
        word.toLowerCase() === "feeling "
          ? "text-transparent bg-clip-text bg-gradient-to-b from-slate-500 via-slate-400 to-slate-200 drop-shadow-sm"
          : ""
      }`}
    >
      {word}
    </motion.span>
  ))}
</h1>
           <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 font-medium max-w-sm text-sm md:text-base mb-20"
            >
              Calibrate the biometric simulation based on your current state.
            </motion.p>
        </div>

        {/* Responsive BioMonitor Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative md:absolute md:top-12 md:right-12 lg:right-20 flex justify-center"
        >
          <div className="group relative">
            <div className="absolute inset-0 blur-[60px] opacity-20 bg-blue-400 rounded-full" />
            <div className="relative transition-transform duration-700 hover:scale-[1.05]">
              <BioMonitor onAnalyze={() => {}} isAnalyzing={false}
                mood={formData.mood} 
                energy={formData.energy} 
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Interactive Controls Grid */}  
      <div className="relative w-full max-w-7xl px-6 pb-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-stretch gap-4 md:gap-6 w-full"
        >
          <SliderCard
            title="Mood (pleasant <-> unpleasant)"
            value={formData.mood}
            onChange={(val: number) => setFormData({ ...formData, mood: val })}
            min="0" max="10" icon={Heart}
            colorRange={["#f43f5e", "#3b82f6", "#10b981"]}
            labels={{ low: "Unpleasant", mid: "Neutral", high: "Pleasant" }}
          />

          <SliderCard
            title="Energy (energized <-> drained)"
            value={formData.energy}
            onChange={(val: number) => setFormData({ ...formData, energy: val })}
            min="0" max="10" icon={Zap}
            colorRange={["#10b981", "#3b82f6", "#f43f5e"]}
            labels={{ low: "Drained", mid: "Moderate", high: "Energized" }}
          />
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-[120px]" />
      </div>
    </div>
  );
}