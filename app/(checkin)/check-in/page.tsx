"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
// import Image from "next/image";

export default function CheckInEntryPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

        .f-display { font-family: 'Fraunces', Georgia, serif; }
        .f-mono    { font-family: 'JetBrains Mono', monospace; }
        .f-body    { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes meshDrift {
          0%   { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(30px, -20px) rotate(2deg); }
        }
        .mesh-drift { animation: meshDrift 25s ease-in-out infinite alternate; }

        .grain::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.7;
          pointer-events: none;
          z-index: 0;
        }

        .dot-pattern::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(10,10,15,0.045) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.6;
          pointer-events: none;
        }

        .topo-lines {
          position: absolute; inset: 0;
          opacity: 0.025;
          pointer-events: none;
          overflow: hidden;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .divider-line {
          background: linear-gradient(90deg, transparent, rgba(10,10,15,0.12), transparent);
        }

        .feature-card {
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        .feature-card:hover {
          border-color: rgba(61,90,128,0.25);
          background: rgba(61,90,128,0.025);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="f-body relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#f5f2ec] selection:bg-[#3d5a80]/10">

        {/* Mesh gradient background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="mesh-drift absolute"
            style={{
              width: '160%', height: '160%', top: '-30%', left: '-30%',
              background: [
                'radial-gradient(ellipse 800px 600px at 20% 20%, rgba(61,90,128,0.1) 0%, transparent 70%)',
                'radial-gradient(ellipse 600px 700px at 80% 80%, rgba(157,120,85,0.08) 0%, transparent 70%)',
                'radial-gradient(ellipse 500px 500px at 60% 40%, rgba(61,90,128,0.06) 0%, transparent 70%)',
              ].join(', '),
            }}
          />
        </div>

        {/* Dot grid */}
        <div className="dot-pattern absolute inset-0 z-[1]" />

        {/* Topographic lines */}
        <div className="topo-lines z-[2]">
          <svg viewBox="0 0 1400 900" fill="none" className="w-full h-full preserveAspectRatio-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 180 C300 160, 700 240, 1500 180" stroke="#0a0a0f" strokeWidth="0.8" />
            <path d="M-100 280 C400 260, 800 330, 1500 280" stroke="#0a0a0f" strokeWidth="0.6" />
            <path d="M-100 380 C350 360, 750 420, 1500 380" stroke="#0a0a0f" strokeWidth="0.5" />
            <path d="M-100 480 C420 460, 780 520, 1500 480" stroke="#0a0a0f" strokeWidth="0.4" />
            <path d="M-100 580 C380 560, 720 620, 1500 580" stroke="#0a0a0f" strokeWidth="0.5" />
            <path d="M-100 680 C360 660, 760 720, 1500 680" stroke="#0a0a0f" strokeWidth="0.4" />
          </svg>
        </div>

        {/* Grain overlay */}
        <div className="grain absolute inset-0 z-[3]" />

        {/* ── Content ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6 py-10"
        >

          {/* Logo */}
          {/* <motion.div variants={itemVariants as any} className="mb-12">
            <div className="relative p-[1px] rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(10,10,15,0.1), rgba(10,10,15,0.04))' }}>
              <div className="rounded-2xl border border-black/[0.08] bg-[#fefdfb]/80 backdrop-blur-sm p-4 shadow-[0_2px_12px_rgba(10,10,15,0.06)]">
                <Image
                  src="/images/stampleyLogo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div> */}

          {/* Badge */}
          {/* <motion.div variants={itemVariants as any} className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fefdfb]/60 backdrop-blur-sm px-4 py-2 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3d5a80]/60" />
              <span className="f-mono text-[9px] uppercase tracking-[0.25em] text-black/50 select-none">
                Intelligence Layer
              </span>
            </div>
          </motion.div> */}

          {/* Heading */}
          <motion.div variants={itemVariants as any} className="text-center mb-6">
            <h1
              className="f-display font-light leading-[1.06] text-[#0a0a0f] select-none"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.025em' }}
            >
              Daily <em className="italic font-light text-black/30">Check-In</em>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.div variants={itemVariants as any} className="text-center max-w-[500px] mb-6">
            <p className="text-[14px] font-light leading-[1.75] text-black/50">
              A few minutes each day to reflect on how{' '}
              <span className="text-[#0a0a0f] font-normal">diabetes felt today</span>.{' '}
              Stampley is here to listen, support, and walk with you.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants as any} className="mb-20 flex items-center gap-4">
            <div className="h-px w-10 divider-line" />
            <span className="f-mono text-[8.5px] uppercase tracking-[0.22em] text-black/30 select-none">
              AIDES-T2D Study Portal
            </span>
            <div className="h-px w-10 divider-line" />
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={itemVariants as any}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl"
          >
            {[
              {
                icon: <ShieldCheck className="w-[15px] h-[15px]" style={{ color: '#3d5a80' }} />,
                title: 'Private & Confidential',
                desc: 'Your reflections are encrypted and shared only with the research team, per IRB protocol.',
              },
              {
                icon: <Zap className="w-[15px] h-[15px]" style={{ color: '#3d5a80' }} />,
                title: 'Takes Under 5 Minutes',
                desc: 'Six simple questions — a distress rating, mood sliders, context tags, and a brief reflection.',
              },
              {
                icon: <Globe className="w-[15px] h-[15px]" style={{ color: '#3d5a80' }} />,
                title: 'Personalized Support',
                desc: 'Stampley responds to what you share with empathy, a coping skill, and an encouraging close.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="feature-card rounded-2xl border border-black/[0.07] bg-[#fefdfb]/50 backdrop-blur-sm px-7 py-6 shadow-[0_1px_6px_rgba(10,10,15,0.04)]"
              >
                <div className="mb-4 flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-black/[0.07] bg-white shadow-[0_1px_3px_rgba(10,10,15,0.04)]">
                  {card.icon}
                </div>
                <h3 className="f-body text-[13.5px] font-semibold text-[#0a0a0f] mb-2">
                  {card.title}
                </h3>
                <p className="text-[12.5px] font-light leading-[1.65] text-black/50">
                  {card.desc}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Bottom stat strip */}
          {/* <motion.div variants={itemVariants as any} className="mt-16 flex items-center gap-0">
            {[
              { value: '240+', label: 'Active Studies' },
              { value: '18k',  label: 'Participants' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-[5px] px-10 ${i > 0 ? 'border-l border-black/[0.08]' : ''}`}
              >
                <span className="f-display text-[26px] font-normal leading-none tracking-[-0.02em] text-[#0a0a0f]/80">
                  {stat.value}
                </span>
                <span className="f-mono text-[9px] uppercase tracking-[0.16em] text-black/35 select-none">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div> */}

        </motion.div>

        {/* Corner watermark */}
        <div className="absolute bottom-8 right-10 z-10 f-mono text-[8.5px] uppercase tracking-[0.2em] text-black/[0.15] select-none">
          Secure · HIPAA Compliant
        </div>

      </div>
    </>
  );
}