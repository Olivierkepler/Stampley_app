"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  
  { href: "/dashboard", label: "Home" },
  { href: "/check-in", label: "Check-in" },

] as const;

export function UserDashboardNav({ showAdminLink }: { showAdminLink: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-wrap items-center justify-end gap-3">
      <nav className="flex flex-wrap gap-1" aria-label="Study portal">
        {links.map(({ href, label }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#3d5a80] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
        {showAdminLink && (
          <Link
            href="/admin/keys"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Admin tools
          </Link>
        )}
      </nav>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/login" })}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Sign out
      </button>
    </div>
  );
}
