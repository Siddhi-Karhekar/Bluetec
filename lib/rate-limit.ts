/**
 * Tiny fixed-window rate limiter (in memory, per server instance).
 *
 * Good enough to stop a single client hammering the enquiry form. On a
 * multi-instance / serverless deployment each instance keeps its own window,
 * so for real traffic swap this for a shared store (e.g. Upstash Redis or
 * Vercel's WAF rate-limiting rules) — the call site stays the same.
 */
type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();
const MAX_KEYS = 5_000;

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const w = buckets.get(key);

  if (!w || w.resetAt <= now) {
    // keep memory bounded: drop expired windows when the map gets large
    if (buckets.size >= MAX_KEYS) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
      if (buckets.size >= MAX_KEYS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  w.count += 1;
  if (w.count > limit) return { ok: false, retryAfter: Math.ceil((w.resetAt - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}
