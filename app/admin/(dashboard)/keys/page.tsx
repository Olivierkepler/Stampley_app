import { Trash2 } from "lucide-react";
/** Matches `prisma.user.findMany({ select: { email: true, studyId: true } })` */
type UserStudyRow = { email: string; studyId: string | null };
import { deleteStudyKey, generateStudyKey } from "@/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminKeysPage() {
  const [keys, usersWithStudy] = await Promise.all([
    prisma.studyKey.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { studyId: { not: null } },
      select: { email: true, studyId: true },
    }),
  ]);

  const emailByStudyKey = new Map<string, string>(
    usersWithStudy.map((u: UserStudyRow) => [u.studyId as string, u.email])
  );

  return (
    <div className="pb-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d5a80]/[0.08]">
            <svg 
              className="h-5 w-5 text-[#3d5a80]" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div>
            <h1 className="f-display mb-1 text-[28px] font-normal leading-none text-[#0a0a0f]" style={{ letterSpacing: '-0.02em' }}>
              Study ID Management
            </h1>
            <p className="f-mono text-[9px] uppercase tracking-[0.18em] text-black/50">
              Admin Portal
            </p>
          </div>
        </div>
        <p className="max-w-2xl text-[13.5px] font-light leading-[1.7] text-black/60">
          View keys, see which participant email is tied to each used key, and
          remove keys that have not been assigned yet.
        </p>
      </div>

      {/* Generate Button */}
      <form
        action={async () => {
          "use server";
          await generateStudyKey();
        }}
        className="mb-8"
      >
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br from-[#3d5a80] to-[#2a4058] px-5 py-3 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110"
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Generate New Study ID
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#fefdfb] shadow-[0_1px_3px_rgba(10,10,15,0.03)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/[0.06] bg-black/[0.02]">
              <th className="f-mono px-5 py-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                Study ID (Key)
              </th>
              <th className="f-mono px-5 py-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                Status
              </th>
              <th className="f-mono px-5 py-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                Assigned Participant
              </th>
              <th className="f-mono px-5 py-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                Created At
              </th>
              <th className="f-mono px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {keys.map((k: (typeof keys)[number]) => (
              <tr 
                key={k.id} 
                className="transition-colors duration-150 hover:bg-black/[0.015]"
              >
                <td className="f-mono px-5 py-4 text-[13px] font-medium text-[#0a0a0f]">
                  {k.key}
                </td>
                <td className="px-5 py-4">
                  {k.isUsed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/50 bg-amber-50/50 px-3 py-1.5 text-[11px] font-medium text-amber-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Used
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/50 bg-emerald-50/50 px-3 py-1.5 text-[11px] font-medium text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-[13px] text-black/70">
                  {!k.isUsed && (
                    <span className="text-black/40">Unassigned</span>
                  )}
                  {k.isUsed && emailByStudyKey.has(k.key) && (
                    <span className="font-medium text-[#0a0a0f]">
                      {emailByStudyKey.get(k.key)}
                    </span>
                  )}
                  {k.isUsed && !emailByStudyKey.has(k.key) && (
                    <span className="italic text-black/40">
                      No matching user
                    </span>
                  )}
                </td>
                <td className="f-mono px-5 py-4 text-[12px] tabular-nums text-black/60">
                  {k.createdAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 text-right">
                  {!k.isUsed ? (
                    <form action={deleteStudyKey.bind(null, k.id)}>
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700 transition-all duration-200 hover:border-red-300 hover:bg-red-100"
                        title="Remove this unused key"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Deactivate
                      </button>
                    </form>
                  ) : (
                    <span className="text-[12px] text-black/20">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footer */}
      {keys.length === 0 && (
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <p className="text-[13.5px] font-light text-black/60">
            No study keys generated yet. Click the button above to create your first key.
          </p>
        </div>
      )}
    </div>
  );
}