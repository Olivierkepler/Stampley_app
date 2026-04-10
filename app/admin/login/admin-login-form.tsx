"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setIsLoading(false);
        return;
      }

      router.push("/admin/keys");
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  }

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

        /* Darker grain for admin */
        .grain::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.9;
          pointer-events: none;
          z-index: 1;
        }

        /* Dark dot pattern for admin panel */
        .dot-pattern-dark::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.8;
          pointer-events: none;
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
        .anim-perms { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; }
        .anim-stats { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s forwards; }
        .anim-form  { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; }

        /* Amber-tinted focus for admin inputs */
        .input-group-admin:focus-within .input-icon-admin {
          stroke: #b45309;
          transform: translateY(-50%) scale(1.06);
        }

        .styled-input-admin:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #111118 inset !important;
          -webkit-text-fill-color: #f4f4f5 !important;
        }
        .styled-input-admin:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px #18181f inset !important;
        }

        .btn-amber-shimmer::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: left 0.6s ease;
        }
        .btn-amber-shimmer:hover:not(:disabled)::before { left: 120%; }

        /* Amber glow on submit */
        .btn-amber-shimmer:hover:not(:disabled) {
          box-shadow: 0 8px_28px rgba(180,83,9,0.35), 0 2px 6px rgba(180,83,9,0.2);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }

        /* Amber scanner line */
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0.6; }
          50%  { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line::after {
          content: '';
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(217,119,6,0.4), transparent);
          animation: scanLine 3.5s ease-in-out infinite;
        }

        /* Access level badge glow */
        .badge-glow {
          box-shadow: 0 0 12px rgba(217,119,6,0.2), 0 0 0 1px rgba(217,119,6,0.15);
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
      `}</style>

      <div className="f-body relative flex min-h-screen overflow-hidden bg-[#0c0c12]">

      <div className="absolute left-6 top-6 z-20">
        <a
          href="/login"
          className="flex items-center gap-2 px-3 py-3 rounded-full cursor-pointer hover:scale-105 transition text-[#0a0a0f] text-sm font-medium shadow border border-white/10 hover:border-white/20"
          aria-label="Go to login"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#3d5a80] transition-transform group-hover:-translate-x-0.5 "
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </a>
      </div>

        {/* LEFT — Ultra-dark editorial panel with amber accents */}
        <div className="grain hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between px-14 py-18 bg-[#08080d] text-white">

          {/* Mesh gradient — amber tinted for admin */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="mesh-drift absolute"
              style={{
                width: '140%', height: '140%', top: '-20%', left: '-20%',
                background: [
                  'radial-gradient(ellipse 600px 500px at 20% 30%, rgba(120,53,15,0.22) 0%, transparent 70%)',
                  'radial-gradient(ellipse 500px 600px at 80% 70%, rgba(61,90,128,0.12) 0%, transparent 70%)',
                  'radial-gradient(ellipse 500px 400px at 60% 20%, rgba(180,83,9,0.1) 0%, transparent 70%)',
                ].join(', '),
              }}
            />
          </div>

          {/* Topographic lines */}
          <div className="absolute inset-0 z-[1] opacity-[0.035] pointer-events-none">
            <svg viewBox="0 0 800 900" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
              <Image src="/images/stampleyLogo.png" alt="Logo" width={50} height={50} />
              <span className="f-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/30 select-none">
                Stampley Portal
              </span>
            </div>

            {/* Hero copy */}
            <div className="anim-hero max-w-[520px]">
              <p className="f-mono mb-7 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-amber-600/70">
                <span className="inline-block h-px w-7 bg-amber-600/50" />
                Administrator Console
              </p>
              <h1
                className="f-display mb-6 font-light leading-[1.08] text-white/[0.88] select-none"
                style={{ fontSize: 'clamp(38px, 4.2vw, 62px)', letterSpacing: '-0.02em' }}
              >
                Stampley 
                control, <br />
                 <em className="italic font-light text-white/20">for those
                who run it.</em>
              </h1>
              <p className="max-w-[380px] text-sm font-light leading-[1.75] text-white/[0.25]">
                Manage study keys, participant access, and operational
                oversight across all active research programs.
              </p>
            </div>

            {/* Permission tiles */}
            <div className="anim-perms max-w-[420px]">
              <p className="f-mono mb-4 text-[9px] uppercase tracking-[0.22em] text-white/20 select-none">
                Admin access includes
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: '⬡', label: 'Study Key Management' },
                  { icon: '⬡', label: 'Participant Accounts' },
                  { icon: '⬡', label: 'Data Export' },
                  { icon: '⬡', label: 'Audit Logs' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3"
                  >
                    <span className="text-amber-600/50 text-[10px]">◆</span>
                    <span className="text-[11.5px] font-light text-white/40">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="anim-stats flex items-center">
              {[
                { value: 'L2', label: 'Access Level' },
                { value: '2FA', label: 'Enforced' },
                { value: 'Full', label: 'Audit Trail' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col gap-[5px] px-8 ${i === 0 ? 'pl-0' : 'border-l border-white/[0.06]'}`}
                >
                  <span className="f-display text-[26px] font-normal leading-none tracking-[-0.02em] text-amber-500/80">
                    {stat.value}
                  </span>
                  <span className="f-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-11 right-12 z-[2] f-mono text-[8.5px] uppercase tracking-[0.2em] text-white/[0.06] select-none">
            Restricted Access · Admin Only
          </div>
        </div>

        {/* RIGHT — Dark form panel */}
        <div className="dot-pattern-dark scan-line relative flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:shrink-0 lg:bg-[#0c0c12] lg:px-14 lg:py-16 lg:shadow-[inset_1px_0_0_rgba(255,255,255,0.03),-32px_0_80px_rgba(0,0,0,0.4)]">
          <div className="anim-form relative z-10 w-full max-w-[380px]">

            {/* Header */}
            <div className="mb-10">
              <div className="f-mono mb-5 inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-amber-600/[0.07] badge-glow px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(217,119,6,0.8)]" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-amber-500/80 select-none">
                  Administrator
                </span>
              </div>
              <h2
                className="f-display mb-2 text-[36px] font-normal leading-[1.1] text-white/90"
                style={{ letterSpacing: '-0.02em' }}
              >
                Admin sign in.
              </h2>
              <p className="text-[13px] font-light leading-[1.6] text-white/35">
                Study keys and admin tools. Participant login is separate.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-900/40 bg-red-950/40 px-4 py-3 text-[12.5px] leading-relaxed text-red-400">
                <svg className="mt-[1px] h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="13" />
                  <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="admin-email" className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-white/40 select-none">
                  Admin Email
                </label>
                <div className="input-group-admin relative">
                  <svg
                    className="input-icon-admin pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-white/25 transition-all duration-200"
                    viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2.5" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@stampley.com"
                    required
                    disabled={isLoading}
                    className="styled-input-admin f-body w-full rounded-[10px] border border-white/[0.08] bg-[#111118] py-[13px] pl-[42px] pr-4 text-[13.5px] text-white/85 outline-none transition-all duration-200 placeholder:text-white/20 focus:border-amber-600/50 focus:bg-[#18181f] focus:shadow-[0_0_0_3.5px_rgba(180,83,9,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-password" className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-white/40 select-none">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="f-mono text-[9.5px] tracking-[0.05em] text-amber-600/60 no-underline transition-colors duration-150 hover:text-amber-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="input-group-admin relative">
                  <svg
                    className="input-icon-admin pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-white/25 transition-all duration-200"
                    viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2.5" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                    className="styled-input-admin f-body w-full rounded-[10px] border border-white/[0.08] bg-[#111118] py-[13px] pl-[42px] pr-11 text-[13.5px] text-white/85 outline-none transition-all duration-200 placeholder:text-white/20 focus:border-amber-600/50 focus:bg-[#18181f] focus:shadow-[0_0_0_3.5px_rgba(180,83,9,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-white/25 transition-colors duration-200 hover:text-white/60"
                    aria-label="Toggle password visibility"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit — amber accent */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-amber-shimmer relative mt-1 w-full cursor-pointer overflow-hidden rounded-[10px] border-none bg-amber-600 px-6 py-[14px] f-body text-[13px] font-semibold uppercase tracking-[0.06em] text-zinc-950 shadow-[0_4px_16px_rgba(180,83,9,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:not-disabled:-translate-y-px hover:not-disabled:bg-amber-500 active:not-disabled:translate-y-0 active:not-disabled:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <span className="spinner inline-block h-3.5 w-3.5 rounded-full border-[1.5px] border-zinc-950/20 border-t-zinc-950" />
                      <span className="text-[11px] tracking-[0.12em]">Authenticating…</span>
                    </>
                  ) : (
                    <>
                      Sign in to admin
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 flex flex-col gap-5">
              <p className="text-center text-[12.5px] font-light text-white/35">
                Participant?{" "}
                <Link
                  href="/login"
                  className="font-medium text-amber-500/70 no-underline border-b border-amber-500/20 transition-all duration-200 hover:border-amber-400/50 hover:text-amber-400"
                >
                  Study portal login
                </Link>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="f-mono text-[8px] uppercase tracking-[0.22em] text-white/20 select-none">
                  Restricted
                </span>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>

              {/* Admin trust badges */}
              <div className="flex items-center justify-center gap-5">
                {[
                  {
                    label: 'Role-Based',
                    icon: (
                      <svg className="h-[11px] w-[11px] stroke-amber-600/60" viewBox="0 0 24 24"
                        fill="none" strokeWidth="2.2" strokeLinecap="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Audit Logged',
                    icon: (
                      <svg className="h-[11px] w-[11px] stroke-amber-600/60" viewBox="0 0 24 24"
                        fill="none" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Session Timeout',
                    icon: (
                      <svg className="h-[11px] w-[11px] stroke-amber-600/60" viewBox="0 0 24 24"
                        fill="none" strokeWidth="2.2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    ),
                  },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-1.5">
                    {badge.icon}
                    <span className="f-mono text-[8.5px] uppercase tracking-[0.14em] text-white/25">
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