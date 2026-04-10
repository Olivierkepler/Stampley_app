import { auth } from "@/lib/auth";
import { canAccessAdminRoutes } from "@/lib/auth.config";
import { UserDashboardNav } from "@/components/dashboard/user-dashboard-nav";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Standard shadcn/ui utility
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();
  
  const showAdminLink = canAccessAdminRoutes(
    session?.user?.email ?? null,
    session?.user?.role
  );

  return (
    <header className={cn(
      "anim-header sticky top-0 z-50 w-full",
      "border-b border-black/[0.06] bg-[#fefdfb]/80 backdrop-blur-xl",
      "transition-all duration-300"
    )}>
      {/* Note: Move the @import and .grain CSS to your globals.css 
         to prevent re-injecting it every time this component renders.
      */}
      
      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        
        {/* Brand Section */}
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

        {/* Navigation Section */}
        <nav aria-label="Main Navigation">
          <UserDashboardNav showAdminLink={!!showAdminLink} /> 
        </nav>
      </div>
    </header>
  );
}