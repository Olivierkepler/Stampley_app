'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Activity, ShieldCheck, Zap, X } from 'lucide-react';

interface BioMonitorProps {
  mood: number;
  energy: number;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const BioMonitor = ({ mood, energy, onAnalyze, isAnalyzing }: BioMonitorProps) => {
  const vitality = Math.round((mood + (10 - energy)) / 2 * 10);
  
  const getThemeColor = () => {
    if (vitality > 70) return "#10b981"; 
    if (vitality > 40) return "#3b82f6"; 
    return "#f43f5e";                   
  };

  const themeColor = getThemeColor();

  const getStatusData = () => {
    if (vitality > 70) return { 
      label: "Optimal", 
      desc: "Autonomic nervous system shows high resilience.",
      recommend: "Ideal for peak performance."
    };
    if (vitality > 40) return { 
      label: "Nominal", 
      desc: "Physiological systems are in a maintenance state.",
      recommend: "Continue routine hydration."
    };
    return { 
      label: "Strained", 
      desc: "Biological markers indicate significant fatigue.",
      recommend: "Prioritize deep rest now."
    };
  };

  const status = getStatusData();

  return (
    // The container needs enough width to hold the monitor (240px) + the panel (288px)
    <div className="flex items-center justify-end select-none relative h-[320px] w-[560px] group">
      
     {/* 1. Tactile Side Button (Left Side Reveal) */}
     {/*
        Now the panel will open/close on button click,
        using local React state.
     */}
     {(() => {
       // We use a hook inside the render function since
       // the outer function is not a component.
       const React = require('react');
       const { useState } = React;
       // Use unique variable so as not to conflict with outer context:
       // (The following pattern is idiomatic when transforming static code.)
       const [panelOpen, setPanelOpen] = useState(false);

       return (
         <>
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={(e) => {
               e.stopPropagation(); // Prevents bubbling
               setPanelOpen((open: boolean) => !open); // Toggle the side panel
               // Optionally call onAnalyze only when opening:
               if (!panelOpen) onAnalyze();

               // Change button icon when panel is open (show close icon if open, info otherwise)
               // This will require the rendering code below (where the icon is shown) to use:
               // {panelOpen ? <X size={20} strokeWidth={2.5} /> : <Info size={20} strokeWidth={2.5} />}
             }}
             className={`absolute left-[270px] top-1/2 -translate-y-1/2 z-40 w-12 h-16  cursor-pointer
               rounded-l-2xl border-r-0 border border-slate-200 shadow-xl 
               flex items-center justify-center transition-all duration-500 ease-in-out
               opacity-0 translate-x-12 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto
               ${isAnalyzing ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400'}
             `}
           >
             {panelOpen ? <X size={20} strokeWidth={2.5} /> : <Info size={20} strokeWidth={2.5} />}
           </motion.button>

           {/* Side Panel: Status Readout */}
           <AnimatePresence>
             {panelOpen && (
               <motion.div
                 initial={{ opacity: 0, x: 24 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 24 }}
                 transition={{ delay: 0.2, duration: 0.7, type: "spring", stiffness: 80 }}
                 className={`z-30 absolute right-75 top-1/2 -translate-y-1/2 h-[256px] w-[260px] rounded-[2rem] shadow-xl border border-slate-100 bg-white/80 backdrop-blur-md flex flex-col items-start justify-center px-8 py-7
                   ${isAnalyzing ? "ring-2 ring-slate-900" : ""}
                 `}
               >
                 {/* Label */}
                 <span className="text-xs uppercase font-black tracking-[0.25em] text-slate-400 mb-2 select-none">
                   {status.label}
                 </span>
                 {/* Large Numeric Gauge */}
                 <div className="flex items-end gap-3 mb-3">
                   <motion.span
                     key={status.label}
                     initial={{ opacity: 0, y: 18 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ type: "spring", stiffness: 100, damping: 16 }}
                     className="text-5xl font-black tabular-nums tracking-tighter"
                     style={{ color: themeColor }}
                   >
                     {vitality}
                   </motion.span>
                   <span className="text-xl font-sans font-bold text-slate-400 pb-1">/ 100</span>
                 </div>
                 {/* Description */}
                 <div className="mb-4">
                   <p className="text-slate-700 text-[15px] leading-snug font-semibold mb-1">{status.desc}</p>
                   <span className="block text-[11px] font-bold tracking-wide text-blue-400">{status.recommend}</span>
                 </div>
                 {/* Simulated Analysis Status */}
                 {isAnalyzing && (
                   <div className="mt-4 flex items-center gap-2">
                     <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                     <span className="text-blue-600 font-medium text-xs">Analyzing...</span>
                   </div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
         </>
       );
     })()}

      {/* 2. Main BioMonitor Device */}
      <div className="relative z-20 ml-10 transition-transform duration-700 group-hover:scale-[1.02] cursor-pointer">
        <svg width="240" height="240" viewBox="0 0 200 200" className="drop-shadow-2xl">
          <defs>
            <radialGradient id="ceramicRing" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
            <filter id="glassInnerShadow">
              <feOffset dx="0" dy="4" />
              <feGaussianBlur stdDeviation="4" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.4" result="color" />
              <feComposite in2="inverse" operator="in" in="color" result="shadow" />
            </filter>
          </defs>

          <circle cx="100" cy="100" r="95" fill="url(#ceramicRing)" stroke="#cbd5e1" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="75" fill="#020617" filter="url(#glassInnerShadow)" />

          <motion.circle
            cx="100" cy="100" r="70"
            fill="none"
            stroke={themeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="440"
            animate={{ strokeDashoffset: 440 - (vitality / 100) * 440 }}
            transition={{ type: "spring", stiffness: 40, damping: 12 }}
            style={{ opacity: 0.6, rotate: -90, transformOrigin: 'center' }}
          />

          <foreignObject x="40" y="40" width="120" height="120">
            <div className="w-full h-full flex flex-col items-center justify-center text-white font-sans">
              <motion.div
                key={vitality}
                className="text-6xl font-thin tracking-tighter tabular-nums"
                style={{ color: themeColor, textShadow: `0 0 20px ${themeColor}66` }}
              >
                {vitality}
              </motion.div>
              <div className="flex gap-1.5 mt-6 h-4 items-end">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 2.2, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                    className="w-1.5 h-3 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                ))}
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>

     
    </div>
  );
};

export default BioMonitor;