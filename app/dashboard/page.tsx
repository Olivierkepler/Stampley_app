import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      studyId: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const joined = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(user.createdAt);

  const daysSince = Math.floor(
    (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

        .f-display { font-family: 'Fraunces', Georgia, serif; }
        .f-mono    { font-family: 'JetBrains Mono', monospace; }
        .f-body    { font-family: 'Outfit', system-ui, sans-serif; }

        .grain::after {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.45;
          pointer-events: none;
          z-index: 50;
        }

        .dot-bg::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, rgba(10,10,15,0.03) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes widthGrow {
          from { width: 0; }
          to   { width: 100%; }
        }
        .anim-nav    { opacity: 0; animation: fadeDown 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards; }
        .anim-hero   { opacity: 0; animation: fadeUp  0.85s cubic-bezier(0.22,1,0.36,1) 0.12s forwards; }
        .anim-card-1 { opacity: 0; animation: scaleIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s forwards; }
        .anim-card-2 { opacity: 0; animation: scaleIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.32s forwards; }
        .anim-card-3 { opacity: 0; animation: scaleIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.42s forwards; }
        .anim-bottom { opacity: 0; animation: fadeUp  0.8s cubic-bezier(0.22,1,0.36,1) 0.5s  forwards; }

        .card-hover {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(10,10,15,0.08), 0 2px 8px rgba(10,10,15,0.04);
        }

        .accent-bar {
          width: 0;
          animation: widthGrow 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s forwards;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.6); }
        }
        .status-pulse { animation: pulse 2.5s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 4px; }
      `}</style>

      <div className="grain dot-bg f-body relative min-h-screen bg-[#f5f2ec]">

        {/* ── NAV ── */}
        {/* <nav className="anim-nav relative z-10 flex items-center justify-between border-b border-black/[0.06] bg-[#fefdfb]/80 backdrop-blur-xl px-6 py-4 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-black/[0.08] bg-[#0a0a0f]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="f-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-black/70 select-none">
                Study Portal
              </span>
              <span className="text-[11px] font-light text-black/60">Research Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative flex h-2 w-2 items-center justify-center">
                <span className="status-pulse absolute h-2 w-2 rounded-full bg-emerald-400/40" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="f-mono text-[9px] uppercase tracking-[0.14em] text-black/60">
                Active Session
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3d5a80] text-[11px] font-semibold uppercase text-white/90 select-none">
              {user.email.charAt(0)}
            </div>
          </div>
        </nav> */}

        {/* ── MAIN ── */}
        <main className="relative z-10 mx-auto max-w-8xl px-6 py-8">

          {/* Hero */}
          <div className="anim-hero mb-12">
            <p className="f-mono mb-5 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-[#3d5a80]">
              <span className="inline-block h-px w-7 bg-[#3d5a80] opacity-60" />
              Dashboard
            </p>
            <h1
              className="f-display mb-3 font-light text-[#0a0a0f] select-none"
              style={{ fontSize: 'clamp(32px, 4vw, 50px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Welcome back.
            </h1>
            <p className="max-w-[460px] text-[14.5px] font-light leading-[1.7] text-black/70">
              {user.email}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/check-in"
                className="inline-flex bg-[#3d5a80] text-white shadow-sm items-center justify-center rounded-full  px-6 py-3 text-[14px] font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
              >
                Start Check-in
              </Link>
            </div>
            <div className="mt-8 h-px bg-gradient-to-r from-[#3d5a80]/40 via-[#9d7855]/25 to-transparent accent-bar" />
          </div>

          {/* Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Study Enrollment */}
            <section className="anim-card-1 card-hover group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-[#fefdfb] p-7 shadow-[0_1px_3px_rgba(10,10,15,0.03)]">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#3d5a80]/[0.04] transition-transform duration-500 group-hover:scale-125" />
              <div className="relative">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d5a80]/[0.08]">
                    <svg className="h-[15px] w-[15px] text-[#3d5a80]" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <h2 className="f-mono text-[9px] font-medium uppercase tracking-[0.18em] text-black/70">
                    Study Enrollment
                  </h2>
                </div>
                <div className="mb-3">
                  {user.studyId ? (
                    <span className="f-mono inline-flex items-center gap-2 rounded-lg border border-[#3d5a80]/15 bg-[#3d5a80]/[0.06] px-3.5 py-2 text-[15px] font-medium tracking-[0.04em] text-[#3d5a80]">
                      <svg className="h-3 w-3 text-[#3d5a80]/50" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      {user.studyId}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-[14px] font-light text-black/60">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-black/25">
                        <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
                      </span>
                      Not assigned yet
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] font-light leading-[1.65] text-black/60">
                  Your study ID links your account to the research&nbsp;team.
                </p>
              </div>
            </section>

            {/* Account */}
            <section className="anim-card-2 card-hover group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-[#fefdfb] p-7 shadow-[0_1px_3px_rgba(10,10,15,0.03)]">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#9d7855]/[0.04] transition-transform duration-500 group-hover:scale-125" />
              <div className="relative">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9d7855]/[0.08]">
                    <svg className="h-[15px] w-[15px] text-[#9d7855]" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h2 className="f-mono text-[9px] font-medium uppercase tracking-[0.18em] text-black/70">
                    Account
                  </h2>
                </div>
                <p className="f-display mb-1 text-[26px] font-light leading-none text-[#0a0a0f]"
                  style={{ letterSpacing: '-0.02em' }}>
                  {joined}
                </p>
                <p className="mb-3 text-[12px] font-light text-black/60">Member since</p>
                <div className="flex items-center gap-2 rounded-lg bg-black/[0.025] px-3 py-2">
                  <span className="f-display text-[18px] font-normal text-[#0a0a0f]">{daysSince}</span>
                  <span className="f-mono text-[8.5px] uppercase tracking-[0.14em] text-black/60">
                    days enrolled
                  </span>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="anim-card-3 card-hover group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-[#fefdfb] p-7 shadow-[0_1px_3px_rgba(10,10,15,0.03)] sm:col-span-2 lg:col-span-1">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/[0.04] transition-transform duration-500 group-hover:scale-125" />
              <div className="relative">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/[0.08]">
                    <svg className="h-[15px] w-[15px] text-emerald-600" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <h2 className="f-mono text-[9px] font-medium uppercase tracking-[0.18em] text-black/70">
                    Quick Actions
                  </h2>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'View study materials', icon: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V6.5A2.5 2.5 0 016.5 4H20v13H6.5A2.5 2.5 0 004 19.5z' },
                    { label: 'Contact research team', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'Update preferences', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-3 rounded-xl border border-black/[0.05] bg-black/[0.015] px-4 py-3 text-left transition-all duration-200 hover:border-black/[0.1] hover:bg-black/[0.03]"
                    >
                      <svg className="h-3.5 w-3.5 shrink-0 text-black/50" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={action.icon} />
                      </svg>
                      <span className="text-[12.5px] font-light text-black/75">{action.label}</span>
                      <svg className="ml-auto h-3 w-3 text-black/40" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Reflections */}
          <section className="anim-bottom mt-8 relative overflow-hidden rounded-2xl border border-dashed border-black/[0.1] bg-[#fefdfb]/60 p-8 sm:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                background: [
                  'radial-gradient(ellipse 400px 300px at 15% 50%, rgba(61,90,128,0.06) 0%, transparent 70%)',
                  'radial-gradient(ellipse 300px 400px at 85% 50%, rgba(157,120,85,0.04) 0%, transparent 70%)',
                ].join(', '),
              }}
            />
            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-8">
              <div className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-white sm:mb-0">
                <svg className="h-6 w-6 text-[#3d5a80]/60" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div>
                <h2 className="f-display mb-2 text-[22px] font-normal text-[#0a0a0f]"
                  style={{ letterSpacing: '-0.015em' }}>
                  Reflections
                </h2>
                <p className="max-w-[440px] text-[13.5px] font-light leading-[1.7] text-black/65">
                  Your reflection entries will appear here as the study adds
                  this feature. You&apos;ll be notified when journaling becomes available.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="f-mono text-[9px] uppercase tracking-[0.14em] text-black/60">
                    Coming soon
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="anim-bottom mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-8 pb-8 sm:flex-row">
            <div className="flex items-center gap-4">
              {[
                { label: 'SOC 2', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                { label: 'HIPAA', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                { label: '256-bit SSL', icon: 'M3 11h18v11H3zM7 11V7a5 5 0 0110 0v4' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-1.5">
                  <svg className="h-[10px] w-[10px] text-[#3d5a80]/60" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d={badge.icon} />
                  </svg>
                  <span className="f-mono text-[8px] uppercase tracking-[0.14em] text-black/60">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
            <span className="f-mono text-[8.5px] uppercase tracking-[0.18em] text-black/50 select-none">
              Secure · Encrypted · HIPAA Compliant
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}