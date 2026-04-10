// import { UserDashboardNav } from "@/components/dashboard/user-dashboard-nav";
import { auth } from "@/lib/auth";
import { canAccessAdminRoutes } from "@/lib/auth.config";
import Navbar from "./navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const showAdminLink = canAccessAdminRoutes(
    session?.user?.email ?? null,
    session?.user?.role
  );

  return (
    <>
     
      <div className="grain dot-bg f-body relative min-h-screen bg-[#f5f2ec]">

        {/* ── Header ── */}
       <Navbar />

        {/* ── Content ── */}
        <div className="anim-content relative z-10 mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          {children}
        </div>
      </div>
    </>
  );
}