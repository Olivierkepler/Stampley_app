// app/(auth)/reset-password/reset-password-form.tsx
"use client";

import { resetPasswordWithToken } from "@/actions/password-reset";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(formData: FormData) {
    if (!token) return;
    setLoading(true);
    setError(null);
    formData.set("token", token);
    const result = await resetPasswordWithToken(formData);
    setLoading(false);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    router.push("/login?message=Your password has been updated. Please sign in.");
  }

  /* ── Invalid / missing token state ── */
  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/60 px-4 py-4 text-[12.5px] leading-relaxed text-amber-800">
          <svg className="mt-[1px] h-3.5 w-3.5 shrink-0 stroke-amber-600" viewBox="0 0 24 24"
            fill="none" strokeWidth="1.6" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
          <div>
            <p className="font-medium text-amber-900 mb-1">This link is incomplete.</p>
            <p className="font-light text-amber-700">
              Request a new reset link from the forgot password page.
            </p>
          </div>
        </div>
        <Link
          href="/forgot-password"
          className="flex items-center justify-center gap-2 w-full rounded-[10px] border border-black/[0.1] bg-transparent py-[13px] f-body text-[12.5px] font-medium text-black/70 no-underline transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.03]"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          Request a new link
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  /* ── Strength indicator ── */
  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3d5a80', '#16a34a'][strength];

  return (
    <>
      <style>{`
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

        @keyframes barGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .strength-bar { transform-origin: left; animation: barGrow 0.3s ease forwards; }
      `}</style>

      <form action={handleSubmit} className="flex flex-col gap-5">

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-100/80 bg-red-50/60 px-4 py-3 text-[12.5px] leading-relaxed text-[#9b2226]">
            <svg className="mt-[1px] h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* New password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            New Password
          </label>
          <div className="input-group relative">
            <svg
              className="input-icon pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-black/40 transition-all duration-200"
              viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="styled-input f-body w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] pl-[42px] pr-11 text-[13.5px] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/40 focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-black/40 transition-colors duration-200 hover:text-black/70"
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

          {/* Strength meter */}
          {password.length > 0 && (
            <div className="flex flex-col gap-1.5 px-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} className="h-[3px] flex-1 rounded-full overflow-hidden bg-black/[0.06]">
                    {strength >= level && (
                      <div
                        className="strength-bar h-full w-full rounded-full"
                        style={{ backgroundColor: strengthColor }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="f-mono text-[9px] uppercase tracking-[0.14em]"
                  style={{ color: strengthColor, fontFamily: "'JetBrains Mono', monospace" }}>
                  {strengthLabel}
                </span>
                <span className="f-mono text-[9px] text-black/30 tracking-[0.08em]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Min. 8 characters
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm" className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Confirm Password
          </label>
          <div className="input-group relative">
            <svg
              className="input-icon pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-black/40 transition-all duration-200"
              viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
              className="styled-input f-body w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] pl-[42px] pr-11 text-[13.5px] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/40 focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-black/40 transition-colors duration-200 hover:text-black/70"
              aria-label="Toggle confirm password visibility"
              tabIndex={-1}
            >
              {showConfirm ? (
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-shimmer relative mt-1 w-full cursor-pointer overflow-hidden rounded-[10px] border-none bg-[#0a0a0f] px-6 py-[14px] f-body text-[13px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_4px_16px_rgba(10,10,15,0.18),0_1px_3px_rgba(10,10,15,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:not-disabled:-translate-y-px hover:not-disabled:bg-[#1a1a24] hover:not-disabled:shadow-[0_8px_28px_rgba(10,10,15,0.25),0_2px_6px_rgba(10,10,15,0.15)] active:not-disabled:translate-y-0 active:not-disabled:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="spinner inline-block h-3.5 w-3.5 rounded-full border-[1.5px] border-white/20 border-t-white" />
                <span className="text-[11px] tracking-[0.12em]">Updating…</span>
              </>
            ) : (
              <>
                Update password
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </span>
        </button>
      </form>
    </>
  );
}