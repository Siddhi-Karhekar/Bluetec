import { NextResponse } from "next/server";
import { readEnquiry, validateEnquiry } from "@/lib/enquiry";
import { getPuppyById } from "@/lib/puppies";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Receives enquiries from the contact letter and puppy profile forms.
 *
 * Hardening:
 * - same-origin only: cross-site POSTs are rejected (and no CORS headers are
 *   sent, so other sites can't read responses either)
 * - JSON only, 10 KB body cap
 * - per-IP rate limit (5 / minute)
 * - shared server-side validation, unknown puppy ids rejected, honeypot for bots
 * - no personal data is logged; errors never expose internals
 *
 * In production this is where the enquiry would be forwarded to email / CRM.
 */
const MAX_BODY_BYTES = 10_000;

const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; still validated & rate limited below
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "Forbidden" }, 403);

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return json({ ok: false, error: "Unsupported content type" }, 415);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const limit = rateLimit(`enquiry:${ip}`, 5, 60_000);
  if (!limit.ok)
    return json({ ok: false, error: "Too many requests — please try again shortly." }, 429, {
      "Retry-After": String(limit.retryAfter),
    });

  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: "Request too large" }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "Invalid request" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return json({ ok: false, error: "Invalid request" }, 400);

  const enquiry = readEnquiry(body as Record<string, unknown>);

  // Bots fill the hidden "website" field — pretend all is well and drop it.
  if (enquiry.website) return json({ ok: true });

  const errors = validateEnquiry(enquiry);
  if (enquiry.puppyId && !getPuppyById(enquiry.puppyId)) errors.puppyId = "Unknown puppy.";
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422);

  // Log that an enquiry arrived — never the person's name, phone or email.
  console.info("[enquiry] received", {
    puppyId: enquiry.puppyId ?? null,
    hasEmail: Boolean(enquiry.email),
    at: new Date().toISOString(),
  });
  return json({ ok: true });
}
