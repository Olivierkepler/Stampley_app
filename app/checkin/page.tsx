import { redirect } from "next/navigation";

export default function LegacyCheckInRedirectPage() {
  redirect("/check-in");
}