/** Site-wide constants (contact details, navigation). */
export const SITE = {
  name: "TeddyPups U.A.E.",
  short: "TeddyPups",
  tagline: "every puppy is family",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://teddypups.vercel.app",
  phone: "+971 50 000 0000",
  phoneHref: "tel:+971500000000",
  email: "info@instabizweb.com",
  address: "Downtown Dubai, United Arab Emirates",
  description:
    "Premium teacup and miniature puppies in Dubai. Meet your new best friend in our Downtown Dubai showroom, or order a rare breed from trusted breeders worldwide.",
};

/** The reference site's WhatsApp deep link (pre-filled message). */
export const WHATSAPP_URL =
  "https://wa.me/919898124987?text=Hi%20Insta%20Biz%20Web%2C%20I'd%20like%20to%20discuss%20a%20project.";

export function whatsappWith(message: string) {
  return `https://wa.me/919898124987?text=${encodeURIComponent(message)}`;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/puppies", label: "Puppies" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;

export const SOCIALS = [
  { label: "Instagram", href: "https://instabizweb.com" },
  { label: "TikTok", href: "https://instabizweb.com" },
  { label: "Facebook", href: "https://instabizweb.com" },
] as const;
