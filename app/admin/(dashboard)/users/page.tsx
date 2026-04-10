export const dynamic = 'force-dynamic'

import { createManualUser, updateUserRole } from "@/actions/users";
import { prisma } from "@/lib/prisma";
import { AddUserSection } from "./add-user-collapsible";
import { DeleteUserButton } from "./delete-user-button";

/** Matches `enum Role` in `prisma/schema.prisma` (no import from `@prisma/client`). */
type Role = "ADMIN" | "PARTICIPANT";

function nextToggledRole(current: Role): Role {
  return current === "ADMIN" ? "PARTICIPANT" : "ADMIN";
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pb-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d5a80]/[0.08]">
            <svg 
              className="h-5 w-5 text-[#3d5a80]" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div> */}
          <div>
            <h1 className="f-display mb-1 text-[28px] font-normal leading-none text-[#0a0a0f]" style={{ letterSpacing: '-0.02em' }}>
              User Management
            </h1>
            <p className="f-mono text-[9px] uppercase tracking-[0.18em] text-black/50">
              Admin Portal
            </p>
          </div>
        </div>
        <p className="max-w-2xl text-[13.5px] font-light leading-[1.7] text-black/60">
          Create accounts manually or change participant / administrator roles.
          Passwords are stored hashed; existing users are unchanged until you use
          the actions below.
        </p>
      </div>

      {/* Add User Section */}
      {/* <section className="mb-10 overflow-hidden rounded-2xl border border-black/[0.06] bg-[#fefdfb] p-7 shadow-[0_1px_3px_rgba(10,10,15,0.03)]">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/[0.08]">
            <svg 
              className="h-[15px] w-[15px] text-emerald-600" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2 className="f-mono text-[10px] font-medium uppercase tracking-[0.16em] text-black/60">
            Add User
          </h2>
        </div>

        <form action={createManualUser} className="grid max-w-xl gap-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[12px] font-medium text-black/70"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-black/[0.1] bg-white px-4 py-2.5 text-[13px] text-black/80 outline-none transition-all duration-200 placeholder:text-black/30 focus:border-[#3d5a80] focus:ring-2 focus:ring-[#3d5a80]/20"
              placeholder="participant@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[12px] font-medium text-black/70"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-lg border border-black/[0.1] bg-white px-4 py-2.5 text-[13px] text-black/80 outline-none transition-all duration-200 placeholder:text-black/30 focus:border-[#3d5a80] focus:ring-2 focus:ring-[#3d5a80]/20"
              placeholder="••••••••"
            />
            <p className="mt-1.5 text-[11px] text-black/40">Minimum 8 characters</p>
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-[12px] font-medium text-black/70"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full rounded-lg border border-black/[0.1] bg-white px-4 py-2.5 text-[13px] text-black/80 outline-none transition-all duration-200 focus:border-[#3d5a80] focus:ring-2 focus:ring-[#3d5a80]/20"
              defaultValue="PARTICIPANT"
            >
              <option value="PARTICIPANT">Participant</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#3d5a80] to-[#2a4058] px-5 py-3 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110"
            >
              <svg 
                className="h-4 w-4" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Create User
            </button>
          </div>
        </form>
      </section> */}
      <AddUserSection createManualUser={createManualUser} />  
      {/* All Users Section */}
      <section>
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9d7855]/[0.08]">
            <svg 
              className="h-[15px] w-[15px] text-[#9d7855]" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h2 className="f-mono text-[10px] font-medium uppercase tracking-[0.16em] text-black/60">
            All Users
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#fefdfb] shadow-[0_1px_3px_rgba(10,10,15,0.03)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06] bg-black/[0.02]">
                <th className="f-mono px-5 py-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                  Email
                </th>
                <th className="f-mono px-5 py-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                  Role
                </th>
                <th className="f-mono px-5 py-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                  Study ID
                </th>
                <th className="f-mono px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {users.map((u: (typeof users)[number]) => {
                const toggled = nextToggledRole(u.role);
                return (
                  <tr 
                    key={u.id} 
                    className="transition-colors duration-150 hover:bg-black/[0.015]"
                  >
                    <td className="px-5 py-4 text-[13px] font-medium text-[#0a0a0f]">
                      {u.email}
                    </td>
                    <td className="px-5 py-4">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200/50 bg-violet-50/50 px-3 py-1.5 text-[11px] font-medium text-violet-800">
                          <svg 
                            className="h-3 w-3" 
                            viewBox="0 0 24 24" 
                            fill="none"
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/50 bg-slate-50/50 px-3 py-1.5 text-[11px] font-medium text-slate-700">
                          <svg 
                            className="h-3 w-3" 
                            viewBox="0 0 24 24" 
                            fill="none"
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          PARTICIPANT
                        </span>
                      )}
                    </td>
                    <td className="f-mono px-5 py-4 text-[12px] text-black/70">
                      {u.studyId ?? (
                        <span className="text-black/30">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <form
                          action={updateUserRole.bind(null, u.id, toggled)}
                        >
                          <button
                            type="submit"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-black/[0.1] bg-white px-3 py-2 text-[12px] font-medium text-black/70 transition-all duration-200 hover:border-black/[0.15] hover:bg-black/[0.02] hover:text-black/80"
                            title={`Set role to ${toggled}`}
                          >
                            <svg 
                              className="h-3.5 w-3.5" 
                              viewBox="0 0 24 24" 
                              fill="none"
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polyline points="23 4 23 10 17 10" />
                              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                            </svg>
                            Toggle → {toggled}
                          </button>
                        </form>
                        <DeleteUserButton userId={u.id} email={u.email} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-black/[0.1] bg-[#fefdfb]/60 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-black/[0.06] bg-white">
            <svg 
              className="h-5 w-5 text-black/30" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <p className="text-[13.5px] font-light text-black/60">
            No users found. Create your first user using the form above.
          </p>
        </div>
      )}
    </div>
  );
}