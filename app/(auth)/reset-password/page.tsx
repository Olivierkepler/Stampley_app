// app/(auth)/reset-password/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
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
          opacity: 0.7; pointer-events: none; z-index: 1;
        }

        .dot-pattern::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(10,10,15,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.5; pointer-events: none;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-brand { opacity: 0; animation: fadeDown 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; }
        .anim-hero  { opacity: 0; animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.25s forwards; }
        .anim-tips  { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; }
        .anim-stats { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s forwards; }
        .anim-form  { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 4px; }
      `}</style>

      <div className="f-body relative flex min-h-screen overflow-hidden bg-[#f5f2ec]">

        {/* LEFT — Dark editorial panel */}
        <div className="grain hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between px-14 py-12 bg-[#0a0a0f] text-white">

          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="mesh-drift absolute"
              style={{
                width: '140%', height: '140%', top: '-20%', left: '-20%',
                background: [
                  'radial-gradient(ellipse 600px 500px at 20% 30%, rgba(61,90,128,0.35) 0%, transparent 70%)',
                  'radial-gradient(ellipse 500px 600px at 80% 70%, rgba(157,120,85,0.2) 0%, transparent 70%)',
                  'radial-gradient(ellipse 400px 400px at 50% 50%, rgba(61,90,128,0.15) 0%, transparent 70%)',
                ].join(', '),
              }}
            />
          </div>

          <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none">
            <svg viewBox="0 0 800 900" fill="none" className="w-full h-full">
              <path d="M-50 200 C200 180, 400 260, 850 200" stroke="white" strokeWidth="0.8" />
              <path d="M-50 280 C200 260, 450 340, 850 280" stroke="white" strokeWidth="0.6" />
              <path d="M-50 360 C180 340, 420 400, 850 360" stroke="white" strokeWidth="0.5" />
              <path d="M-50 440 C220 420, 380 480, 850 440" stroke="white" strokeWidth="0.4" />
              <path d="M-50 520 C240 500, 400 560, 850 530" stroke="white" strokeWidth="0.5" />
              <path d="M-50 600 C200 580, 440 640, 850 610" stroke="white" strokeWidth="0.6" />
              <path d="M-50 680 C180 660, 460 720, 850 690" stroke="white" strokeWidth="0.4" />
              <path d="M-50 760 C220 740, 400 800, 850 770" stroke="white" strokeWidth="0.3" />
            </svg>
          </div>

          <div className="relative z-[2] flex flex-col justify-between h-full">

            {/* Brand */}
            <div className="anim-brand flex items-center gap-3.5">
              <Image src="/images/stampleyLogo.png" alt="AIDES-T2D Logo" width={50} height={50} />
              <span className="f-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/40 select-none">
                AIDES-T2D Study Portal
              </span>
            </div>

            {/* Hero */}
            <div className="anim-hero max-w-[520px]">
              <p className="f-mono mb-7 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-[#5b7ea1]">
                <span className="inline-block h-px w-7 bg-[#5b7ea1] opacity-50" />
                Participant Account Recovery
              </p>
              <h1
                className="f-display mb-6 font-light leading-[1.08] text-white/[0.93] select-none"
                style={{ fontSize: 'clamp(38px, 4.2vw, 62px)', letterSpacing: '-0.02em' }}
              >
                Choose a<br />
                new password,{' '}
                <em className="italic font-light text-white/30">one<br />
                last step.</em>
              </h1>
              <p className="max-w-[380px] text-sm font-light leading-[1.75] text-white/[0.32]">
                Create a strong, unique password to secure your AIDES-T2D
                participant account. This link is single-use and expires shortly.
              </p>
            </div>

            {/* Password tips */}
            <div className="anim-tips max-w-[420px]">
              <p className="f-mono mb-4 text-[9px] uppercase tracking-[0.22em] text-white/25 select-none">
                Password tips
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  { check: true,  text: 'At least 8 characters long' },
                  { check: true,  text: 'Mix of uppercase and lowercase letters' },
                  { check: true,  text: 'At least one number or symbol' },
                  { check: false, text: 'Avoid passwords used on other sites' },
                ].map((tip) => (
                  <div key={tip.text} className="flex items-center gap-3">
                    <div className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${tip.check ? 'border-[#3d5a80]/50 bg-[#3d5a80]/10' : 'border-white/10 bg-white/[0.03]'}`}>
                      {tip.check ? (
                        <svg className="h-[9px] w-[9px] stroke-[#5b7ea1]" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg className="h-[9px] w-[9px] stroke-white/20" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[12px] font-light ${tip.check ? 'text-white/45' : 'text-white/20'}`}>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="anim-stats flex items-center">
              {[
                { value: '1×',   label: 'Single-use link' },
                { value: 'AES',  label: 'Encrypted store' },
                { value: 'Safe', label: 'Bcrypt hashed' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col gap-[5px] px-8 ${i === 0 ? 'pl-0' : 'border-l border-white/[0.07]'}`}
                >
                  <span className="f-display text-[26px] font-normal leading-none tracking-[-0.02em] text-white/[0.85]">
                    {stat.value}
                  </span>
                  <span className="f-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-11 right-12 z-[2] f-mono text-[8.5px] uppercase tracking-[0.2em] text-white/[0.08] select-none">
            Secure · HIPAA Compliant · IRB Approved
          </div>
        </div>

        {/* RIGHT — Form panel */}
        <div className="dot-pattern relative flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:shrink-0 lg:bg-[#fefdfb] lg:px-14 lg:py-16 lg:shadow-[inset_1px_0_0_rgba(10,10,15,0.04),-32px_0_80px_rgba(10,10,15,0.04)]">
          <div className="anim-form relative z-10 w-full max-w-[380px]">

            {/* Header */}
            <div className="mb-10">
              <div className="f-mono mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/60 select-none">
                <span className="inline-block h-2 w-2 rounded-[3px] border-[1.5px] border-[#3d5a80] opacity-50" />
                Participant Password Reset
              </div>
              <h2
                className="f-display mb-2 text-[36px] font-normal leading-[1.1] text-[#0a0a0f]"
                style={{ letterSpacing: '-0.02em' }}
              >
                Set new password.
              </h2>
              <p className="text-[13px] font-light leading-[1.6] text-black/60">
                Choose a strong password to regain access to your
                AIDES-T2D check-in dashboard.
              </p>
            </div>

            {/* Form (client) */}
            <Suspense
              fallback={
                <div className="flex flex-col gap-5">
                  <div className="h-[46px] animate-pulse rounded-[10px] bg-black/[0.04]" />
                  <div className="h-[46px] animate-pulse rounded-[10px] bg-black/[0.04]" />
                  <div className="h-[46px] animate-pulse rounded-[10px] bg-black/[0.04]" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>

            {/* Footer */}
            <div className="mt-8 flex flex-col gap-5">
              <p className="text-center text-[12.5px] font-light text-black/70">
                <Link
                  href="/login"
                  className="font-medium text-[#0a0a0f] no-underline border-b border-black/20 transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80]"
                >
                  ← Back to sign in
                </Link>
              </p>

              <div className="mt-1 flex items-center justify-center gap-5 border-t border-black/[0.08] pt-6">
                {[
                  { label: 'IRB Approved', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', type: 'path' },
                  { label: 'HIPAA',        d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', type: 'path' },
                  { label: '256-bit SSL',  type: 'lock' },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-1.5">
                    <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24"
                      fill="none" strokeWidth="2.2" strokeLinecap="round">
                      {badge.type === 'lock' ? (
                        <>
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </>
                      ) : (
                        <path d={badge.d} />
                      )}
                    </svg>
                    <span className="f-mono text-[8.5px] uppercase tracking-[0.14em] text-black/50">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}