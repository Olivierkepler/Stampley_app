"use client";

import { useState } from "react";

interface AddUserSectionProps {
  createManualUser: (formData: FormData) => Promise<void>;
}

export function AddUserSection({ createManualUser }: AddUserSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-black/[0.06] bg-[#fefdfb] shadow-[0_1px_3px_rgba(10,10,15,0.03)] transition-all duration-300">
      {/* Header - Always Visible */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between cursor-pointer p-7 text-left transition-colors duration-200 hover:bg-black/[0.01]"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/[0.08] transition-colors duration-200">
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

        {/* Chevron Icon */}
        <svg 
          className={`h-5 w-5 text-black/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          overflow: 'hidden',
        }}
      >
        <div className="border-t border-black/[0.04] px-7 pb-7 pt-6">
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
        </div>
      </div>
    </section>
  );
}