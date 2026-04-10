"use client";

import React, { useMemo, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlucometerProps {
  value: number;
  unit?: string;
  label?: string;
  isActive?: boolean;
  onPress?: () => void;
}

/**
 * WhiteGlucometer: Professional Grade Clinical UI
 * Enhanced with unique ID scoping, LCD texturing, and corrected flex-alignments.
 */
const WhiteGlucometer = ({
  value,
  unit = "Stress Units",
  label = "System Live",
  isActive = true,
  onPress
}: GlucometerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const id = useId(); // Prevents SVG ID collisions

  const statusColor = useMemo(() => {
    if (!isActive) return "#475569"; 
    if (value <= 3) return "#10B981"; 
    if (value <= 6) return "#3B82F6"; 
    if (value <= 8) return "#F59E0B"; 
    return "#EF4444";               
  }, [value, isActive]);

  return (
    <div 
      className="relative flex items-center justify-center p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="meter"
      aria-valuenow={isActive ? value : 0}
    >
      <motion.svg
        width="240"
        height="360"
        viewBox="0 0 220 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 drop-shadow-2xl"
      >
        <defs>
          {/* Ceramic Chassis Gradient */}
          <linearGradient id={`body-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* LCD Screen Internal Depth */}
          <filter id={`inset-${id}`}>
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite operator="out" in="SourceGraphic" in2="blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.5" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* LCD Screen Background */}
          <linearGradient id={`glass-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isActive ? "#1E293B" : "#0F172A"} />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Screen Texture (Scanlines) */}
          <pattern id={`grid-${id}`} width="2" height="2" patternUnits="userSpaceOnUse">
            <path d="M 2 0 L 0 0 0 2" fill="none" stroke="white" strokeWidth="0.1" stopOpacity="0.05" />
          </pattern>

          <linearGradient id={`specular-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- HARDWARE CHASSIS --- */}
        <rect x="2" y="2" width="216" height="336" rx="54" fill={`url(#body-${id})`} stroke="#CBD5E1" strokeWidth="0.5" />
        <rect x="6" y="6" width="208" height="328" rx="50" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />

        {/* --- DISPLAY SECTION --- */}
        <g transform="translate(18, 22)">
          {/* Physical Screen Cutout */}
          <rect width="184" height="188" rx="32" fill={`url(#glass-${id})`} filter={`url(#inset-${id})`} />
          
          {/* LCD Texture Overlay */}
          <rect width="184" height="188" rx="32" fill={`url(#grid-${id})`} pointerEvents="none" opacity={isActive ? 0.4 : 0} />
          
          <foreignObject width="184" height="188">
            <div className="w-full h-full flex flex-col items-center justify-between py-6 px-4 font-sans text-white">
              
              {/* Header Telemetry */}
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500 mb-0.5">
                  {isActive ? "Telemetry Node 01" : "System Inactive"}
                </span>
                <span className={`text-[10px] font-bold tracking-tight transition-colors duration-500 ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isActive ? label : "OFFLINE"}
                </span>
              </div>

              {/* Central Readout */}
              <div className="relative flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isActive ? value : "off"}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="text-6xl font-extralight tracking-tighter tabular-nums leading-none pt-8 translate-x-5"
                    style={{ 
                      color: isActive ? statusColor : "#334155", 
                      textShadow: isActive ? `0 0 30px ${statusColor}60` : "none" 
                    }}
                  >
                    {isActive ? value : "--"}
                  </motion.div>
                </AnimatePresence>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600 mt-1 translate-x-7">
                  {unit}
                </span>
              </div>

              {/* Biometric Waveform */}
              <div className="w-full h-10 flex items-end justify-center gap-[3px] px-2 translate-x-7">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: isActive ? [`${25 + (i % 4) * 15}%`, `${50 + (i % 2) * 40}%`, `${25 + (i % 4) * 15}%`] : "10%"
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.08, 
                      ease: "easeInOut" 
                    }}
                    className="flex-1 rounded-full transition-colors duration-1000"
                    style={{ 
                      backgroundColor: statusColor, 
                      opacity: isActive ? 0.4 : 0.1 
                    }}
                  />
                ))}
              </div>
            </div>
          </foreignObject>

          {/* Glass Specular Shine */}
          <rect width="184" height="188" rx="32" fill={`url(#specular-${id})`} pointerEvents="none" />
        </g>

        {/* --- PRIMARY INTERACTION HUB --- */}
        <g 
          transform="translate(110, 272)" 
          className="cursor-pointer group" 
          onClick={onPress}
        >
          {/* Interactive Aura */}
          <motion.circle
            r="42"
            fill={statusColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered && isActive ? 0.12 : 0 }}
          />
          
          {/* Main Button Dome */}
          <motion.circle 
            r="32" 
            fill="white" 
            stroke="#E2E8F0"
            strokeWidth="1"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="drop-shadow-md"
          />

          {/* Crosshair Details */}
          <circle r="2.5" fill={isActive ? statusColor : "#CBD5E1"} className="transition-colors duration-500" />
          <g opacity={isActive ? 0.4 : 0.1} stroke="#64748B" strokeWidth="1.5" strokeLinecap="round">
            <line x1="-10" y1="0" x2="-6" y2="0" />
            <line x1="10" y1="0" x2="6" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="-6" />
            <line x1="0" y1="10" x2="0" y2="6" />
          </g>

          {/* Mechanical Pulse Ring */}
          {isActive && (
            <motion.circle
              r="32"
              fill="none"
              stroke={statusColor}
              strokeWidth="2"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </g>

        {/* Intake Port Detail */}
        <rect x="80" y="338" width="60" height="2" rx="1" fill="#E2E8F0" />
        <rect x="100" y="338" width="20" height="1" fill={statusColor} opacity={isActive ? 0.6 : 0.2} />
      </motion.svg>

      {/* --- AMBIENT BLOOM --- */}
      <motion.div
        animate={{ 
          opacity: isActive ? (isHovered ? 0.2 : 0.08) : 0,
          scale: isHovered ? 1.1 : 1
        }}
        className="absolute inset-0 -z-10 blur-[80px] rounded-full transition-all duration-1000"
        style={{ backgroundColor: statusColor }}
      />
    </div>
  );
};

export default WhiteGlucometer;