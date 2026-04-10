"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Activity, Microscope, Wind, FileSearch, BarChart3, Fingerprint,
  Cpu, Check, Zap, ShieldCheck, ChevronRight, PanelLeftClose,
  PanelLeftOpen, Menu, X,
} from "lucide-react";

interface SidebarProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  defaultCollapsed?: boolean;
  brandName?: string;
  systemLabel?: string;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

interface StepItem {
  id: number;
  title: string;
  tag: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const STEPS: StepItem[] = [
  { id: 1, title: "Biometric Vitals", tag: "BIO_LOG_01", icon: Activity },
  { id: 2, title: "Somatic Analysis", tag: "NEURAL_02", icon: Microscope },
  { id: 3, title: "Environmental Data", tag: "EXT_03", icon: Wind },
  { id: 4, title: "Clinical Narrative", tag: "QUAL_04", icon: FileSearch },
  { id: 5, title: "Neural Synthesis", tag: "DATA_05", icon: BarChart3 },
];

const FINAL_STEP_ID = STEPS.length;
const EXPANDED_WIDTH = 320;
const COLLAPSED_WIDTH = 96;
const STORAGE_KEY = "surgical-sidebar-collapsed";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export default function SurgicalWhiteSidebar({
  currentStep,
  onStepClick,
  defaultCollapsed = false,
  brandName = "Stampley",
  systemLabel = "Surgical_Core_v9",
  isMobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = !isDesktop;
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileOpen = isMobileOpen ?? internalMobileOpen;

  const setMobileOpen = (open: boolean) => {
    onMobileOpenChange ? onMobileOpenChange(open) : setInternalMobileOpen(open);
  };

  // UPDATED: High-Res Clinical Palette
  const accentColor = useMemo(
    () => (currentStep === FINAL_STEP_ID ? "#059669" : "#6366F1"),
    [currentStep]
  );

  const verticalProgress = useMemo(() => {
    if (STEPS.length <= 1) return 0;
    return ((currentStep - 1) / (STEPS.length - 1)) * 100;
  }, [currentStep]);

  const showExpandedContent = isDesktop ? !isCollapsed : true;

  const sidebarContent = (
    <motion.aside
      animate={isDesktop ? { width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH } : { x: mobileOpen ? 0 : -EXPANDED_WIDTH - 24 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className={`relative flex h-full flex-col overflow-hidden border-r border-slate-200 bg-white font-sans text-slate-900 ${
        isDesktop ? "" : "fixed left-0 top-0 z-50 w-[320px] shadow-2xl"
      }`}
    >
      {/* 1. TOP PROGRESS RAIL (Precision Thinner) */}
      <div className="absolute left-0 right-0 top-0 z-[100] h-[2px] bg-slate-100">
        <motion.div
          animate={{ width: `${(currentStep / STEPS.length) * 100}%`, backgroundColor: accentColor }}
          className="h-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"
        />
      </div>

      {/* 2. HEADER: Deep Black/White Contrast */}
      <header className={`relative z-20 mt-2 flex items-center ${showExpandedContent ? "justify-between px-8 pb-10 pt-8" : "justify-center px-3 pb-8 pt-8"}`}>
        <div className={`flex items-center ${showExpandedContent ? "gap-4" : "flex-col gap-4"}`}>
          <div className="relative group">
            {showExpandedContent && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                <Cpu size={20} strokeWidth={1.5} />
              </div>
            )}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -inset-1.5 rounded-xl border border-dashed border-slate-200 opacity-40" />
          </div>
          {showExpandedContent && (
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-[0.45em] leading-none text-slate-900">{brandName}</span>
              <span className="mt-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{systemLabel}</span>
            </div>
          )}
        </div>
        {isDesktop && showExpandedContent && (
          <button onClick={() => setIsCollapsed(true)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
            <PanelLeftClose size={14} />
          </button>
        )}
        {isDesktop && !showExpandedContent && (
          <button onClick={() => setIsCollapsed(false)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
            <PanelLeftOpen size={14} />
          </button>
        )}
      </header>

      {/* 3. NAVIGATION: Ghost Axis */}
      <nav className={`relative z-20 flex-1 ${showExpandedContent ? "px-4" : "px-2"}`}>
        <LayoutGroup>
          <div className="relative space-y-1">
            {/* The Etched Background Track */}
            <div className={`absolute top-6 bottom-6 w-[1.5px] bg-slate-100 ${showExpandedContent ? "left-[30px]" : "left-1/2 -translate-x-1/2"}`} />

            {/* The Active Glow Axis */}
            <motion.div
              className={`absolute top-6 z-10 origin-top w-[1.5px] rounded-full ${showExpandedContent ? "left-[30px]" : "left-1/2 -translate-x-1/2"}`}
              style={{
                background: `linear-gradient(to bottom, transparent, ${accentColor}, ${accentColor}, transparent)`,
                boxShadow: `0 0 15px ${accentColor}55`,
              }}
              animate={{ height: `${verticalProgress}%` }}
              transition={{ type: "spring", stiffness: 45, damping: 20 }}
            />

            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isClickable = step.id <= currentStep;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative">
                  <button
                    onMouseEnter={() => isClickable && setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={`relative flex w-full items-center rounded-xl transition-all duration-300 ${
                      showExpandedContent ? "px-4 py-3" : "justify-center py-4"
                    } ${isClickable ? "cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
                  >
                    <AnimatePresence>
                      {hoveredStep === step.id && (
                        <motion.div layoutId="hover-bg" className="absolute inset-0 bg-slate-50/60 rounded-xl -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                      )}
                    </AnimatePresence>

                    {/* Icon Housing */}
                    <div className="relative z-20 flex w-8 h-8 items-center justify-center shrink-0">
                      <motion.div animate={{ color: isCompleted ? "#059669" : isActive ? "#6366F1" : "#CBD5E1", scale: isActive ? 1.1 : 1 }}>
                        {isCompleted ? <Check size={18} strokeWidth={3.5} /> : <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />}
                      </motion.div>
                      {isActive && <motion.div layoutId="active-glow" className="absolute inset-0 bg-white shadow-lg shadow-indigo-100/50 rounded-lg -z-10 border border-slate-100" />}
                    </div>

                    {showExpandedContent && (
                      <div className="ml-5 flex flex-col overflow-hidden">
                        <span className={`text-[9px] font-mono font-bold tracking-[0.2em] uppercase transition-colors ${isActive ? "text-indigo-600" : isCompleted ? "text-emerald-600" : "text-slate-300"}`}>
                          {step.tag}
                        </span>
                        <span className={`text-[14px] font-bold tracking-tight transition-colors ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                          {step.title}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </LayoutGroup>
      </nav>

      {/* 4. FOOTER: Verification Panel */}
      <footer className={`relative z-20 mt-auto ${showExpandedContent ? "p-6" : "p-3"}`}>
        <div className={`group flex w-full items-center rounded-xl border border-slate-200 bg-slate-50/50 transition-all hover:bg-white hover:shadow-md ${showExpandedContent ? "p-4" : "p-3 justify-center"}`}>
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
            <Fingerprint size={18} className={currentStep === FINAL_STEP_ID ? "text-emerald-600" : "text-slate-300"} />
            {currentStep === FINAL_STEP_ID && (
              <motion.div animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute inset-x-0 h-[1px] bg-emerald-400 shadow-[0_0_10px_#10B981]" />
            )}
          </div>
          {showExpandedContent && (
            <div className="ml-4 flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Clinical Verified</span>
              <span className="text-[8px] font-mono text-slate-400">ID: REF-00921-X</span>
            </div>
          )}
        </div>
      </footer>

      {/* Subtle Dot Grid Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
    </motion.aside>
  );

  return isDesktop ? <div className="h-full">{sidebarContent}</div> : <div ref={sidebarRef}>{sidebarContent}</div>;
}