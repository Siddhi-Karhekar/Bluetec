/** Shared validation for enquiry forms (runs on both client and server). */
export type Enquiry = {
  name: string;
  phone: string;
  email?: string;
  area?: string;
  puppyId?: string;
  message?: string;
  /** Honeypot — real people never fill this in. */
  website?: string;
};

export type FieldErrors = Partial<Record<keyof Enquiry, string>>;

const PHONE = /^\+?[0-9\s()-]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readEnquiry(form: FormData | Record<string, unknown>): Enquiry {
  const get = (k: string) => {
    const v = form instanceof FormData ? form.get(k) : form[k];
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    name: get("name"),
    phone: get("phone"),
    email: get("email") || undefined,
    area: get("area") || undefined,
    puppyId: get("puppyId") || undefined,
    message: get("message") || undefined,
    website: get("website") || undefined,
  };
}

export function validateEnquiry(e: Enquiry): FieldErrors {
  const errors: FieldErrors = {};
  if (e.name.length < 2 || e.name.length > 80) errors.name = "Please tell us your name.";
  if (!PHONE.test(e.phone) || e.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please add a phone or WhatsApp number with country code.";
  if (e.email && !EMAIL.test(e.email)) errors.email = "That email doesn't look quite right.";
  if (e.area && e.area.length > 80) errors.area = "Please keep your area under 80 characters.";
  if (e.message && e.message.length > 2000)
    errors.message = "Please keep your message under 2000 characters.";
  return errors;
}
