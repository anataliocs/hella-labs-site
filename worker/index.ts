// Cloudflare Worker for hellalabs.dev. Static assets are served straight from dist/; only
// /api/* reaches this script (see `run_worker_first` in wrangler.jsonc).
//
// POST /api/contact: validates the contact form and emails it to CONTACT_TO through the
// `send_email` binding. Fetch callers (Accept: application/json) get JSON back; plain HTML form
// posts (no JS) are redirected to /contact/thanks/. The email itself is built in formEmail.ts.

import { CONTACT_LIMITS as LIMITS, EMAIL_RE, SERVICE_INQUIRY_TYPES } from "./contactRules";
import { sendFormEmail, type FormPayload } from "./formEmail";

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname.replace(/\/+$/, "") === "/api/contact") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request, env: Env): Promise<Response> {
  const wantsJson = request.headers.get("Accept")?.includes("application/json") ?? false;
  const fail = (error: string, status: number) =>
    wantsJson ? json({ ok: false, error }, status) : new Response(error, { status });
  const succeed = () =>
    wantsJson
      ? json({ ok: true })
      : Response.redirect(new URL("/contact/thanks/", request.url).href, 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Invalid form submission.", 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked so bots move on.
  if (field(form, "company")) return succeed();

  const inquiry = field(form, "inquiry_type");
  const submission: FormPayload = {
    name: field(form, "name"),
    email: field(form, "email"),
    inquiry,
    // Only the inquiry types that show the checkboxes can carry services
    services: SERVICE_INQUIRY_TYPES.includes(inquiry) ? multiField(form, "services") : [],
    message: field(form, "text"),
    submittedAt: new Date(),
  };

  const error = validate(submission);
  if (error) return fail(error, 400);

  try {
    await sendFormEmail(env, submission);
  } catch (err) {
    console.error("Contact email failed to send", err);
    return fail("Sorry, your message couldn't be sent. Please try again later.", 502);
  }

  return succeed();
}

function field(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Every non-empty value submitted under `key` (e.g. a checkbox group), trimmed and deduped */
function multiField(form: FormData, key: string): string[] {
  const values = form
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set(values)];
}

function validate({ name, email, inquiry, services = [], message }: FormPayload): string | null {
  if (!name || !email || !inquiry || !message) return "Please fill in every field.";
  if (name.length > LIMITS.name || inquiry.length > LIMITS.inquiry) return "A field is too long.";
  if (services.length > LIMITS.services || services.some((s) => s.length > LIMITS.inquiry)) {
    return "A field is too long.";
  }
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return "Please enter a valid email.";
  if (message.length > LIMITS.message) return "Your message is too long.";
  if (message.length < LIMITS.messageMin) {
    return `Please tell us a bit more (at least ${LIMITS.messageMin} characters).`;
  }
  // Single-line values end up in headers (subject, reply-to); reject line breaks outright
  if (/[\r\n]/.test([name, email, inquiry, ...services].join("")))
    return "Invalid characters in form fields.";
  return null;
}

function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return Response.json(body, { status, headers });
}
