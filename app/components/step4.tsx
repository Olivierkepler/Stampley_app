"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ShieldCheck, PenLine, HeartHandshake, ArrowRight, Activity } from "lucide-react";

export default function Step4() {
  const [formData, setFormData] = useState({ reflection: "", coping: "" });
  const [focused, setFocused] = useState<string | null>(null);

  // Calculate "Depth" based on word count (target: 15 words for full depth)
  const getDepth = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    return Math.min((words / 15) * 100, 100);
  };

  const reflectionDepth = useMemo(() => getDepth(formData.reflection), [formData.reflection]);
  const copingDepth = useMemo(() => getDepth(formData.coping), [formData.coping]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    setFormData({ ...formData, [key]: target.value });
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] selection:bg-blue-100 px-6 pt-16 pb-32 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-20"
      >
        <header className="space-y-6">
      
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-[0.9] font-[Spectral]">
            Daily Synthesis
          </h1>
        </header>

        <div className="space-y-8">
          {/* Section 01: Reflection Card */}
          <motion.section 
            className={`relative p-10 rounded-[3.5rem] transition-all duration-700 border-2 overflow-hidden ${
              focused === 'reflection' 
              ? "bg-white border-blue-500/20 shadow-[0_40px_80px_-15px_rgba(59,130,246,0.15)] scale-[1.02]" 
              : "bg-white/50 border-slate-100 opacity-60 grayscale-[0.5]"
            }`}
          >
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all duration-500 ${focused === 'reflection' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                  <PenLine size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 block mb-0.5">Vector 01</span>
                  <span className="text-sm font-bold text-slate-900">Contextual Experience</span>
                </div>
              </div>
              
              {/* Depth Meter UI */}
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-widest text-black    block mb-1">Depth Index</span>
                <div className="w-24 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${reflectionDepth}%`, backgroundColor: reflectionDepth === 100 ? "blue-500" : "blue-500" }}
                    className="h-full transition-colors duration-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="relative min-h-[120px]">
              <AnimatePresence>
                {focused === 'reflection' && !formData.reflection && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute left-0 top-[8px] w-[3px] h-[48px] bg-blue-500 rounded-full z-10"
                  />
                )}
              </AnimatePresence>

              <textarea
                value={formData.reflection}
                onFocus={() => setFocused('reflection')}
                onBlur={() => setFocused(null)}
                onChange={(e) => handleInput(e, 'reflection')}
                className={`w-full bg-transparent border-none text-4xl font-medium  text-slate-900 placeholder:text-slate-200 outline-none leading-[1.1] resize-none overflow-hidden font-[Spectral] transition-all duration-500 ${focused === 'reflection' ? 'pl-6' : 'pl-0'}`}
                placeholder="What most shaped your day with diabetes?"
              />
            </div>
          </motion.section>

          {/* Section 02: Coping Card */}
          <motion.section 
            className={`relative p-10 rounded-[3.5rem] transition-all duration-700 border-2 overflow-hidden ${
              focused === 'coping' 
              ? "bg-white border-emerald-500/20 shadow-[0_40px_80px_-15px_rgba(16,185,129,0.15)] scale-[1.02]" 
              : "bg-white/50 border-slate-100 opacity-60 grayscale-[0.5]"
            }`}
          >
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all duration-500 ${focused === 'coping' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 block mb-0.5">Vector 02</span>
                  <span className="text-sm font-bold text-slate-900">Resilience Strategy</span>
                </div>
              </div>

              {/* Depth Meter UI */}
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-widest text-black block mb-1">Depth Index</span>
                <div className="w-24 h-1 bg-green-500/20 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${copingDepth}%`, backgroundColor: copingDepth === 100 ? "green-500" : "green-500" }}
                    className="h-full transition-colors duration-500 "
                  />
                </div>
              </div>
            </div>
            
            <div className="relative min-h-[120px]">
              <AnimatePresence>
                {focused === 'coping' && !formData.coping && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute left-0 top-[8px] w-[3px] h-[48px] bg-emerald-500 rounded-full z-10"
                  />
                )}
              </AnimatePresence>

              <textarea
                value={formData.coping}
                onFocus={() => setFocused('coping')}
                onBlur={() => setFocused(null)}
                onChange={(e) => handleInput(e, 'coping')}
                className={`w-full bg-transparent border-none text-4xl font-medium  text-slate-900 placeholder:text-slate-200 outline-none leading-[1.1] resize-none overflow-hidden font-[Spectral] transition-all duration-500 ${focused === 'coping' ? 'pl-6' : 'pl-0'}`}
                placeholder="What helped you get through the day?"
              />
            </div>
          </motion.section>
        </div>

        
      </motion.div>
    </div>
  );
}