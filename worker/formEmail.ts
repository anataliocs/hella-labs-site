// Contact-form email: builds the subject, plain-text and HTML bodies for a validated submission
// and sends them through the `send_email` binding. Both bodies use the same fixed field labels
// in the same order, so a submission is easy to read and easy to parse (by a filter, script, or
// CRM import) from either part.

export interface FormPayload {
  name: string;
  email: string;
  inquiry: string;
  /** Service offerings the visitor ticked (only for some inquiry types) */
  services?: string[];
  message: string;
  /** When the Worker received the submission; defaults to now */
  submittedAt?: Date;
}

export interface FormEmail {
  subject: string;
  text: string;
  html: string;
}

const BRAND = "hellalabs.dev";

export function buildFormEmail(payload: FormPayload): FormEmail {
  const submittedAt = (payload.submittedAt ?? new Date()).toISOString();
  const fields: [label: string, value: string][] = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Inquiry Type", payload.inquiry],
    ...(payload.services?.length
      ? [["Services", payload.services.join(", ")] satisfies [string, string]]
      : []),
    ["Submitted", submittedAt],
  ];

  const subject = `[${BRAND}] ${payload.inquiry} inquiry from ${payload.name}`;

  const text = [
    `New contact form submission (${BRAND})`,
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const rows = fields
    .map(
      ([label, value]) => `
          <tr>
            <th align="left" valign="top" style="padding:8px 16px 8px 0;width:120px;color:#6b7280;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</th>
            <td style="padding:8px 0;color:#111827;">${label === "Email" ? mailto(value) : escapeHtml(value)}</td>
          </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
          <h1 style="margin:0;font-size:18px;color:#111827;">New contact form submission</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${BRAND}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px;">
          <h2 style="margin:8px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Message</h2>
          <div style="padding:12px 16px;background:#f9fafb;border-left:3px solid #6366f1;color:#111827;white-space:pre-wrap;">${escapeHtml(payload.message)}</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

/** Sends a submission to CONTACT_TO, with Reply-To set to the visitor */
export async function sendFormEmail(env: Env, payload: FormPayload): Promise<void> {
  const { subject, text, html } = buildFormEmail(payload);
  await env.SEND_EMAIL.send({
    from: { name: "Hella Labs Website", email: env.CONTACT_FROM },
    to: env.CONTACT_TO,
    replyTo: { name: payload.name, email: payload.email },
    subject,
    text,
    html,
  });
}

function mailto(email: string): string {
  const safe = escapeHtml(email);
  return `<a href="mailto:${safe}" style="color:#4f46e5;">${safe}</a>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
