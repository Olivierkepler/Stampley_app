"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import React, { useState } from "react";
import { Check, Plus, Activity, Fingerprint } from "lucide-react";

const CONTEXT_TAGS = [
  { id: 1, label: "Clinical Visit", icon: "🏥", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.5)" },
  { id: 2, label: "Glucose Flux", icon: "📈", color: "#10b981", glow: "rgba(16, 185, 129, 0.5)" },
  { id: 3, label: "Nutrient Gap", icon: "💊", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)" },
  { id: 4, label: "Cognitive Load", icon: "💼", color: "#6366f1", glow: "rgba(99, 102, 241, 0.5)" },
  { id: 5, label: "Social Friction", icon: "😤", color: "#f43f5e", glow: "rgba(244, 63, 94, 0.5)" },
  { id: 6, label: "System Support", icon: "🤝", color: "#ec4899", glow: "rgba(236, 72, 153, 0.5)" },
  { id: 7, label: "Somatic Fatigue", icon: "🔋", color: "#94a3b8", glow: "rgba(148, 163, 184, 0.5)" },
];

export default function Step3() {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center  pt-10  px-6 bg-[#f8fafc] selection:bg-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full space-y-20"
      >
        {/* Header: Medical-Grade Precision */}
        <header className="relative  space-y-6">
       
          
          <h2 className="text-6xl md:text-6xl font-black tracking-tighter font-[Spectral] text-slate-900 leading-[0.8] mb-8">
            Environmental Factors <br />
        
          </h2>
          
          <p className="text-slate-500 font-medium  mx-auto leading-relaxed text-lg ">
            Map your daily events to biometric fluctuations for enhanced diagnostic accuracy.
          </p>
        </header>

        {/* The Grid: Neumorphic Glass Tiles */}
        <LayoutGroup>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-2"
          >
            {CONTEXT_TAGS.map((tag, i) => {
              const isActive = selectedTags.includes(tag.id);
              return (
                <motion.button
                  key={tag.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.7 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleTag(tag.id)}
                  className={`group relative p-8 rounded-[3rem] border transition-all duration-700 cursor-pointer h-56 flex flex-col justify-between overflow-hidden ${
                    isActive
                      ? "bg-white border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-100"
                      : "bg-white/40 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {/* Subtle Background Glow */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 pointer-events-none "
                        style={{ 
                          background: `radial-gradient(circle at 0% 0%, ${tag.glow} 0%, transparent 70%)` 
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10 flex justify-between items-start ">
                    <span className={`text-5xl transition-all  duration-700 ease-out ${isActive ? 'scale-110' : 'grayscale opacity-20 blur-[1px] group-hover:grayscale-0 group-hover:opacity-100 group-hover:blur-0'}`}>
                      {tag.icon}
                    </span>
                    
                    {isActive && (
                      <motion.div
                        layoutId={`check-${tag.id}`}
                        className="bg-slate-900 rounded-full p-2 shadow-lg"
                      >
                        <Check size={14} strokeWidth={3} className="text-white" />
                      </motion.div>
                    )}
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-[0.25em] block transition-colors ${
                        isActive ? "text-slate-900" : "text-black"
                      }`}>
                        {tag.label}
                      </span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                        Log Data Entry
                      </p>
                    </div>
                    
                    {/* The Biometric Bar */}
                    <div className="h-1.5 w-full bg-slate-100/50 rounded-full overflow-hidden backdrop-blur-md">
                      <motion.div 
                        animate={{ 
                          width: isActive ? "100%" : "0%",
                          backgroundColor: tag.color 
                        }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="h-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {/* Custom Entry Tile */}
            {/* <motion.button 
              className="p-8 cursor-pointer rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all h-56 group"
            >
              <div className="p-4 rounded-[1.5rem] bg-white shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Integrate Custom</span>
            </motion.button> */}
          </motion.div>
        </LayoutGroup>

      </motion.div>
    </div>
  );
}