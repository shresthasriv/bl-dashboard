export async function sendMagicLinkEmail(toEmail: string, magicLink: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'no-reply@yourdomain.com';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set. Skipping email send.');
    return;
  }

  const subject = 'Your sign-in link for Esahayak';
  const text = `Sign in to Esahayak by clicking this link:\n\n${magicLink}\n\nThis link expires in 15 minutes. If you did not request this, you can ignore this email.`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111827">
      <h2 style="margin:0 0 12px 0;color:#111827">Sign in to Esahayak</h2>
      <p style="margin:0 0 16px 0;color:#374151">Click the button below to sign in. This link expires in 15 minutes.</p>
      <p style="margin:0 0 24px 0">
        <a href="${magicLink}" style="background:#2563eb;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block">Sign in</a>
      </p>
      <p style="margin:0;color:#6b7280">If the button doesn't work, copy and paste this URL into your browser:</p>
      <p style="margin:8px 0 0 0"><a href="${magicLink}">${magicLink}</a></p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />
      <p style="margin:0;color:#9ca3af">Sent by Esahayak • <a href="${appUrl}" style="color:#6b7280;text-decoration:underline">${appUrl}</a></p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [toEmail],
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send magic link email: ${res.status} ${body}`);
  }
}
