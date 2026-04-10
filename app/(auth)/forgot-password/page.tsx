"use client";
import { requestPasswordReset } from "@/actions/password-reset";
import Link from "next/link";
import { useActionState } from "react";
import Image from "next/image";

type ForgotState =
  | null
  | { success: true; message: string; email: string }
  | { error: string };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: ForgotState, formData: FormData): Promise<ForgotState> => {
      const submittedEmail = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase();
      type RequestResult = { error: string } | { success: true; message: string };
      const result = (await requestPasswordReset(formData)) as RequestResult;
      if ("error" in result) return { error: result.error };
      return { success: true as const, message: result.message, email: submittedEmail };
    },
    null as ForgotState
  );

  const error = state && "error" in state ? state.error : null;
  const successMessage = state && "success" in state && state.success ? state.message : null;
  const successEmail = state && "success" in state && state.success ? state.email : null;

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
          z-index: 1;
        }

        .dot-pattern::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(10,10,15,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.5;
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
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .anim-brand   { opacity: 0; animation: fadeDown 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; }
        .anim-hero    { opacity: 0; animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.25s forwards; }
        .anim-info    { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; }
        .anim-form    { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; }
        .anim-success { opacity: 0; animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; }

        .input-group:focus-within .input-icon {
          stroke: #3d5a80;
          transform: translateY(-50%) scale(1.06);
        }

        .styled-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #f5f2ec inset !important;
          -webkit-text-fill-color: #0a0a0f !important;
        }
        .styled-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px #fefdfb inset !important;
        }

        .btn-shimmer::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transition: left 0.6s ease;
        }
        .btn-shimmer:hover:not(:disabled)::before { left: 120%; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }

        @keyframes pulseRing {
          0%   { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        .pulse-ring::before {
          content: '';
          position: absolute; inset: -8px;
          border-radius: 50%;
          border: 1.5px solid rgba(61,90,128,0.3);
          animation: pulseRing 2s ease-out infinite;
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 4px; }
      `}</style>

      <div className="f-body relative flex min-h-screen overflow-hidden bg-[#f5f2ec]">

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


        {/* LEFT — Dark editorial panel */}
        <div className="grain hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between px-14 py-18 bg-[#0a0a0f] text-white">

          {/* Mesh gradient */}
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

          {/* Topographic lines */}
          <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none">
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
              <span className="f-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/40 select-none">
                Stampley Portal
              </span>
            </div>

            {/* Hero copy */}
            <div className="anim-hero max-w-[520px]">
              <p className="f-mono mb-7 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-[#5b7ea1]">
                <span className="inline-block h-px w-7 bg-[#5b7ea1] opacity-50" />
                Account Recovery
              </p>
              <h1
                className="f-display mb-6 font-light leading-[1.08] text-white/[0.93] select-none"
                style={{ fontSize: 'clamp(38px, 4.2vw, 62px)', letterSpacing: '-0.02em' }}
              >
                Regain access
                <br /> <em className="italic font-light text-white/30">
                to your Stampley portal.</em>
              </h1>
              <p className="max-w-[380px] text-sm font-light leading-[1.75] text-white/[0.32]">
                Enter your registered email and we&apos;ll send you a secure
                link to reset your password and restore access to your account.
              </p>
            </div>

            {/* Security info cards */}
            <div className="anim-info max-w-[420px] flex flex-col gap-3">
              <p className="f-mono mb-2 text-[9px] uppercase tracking-[0.22em] text-white/25 select-none">
                What happens next
              </p>
              {[
                {
                  icon: (
                    <svg className="h-[14px] w-[14px] stroke-[#5b7ea1]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2.5" />
                      <path d="m2 7 10 7 10-7" />
                    </svg>
                  ),
                  title: 'Check your inbox',
                  desc: 'A reset link will arrive within a few minutes.',
                },
                {
                  icon: (
                    <svg className="h-[14px] w-[14px] stroke-[#5b7ea1]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: 'Link expires in 1 hour',
                  desc: 'For your security, reset links are single-use and time-limited.',
                },
                {
                  icon: (
                    <svg className="h-[14px] w-[14px] stroke-[#5b7ea1]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                  ),
                  title: 'Can\'t find it?',
                  desc: 'Check your spam folder or contact your study coordinator.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-4">
                  <div className="mt-[1px] shrink-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#3d5a80]/30 bg-[#3d5a80]/08">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white/60 mb-[2px]">{item.title}</p>
                    <p className="text-[11px] font-light text-white/25 leading-[1.5]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom stat row */}
            <div className="flex items-center gap-6">
              {[
                { value: '<2min', label: 'Avg. delivery' },
                { value: '1hr', label: 'Link validity' },
                { value: 'TLS', label: 'Encrypted' },
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
            Secure · HIPAA Compliant
          </div>
        </div>

        {/* RIGHT — Form panel */}
        <div className="dot-pattern relative flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:shrink-0 lg:bg-[#fefdfb] lg:px-14 lg:py-16 lg:shadow-[inset_1px_0_0_rgba(10,10,15,0.04),-32px_0_80px_rgba(10,10,15,0.04)]">
          <div className="anim-form relative z-10 w-full max-w-[380px]">

            {successMessage ? (
              /* ── Success state ── */
              <div className="anim-success flex flex-col items-center text-center">
                {/* Animated envelope icon */}
                <div className="relative mb-8">
                  <div className="pulse-ring relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#3d5a80]/20 bg-[#3d5a80]/[0.06]">
                    <svg className="h-[30px] w-[30px]" viewBox="0 0 24 24" fill="none"
                      stroke="#3d5a80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2.5" />
                      <path d="m2 7 10 7 10-7" />
                    </svg>
                  </div>
                </div>

                <div className="f-mono mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/50 select-none">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                  Email Sent
                </div>

                <h2
                  className="f-display mb-3 text-[34px] font-normal leading-[1.1] text-[#0a0a0f]"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Check your inbox.
                </h2>

                <p className="mb-2 text-[13px] font-light leading-[1.7] text-black/55">
                  We&apos;ve sent a reset link to{' '}
                  <span className="f-mono text-[12px] font-medium text-[#0a0a0f] bg-black/[0.05] px-2 py-0.5 rounded-md">
                    {successEmail}
                  </span>
                </p>
                <p className="text-[12px] font-light text-black/40 leading-[1.6]">
                  Click the link in the email to set a new password.<br />
                  It expires in 1 hour.
                </p>

                {successMessage && (
                  <div className="mt-6 w-full flex items-start gap-2.5 rounded-xl border border-emerald-100/80 bg-emerald-50/60 px-4 py-3 text-[12px] leading-relaxed text-emerald-800">
                    <svg className="mt-[1px] h-3.5 w-3.5 shrink-0 text-emerald-600" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4 12 14.01l-3-3" />
                    </svg>
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="mt-8 w-full border-t border-black/[0.08] pt-6">
                  <p className="text-[12px] font-light text-black/50 mb-4">
                    Didn&apos;t receive anything? Check your spam folder or try again.
                  </p>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full rounded-[10px] border border-black/[0.1] bg-transparent py-[13px] f-body text-[12.5px] font-medium text-black/70 transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.03]"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="mb-10">
                  <div className="f-mono mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/60 select-none">
                    <span className="inline-block h-2 w-2 rounded-[3px] border-[1.5px] border-[#3d5a80] opacity-50" />
                    Account Recovery
                  </div>
                  <h2
                    className="f-display mb-2 text-[36px] font-normal leading-[1.1] text-[#0a0a0f]"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    Reset password.
                  </h2>
                  <p className="text-[13px] font-light leading-[1.6] text-black/60">
                    Enter your email and we&apos;ll send you a link to choose a new password.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-100/80 bg-red-50/60 px-4 py-3 text-[12.5px] leading-relaxed text-[#9b2226]">
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
                <form action={formAction} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none">
                      Email Address
                    </label>
                    <div className="input-group relative">
                      <svg
                        className="input-icon pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-black/40 transition-all duration-200"
                        viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2.5" />
                        <path d="m2 7 10 7 10-7" />
                      </svg>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        disabled={pending}
                        className="styled-input f-body w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] pl-[42px] pr-4 text-[13.5px] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/40 focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-shimmer relative mt-1 w-full cursor-pointer overflow-hidden rounded-[10px] border-none bg-[#0a0a0f] px-6 py-[14px] f-body text-[13px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_4px_16px_rgba(10,10,15,0.18),0_1px_3px_rgba(10,10,15,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:not-disabled:-translate-y-px hover:not-disabled:bg-[#1a1a24] hover:not-disabled:shadow-[0_8px_28px_rgba(10,10,15,0.25),0_2px_6px_rgba(10,10,15,0.15)] active:not-disabled:translate-y-0 active:not-disabled:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {pending ? (
                        <>
                          <span className="spinner inline-block h-3.5 w-3.5 rounded-full border-[1.5px] border-white/20 border-t-white" />
                          <span className="text-[11px] tracking-[0.12em]">Sending…</span>
                        </>
                      ) : (
                        <>
                          Send reset link
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
                  <p className="text-center text-[12.5px] font-light text-black/70">
                    Remembered it?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-[#0a0a0f] no-underline border-b border-black/20 transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80]"
                    >
                      Back to sign in
                    </Link>
                  </p>

                  {/* Trust badges */}
                  <div className="mt-1 flex items-center justify-center gap-5 border-t border-black/[0.08] pt-6">
                    {[
                      {
                        label: 'SOC 2',
                        icon: (
                          <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24"
                            fill="none" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        ),
                      },
                      {
                        label: 'HIPAA',
                        icon: (
                          <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24"
                            fill="none" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        ),
                      },
                      {
                        label: '256-bit SSL',
                        icon: (
                          <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24"
                            fill="none" strokeWidth="2.2" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        ),
                      },
                    ].map((badge) => (
                      <div key={badge.label} className="flex items-center gap-1.5">
                        {badge.icon}
                        <span className="f-mono text-[8.5px] uppercase tracking-[0.14em] text-black/50">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}