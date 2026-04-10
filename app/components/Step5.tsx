"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Stethoscope, 
  Activity, 
  Brain, 
  Users2, 
  CheckCircle2, 
  Info,
  Sparkles
} from "lucide-react";

const DOMAINS = [
  {
    id: "physician",
    title: "Physician-Related",
    description: "Stress regarding clinical communication or access to care.",
    icon: Stethoscope,
    color: "#3B82F6", // Surgical Blue
    glow: "rgba(59, 130, 246, 0.15)"
  },
  {
    id: "regimen",
    title: "Regimen-Related",
    description: "Difficulty managing testing, dosing, or technical routines.",
    icon: Activity,
    color: "#10B981", // Emerald Vitals
    glow: "rgba(16, 185, 129, 0.15)"
  },
  {
    id: "emotional",
    title: "Emotional Burden",
    description: "General feelings of burnout, fear, or mental exhaustion.",
    icon: Brain,
    color: "#F43F5E", // Rose Burnout
    glow: "rgba(244, 63, 94, 0.15)"
  },
  {
    id: "interpersonal",
    title: "Interpersonal",
    description: "Stress caused by family, friends, or social expectations.",
    icon: Users2,
    color: "#F59E0B", // Amber Social
    glow: "rgba(245, 158, 11, 0.15)"
  }
];

export default function Step5() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 25 } 
    }
  };

  const activeDomain = DOMAINS.find(d => d.id === selectedDomain);

  return (
    <div className="w-full h-full min-h-screen relative flex items-center justify-center py-20 overflow-hidden">
      
      {/* --- DYNAMIC AMBIENT FIELD --- */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none transition-colors duration-1000"
            style={{ 
              background: `radial-gradient(circle at 50% 50%, ${activeDomain?.glow}, transparent 70%)` 
            }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl px-12 relative z-10"
      >
        <header className="mb-16 space-y-4">
        
          
          <h1 className="text-5xl font-black font-[Spectral] tracking-tighter text-slate-900 leading-[0.9]">
            Distress  Domain
          </h1>
          <p className="text-slate-400 font-medium text-lg max-w-xl">
            Synthesize your qualitative stressors into clinical trend data.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DOMAINS.map((domain) => {
            const isActive = selectedDomain === domain.id;
            
            return (
              <motion.div
                key={domain.id}
                variants={cardVariants as any}
                whileHover={{ y: -8, transition: { duration: 0.4, ease: "circOut" } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDomain(domain.id)}
                className={`relative group cursor-pointer p-10 rounded-[3rem] border transition-all duration-700 ${
                  isActive 
                  ? "bg-white border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]" 
                  : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200"
                }`}
              >
                {/* --- SELECTION RING --- */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      layoutId="outline"
                      className="absolute inset-0 rounded-[3rem] border-2 z-20 pointer-events-none"
                      style={{ borderColor: domain.color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-10">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500"
                      style={{ 
                        backgroundColor: isActive ? domain.color : 'white',
                        color: isActive ? 'white' : '#94a3b8',
                        boxShadow: isActive ? `0 10px 25px ${domain.glow}` : '0 4px 12px rgba(0,0,0,0.03)'
                      }}
                    >
                      <domain.icon size={28} strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    
                    {isActive && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex items-center gap-2"
                      >
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Captured</span>
                         <CheckCircle2 style={{ color: domain.color }} size={20} strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>

                  <h3 className={`text-3xl font-bold tracking-tight mb-3 transition-colors duration-500 ${isActive ? 'text-slate-950' : 'text-slate-400'}`}>
                    {domain.title}
                  </h3>
                  <p className={`text-sm font-medium leading-relaxed transition-colors duration-500 ${isActive ? 'text-slate-500' : 'text-slate-300'}`}>
                    {domain.description}
                  </p>
                </div>

                {/* --- GLASS SHIMMER --- */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

     
      </motion.div>
    </div>
  );
}