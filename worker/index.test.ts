import { beforeEach, describe, expect, it, vi } from "vitest";
import worker from "./index";

const send = vi.fn();
const assetsFetch = vi.fn();
const env = {
  SEND_EMAIL: { send },
  ASSETS: { fetch: assetsFetch },
  CONTACT_FROM: "website@hellalabs.dev",
  CONTACT_TO: "team@example.com",
} as unknown as Env;

const validFields = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  inquiry_type: "Consulting",
  text: "Let's build something.",
};

function post(fields: Record<string, string | string[]>, json = true): Request {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    for (const item of [value].flat()) body.append(key, item);
  }
  return new Request("https://www.hellalabs.dev/api/contact", {
    method: "POST",
    body,
    headers: json ? { Accept: "application/json" } : {},
  });
}

const call = (request: Request) => worker.fetch(request as Parameters<typeof worker.fetch>[0], env);

beforeEach(() => {
  send.mockReset().mockResolvedValue({});
  assetsFetch.mockReset().mockResolvedValue(new Response("asset"));
});

describe("worker routing", () => {
  it("passes non-API requests to static assets", async () => {
    const res = await call(new Request("https://www.hellalabs.dev/team/"));
    expect(assetsFetch).toHaveBeenCalledOnce();
    expect(await res.text()).toBe("asset");
  });

  it("rejects non-POST requests to the contact endpoint", async () => {
    const res = await call(new Request("https://www.hellalabs.dev/api/contact/"));
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("POST");
  });
});

describe("POST /api/contact", () => {
  it("sends the email and returns JSON for fetch callers", async () => {
    const res = await call(post(validFields));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({
      to: "team@example.com",
      replyTo: { name: "Ada Lovelace", email: "ada@example.com" },
      subject: "[hellalabs.dev] Consulting inquiry from Ada Lovelace",
    });
  });

  it("includes ticked services for service inquiry types", async () => {
    await call(post({ ...validFields, services: ["Custom Discord Bot", "Web3 Tooling & SDKs"] }));
    expect(send.mock.calls[0][0].text).toContain(
      "Services: Custom Discord Bot, Web3 Tooling & SDKs",
    );
  });

  it("ignores services for other inquiry types", async () => {
    await call(post({ ...validFields, inquiry_type: "Events", services: ["Custom Discord Bot"] }));
    expect(send.mock.calls[0][0].text).not.toContain("Services:");
  });

  it("redirects plain form posts to the thanks page", async () => {
    const res = await call(post(validFields, false));
    expect(res.status).toBe(303);
    expect(res.headers.get("Location")).toBe("https://www.hellalabs.dev/contact/thanks/");
  });

  it("pretends to succeed for honeypot submissions without sending", async () => {
    const res = await call(post({ ...validFields, company: "Spam Inc" }));
    expect(await res.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    [{ ...validFields, name: "" }, "Please fill in every field."],
    [{ ...validFields, email: "not-an-email" }, "Please enter a valid email."],
    [{ ...validFields, email: "ada@example" }, "Please enter a valid email."],
    [{ ...validFields, text: "x".repeat(5001) }, "Your message is too long."],
    [
      { ...validFields, text: "  too short   " },
      "Please tell us a bit more (at least 20 characters).",
    ],
    [{ ...validFields, name: "a".repeat(201) }, "A field is too long."],
    [{ ...validFields, services: ["s".repeat(101)] }, "A field is too long."],
  ])("returns 400 for invalid input (%#)", async (fields, error) => {
    const res = await call(post(fields));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error });
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 502 when the email binding fails", async () => {
    send.mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const res = await call(post(validFields));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false });
  });
});
