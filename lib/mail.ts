import "server-only";

type SendPasswordResetEmailInput = {
  to: string;
  resetUrl: string;
};

/** Trim and strip accidental wrapping quotes from .env values */
function readEnv(name: string): string | undefined {
  const v = process.env[name]?.trim();
  if (!v) return undefined;
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1).trim();
  }
  return v;
}

/**
 * Sends the password reset email via Resend when `RESEND_API_KEY` is set.
 * In development, if the key is unset, logs the link to the server console.
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailInput): Promise<void> {
  const apiKey = readEnv("RESEND_API_KEY");
  const from =
    readEnv("EMAIL_FROM") || "Stampley <onboarding@resend.dev>";

  const subject = "Reset your study portal password";
  const text = [
    "You requested a password reset for your study portal account.",
    "",
    "Open this link to choose a new password (it expires in one hour):",
    resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width" /></head>
<body style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.5; color: #111827; max-width: 32rem; margin: 0 auto; padding: 24px;">
  <p style="margin: 0 0 16px;">You requested a password reset for your study portal account.</p>
  <p style="margin: 0 0 16px;">
    <a href="${escapeHtml(resetUrl)}" style="color: #2563eb; font-weight: 600;">Reset your password</a>
  </p>
  <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">This link expires in one hour. If you did not request this, you can ignore this email.</p>
  <p style="margin: 0; font-size: 12px; color: #9ca3af; word-break: break-all;">${escapeHtml(resetUrl)}</p>
</body>
</html>`;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "\n[mail] RESEND_API_KEY not set — password reset link (dev only):\n",
        resetUrl,
        "\n"
      );
      return;
    }
    throw new Error(
      "Email is not configured. Set RESEND_API_KEY and EMAIL_FROM in production."
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const raw = await res.text();
    let detail = raw;
    try {
      const parsed = JSON.parse(raw) as { message?: string; name?: string };
      detail = parsed.message ?? raw;
    } catch {
      /* keep raw */
    }
    throw new Error(`Resend error ${res.status}: ${detail}`);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
