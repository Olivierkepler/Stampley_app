"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Activity, ShieldCheck, Loader2, Menu, Sparkles } from "lucide-react";

// Component Imports
import Step1 from "../components/step1";
import Step2 from "../components/step2";
import Step3 from "../components/step3";
import Step4 from "../components/step4";
import Step5 from "../components/Step5";
    import SurgicalWhiteSidebar from "../components/StepSidebar";
import StampleyChat from "../components/StampleyChat"; // The final chatbot page

const pageVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 30 : -30,
    filter: "blur(8px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -30 : 30,
    filter: "blur(8px)",
    transition: { duration: 0.2 }
  }),
};

export default function BillionDollarCheckIn() {
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);

  const paginate = (newStep: number) => {
    if (newStep < 1 || newStep > 5) return;
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // Simulate biometric data processing & clinical context generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsSubmitting(false);
    setShowChat(true);
  };

  // If the flow is complete, we show the full-screen Chat interface
  if (showChat) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-screen"
      >
        <StampleyChat />
      </motion.div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#FBFBFC] overflow-hidden selection:bg-blue-100">
      
      {/* 1. PROGRESS NAVIGATION (Sidebar) */}
      <aside className="hidden lg:block border-r border-slate-100 shadow-[20px_0_40px_rgba(0,0,0,0.01)] z-20">
        <SurgicalWhiteSidebar currentStep={step} onStepClick={(s) => paginate(s)} />
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* MOBILE HEADER */}
        <header className="lg:hidden h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Phase 0{step}</span>
          </div>
          <Menu size={20} className="text-slate-400" />
        </header>

        {/* CONTENT STAGE */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth custom-scrollbar">
          <div className="max-w-5xl mx-auto py-16 px-8 lg:px-20 pb-40">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={pageVariants as any}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 />}
                {step === 4 && <Step4 />}
                {step === 5 && <Step5 />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* 3. DYNAMIC DOCK (Floating Action Center) */}
        <footer className="absolute bottom-10 left-0 right-0 z-50 px-8 flex flex-col items-center pointer-events-none">
          <div className="w-full max-w-xl pointer-events-auto group">
            <div className="bg-white/90 backdrop-blur-3xl border border-white p-2 rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] flex items-center gap-2 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]">
              
              <AnimatePresence>
                {step > 1 && !isSubmitting && (
                  <motion.button
                    initial={{ width: 0, opacity: 0, x: -10 }}
                    animate={{ width: 64, opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: -10 }}
                    onClick={() => paginate(step - 1)}
                    className="flex h-14 items-center justify-center rounded-[1.75rem] bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              <button
                disabled={isSubmitting}
                onClick={() => (step < 5 ? paginate(step + 1) : handleFinalSubmit())}
                className={`group relative flex-1 h-14 overflow-hidden rounded-[1.75rem] font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-700 
                  ${step === 5 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700"}`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span className="text-white/70">Generating Neural Profile</span>
                    </>
                  ) : (
                    <>
                      <span>{step === 5 ? "Initiate AI Synthesis" : "Advance to Phase 0" + (step + 1)}</span>
                      {step === 5 ? (
                        <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                      ) : (
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </>
                  )}
                </div>
                
                {/* Background Shine Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </button>
            </div>
            
            {/* Trust & Security Metadata */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-center items-center gap-2.5"
            >
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/50 backdrop-blur-sm rounded-full border border-slate-200/50 opacity-40">
                <ShieldCheck size={10} className="text-slate-900" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-900">Quantum_Encrypted</span>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>

      {/* 4. ATMOSPHERIC CANVAS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-15%] left-[10%] w-[60%] h-[60%] bg-blue-50/30 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/20 rounded-full blur-[140px]" 
        />
      </div>
    </div>
  );
}