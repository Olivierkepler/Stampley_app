"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin/keys", label: "Study keys" },
  { href: "/admin/users", label: "Users" },
 
] as const;

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-wrap items-center justify-end gap-3">
      <nav className="flex flex-wrap gap-2 " aria-label="Admin sections">
        {links.map(({ href, label }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`f-mono rounded-lg px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                active
                  ? "bg-[#3d5a80] text-white shadow-sm"
                  : "bg-black/[0.03] text-black/60 hover:bg-black/[0.06] hover:text-black/80"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/admin/login" })}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-4 py-2.5 text-[12px] font-medium text-black/70 shadow-sm transition-all duration-200 hover:border-black/[0.12] hover:bg-black/[0.02] hover:text-black/80"
      >
        <LogOut className="h-3.5 w-3.5" aria-hidden />
        Sign out
      </button>
    </div>
  );
}