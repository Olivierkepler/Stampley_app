// admin-login-shell.tsx
"use client";
import dynamic from "next/dynamic";

const AdminLoginForm = dynamic(
  () =>
    import("./admin-login-form").then((m) => ({ default: m.AdminLoginForm })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c12] px-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.04]" />
      </div>
    ),
  }
);

export function AdminLoginShell() {
  return <AdminLoginForm />;
}

// ---

// page.tsx
// import { AdminLoginShell } from "./admin-login-shell";
// export default function AdminLoginPage() {
//   return <AdminLoginShell />;
// }