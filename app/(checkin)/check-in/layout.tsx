import CollapsibleSidebar from "./components/sidebar/CollapsibleSidebar";
import StepDock from "./components/navigation/StepDock";
import PageTransition from "./components/navigation/PageTransition";
import CheckInUserScope from "./CheckInUserScope";
import Navbar from "@/app/dashboard/navbar";
import { auth } from "@/lib/auth";

export default async function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  return (
    <main className="flex flex-col h-screen w-full overflow-hidden bg-[#f5f2ec] font-[Outfit,system-ui,sans-serif]">
      <Navbar />

      <div className="flex h-screen w-full overflow-hidden relative">

        {/* Shared mesh gradient across the whole canvas */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 900px 600px at 10% 20%, rgba(61,90,128,0.06) 0%, transparent 70%)',
              'radial-gradient(ellipse 700px 800px at 90% 80%, rgba(157,120,85,0.04) 0%, transparent 70%)',
            ].join(', '),
          }}
        />

        {/* Dot pattern across the full layout */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(10,10,15,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.5,
          }}
        />

        {/* 1. COLLAPSIBLE SIDEBAR */}
        <CollapsibleSidebar />

        {/* 2. MAIN VIEWPORT */}
        <main className="relative z-10 flex-1 flex flex-col h-full min-w-0">

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32">
            <div className="w-full h-full">
              <PageTransition>
                <CheckInUserScope userId={userId}>{children}</CheckInUserScope>
              </PageTransition>
            </div>
          </div>

          {/* 3. FLOATING NAVIGATION DOCK */}
          <div className="absolute bottom-10 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto w-full max-w-xl px-6">
              <StepDock />
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}