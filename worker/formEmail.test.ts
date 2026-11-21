import { describe, expect, it, vi } from "vitest";
import { buildFormEmail, sendFormEmail, type FormPayload } from "./formEmail";

const payload: FormPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  inquiry: "Consulting",
  message: "Line one\nLine two",
  submittedAt: new Date("2026-11-21T12:00:00Z"),
};

describe("buildFormEmail", () => {
  it("builds the subject from inquiry type and name", () => {
    expect(buildFormEmail(payload).subject).toBe(
      "[hellalabs.dev] Consulting inquiry from Ada Lovelace",
    );
  });

  it("writes labelled fields then the message in the text body", () => {
    expect(buildFormEmail(payload).text).toBe(
      [
        "New contact form submission (hellalabs.dev)",
        "",
        "Name: Ada Lovelace",
        "Email: ada@example.com",
        "Inquiry Type: Consulting",
        "Submitted: 2026-11-21T12:00:00.000Z",
        "",
        "Message:",
        "Line one",
        "Line two",
      ].join("\n"),
    );
  });

  it("includes every field and a mailto link in the HTML body", () => {
    const { html } = buildFormEmail(payload);
    for (const label of ["Name", "Email", "Inquiry Type", "Submitted", "Message"]) {
      expect(html).toContain(label);
    }
    expect(html).toContain('href="mailto:ada@example.com"');
    expect(html).toContain("Line one\nLine two");
  });

  it("escapes user input in the HTML body", () => {
    const { html } = buildFormEmail({
      ...payload,
      name: '<img src=x onerror="alert(1)">',
      message: "<script>alert('x')</script> & more",
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt; &amp; more");
  });

  it("defaults the submitted time to now", () => {
    vi.useFakeTimers({ now: new Date("2030-01-01T00:00:00Z") });
    expect(buildFormEmail({ ...payload, submittedAt: undefined }).text).toContain(
      "Submitted: 2030-01-01T00:00:00.000Z",
    );
    vi.useRealTimers();
  });
});

describe("sendFormEmail", () => {
  it("sends both bodies to CONTACT_TO with Reply-To set to the visitor", async () => {
    const send = vi.fn().mockResolvedValue({});
    const env = {
      SEND_EMAIL: { send },
      CONTACT_FROM: "website@hellalabs.dev",
      CONTACT_TO: "team@example.com",
    } as unknown as Env;

    await sendFormEmail(env, payload);

    const email = buildFormEmail(payload);
    expect(send).toHaveBeenCalledWith({
      from: { name: "Hella Labs Website", email: "website@hellalabs.dev" },
      to: "team@example.com",
      replyTo: { name: "Ada Lovelace", email: "ada@example.com" },
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  });
});
