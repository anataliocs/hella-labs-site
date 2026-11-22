// Dev-only stand-in for the Cloudflare Worker. `astro dev` doesn't run worker/index.ts, so
// /api/contact would 404 locally. This mounts the real worker handler on the dev server (same
// routing, honeypot, validation and email formatting) but swaps the `send_email` binding for a
// no-op that logs the email to the terminal. Use `pnpm dev:worker` to exercise the real binding.
import type { IncomingMessage, ServerResponse } from "node:http";
import type { AstroIntegration } from "astro";

interface StubEmail {
  to?: unknown;
  replyTo?: unknown;
  subject?: string;
  text?: string;
}

type Next = (err?: unknown) => void;

interface WorkerModule {
  default: { fetch(request: Request, env: unknown): Promise<Response> };
}

async function toRequest(req: IncomingMessage): Promise<Request> {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Request(new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`), {
    method: req.method,
    headers,
    body: hasBody ? Buffer.concat(chunks) : undefined,
  });
}

export default function devContactApi(): AstroIntegration {
  return {
    name: "dev-contact-api",
    hooks: {
      "astro:config:setup": ({ command, updateConfig, logger }) => {
        if (command !== "dev") return;
        const env = {
          CONTACT_FROM: "website@hellalabs.dev",
          CONTACT_TO: "dev-stub@localhost",
          ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
          SEND_EMAIL: {
            send: async (email: StubEmail) => {
              logger.info(
                [
                  "Email not sent (dev stub):",
                  `To: ${JSON.stringify(email.to)}`,
                  `Reply-To: ${JSON.stringify(email.replyTo)}`,
                  `Subject: ${email.subject}`,
                  "",
                  email.text ?? "",
                ].join("\n"),
              );
              return { messageId: "dev-stub" };
            },
          },
        };

        // Astro puts its own dev middlewares (security checks, then a trailingSlash check that
        // would 404 /api/contact) at the front of the stack in a post hook. This plugin runs after
        // it and slots the handler in just before the trailingSlash check.
        updateConfig({
          vite: {
            plugins: [
              {
                name: "dev-contact-api",
                enforce: "post",
                configureServer(server) {
                  return () => {
                    const handle = (req: IncomingMessage, res: ServerResponse, next: Next) => {
                      if (!req.url?.startsWith("/api/")) return next();
                      (async () => {
                        const { default: worker } = (await server.ssrLoadModule(
                          "/worker/index.ts",
                        )) as WorkerModule;
                        const response = await worker.fetch(await toRequest(req), env);
                        res.statusCode = response.status;
                        response.headers.forEach((value, key) => res.setHeader(key, value));
                        res.end(Buffer.from(await response.arrayBuffer()));
                      })().catch(next);
                    };
                    const stack = server.middlewares.stack;
                    const index = stack.findIndex(
                      (layer) =>
                        typeof layer.handle === "function" &&
                        layer.handle.name === "devTrailingSlash",
                    );
                    stack.splice(Math.max(index, 0), 0, { route: "", handle });
                  };
                },
              },
            ],
          },
        });
      },
    },
  };
}
