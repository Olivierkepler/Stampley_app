import { AdminNavLinks } from "@/components/admin/admin-nav-links";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      `}</style>

      <div className="grain dot-bg f-body min-h-screen bg-[#f5f2ec]">
        <header className="relative z-10 border-b border-black/[0.06] bg-[#fefdfb]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <Link href="/dashboard" className="flex items-center gap-4">
              
              
              {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-gradient-to-br from-[#3d5a80] to-[#2a4058] shadow-sm">
                <svg 
                  className="h-5 w-5 text-white/90" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div> */}

<Image src="/images/stampleyLogo.png" alt="Stampley Logo" width={30} height={30} />
              <div className="flex flex-col py-2">
                <span className="f-mono text-[9px] font-medium uppercase tracking-[0.22em] text-[#3d5a80]">
                  Portal
                </span>
                <span className="f-display text-[19px] font-normal leading-none text-[#0a0a0f] whitespace-nowrap flex items-center">
                  Stampley 
                </span>
              </div>
            </Link>
            <AdminNavLinks />
          </div>
        </header>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          {children}
        </div>
      </div>
    </>
  );
}