import { NextResponse } from "next/server";
import { readEnquiry, validateEnquiry } from "@/lib/enquiry";

/**
 * Receives enquiries from the contact letter and puppy profile forms.
 * Validation is shared with the client. In production this is where the
 * enquiry would be forwarded to email / CRM / WhatsApp Business.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const enquiry = readEnquiry(body);

  // Bots fill the hidden "website" field — pretend all is well and drop it.
  if (enquiry.website) return NextResponse.json({ ok: true });

  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  console.info("[enquiry]", { ...enquiry, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
