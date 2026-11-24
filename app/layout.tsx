import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Behaviours from "@/components/behaviours/Behaviours";
import Curtain from "@/components/layout/Curtain";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import StickyBar from "@/components/layout/StickyBar";
import { SITE } from "@/lib/site";
import "./globals.css";

// Self-hosted variable fonts (latin subsets).
// Fraunces' SOFT/WONK axes give headings their plush look; Shantell Sans is the handwriting.
const fraunces = localFont({
  src: "./fonts/fraunces-latin.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const figtree = localFont({
  src: "./fonts/figtree-latin.woff2",
  variable: "--font-figtree",
  weight: "300 900",
  display: "swap",
});
const shantell = localFont({
  src: "./fonts/shantell-latin.woff2",
  variable: "--font-shantell",
  weight: "300 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Premium teacup puppies in Dubai`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — Premium teacup puppies in Dubai`,
    description: SITE.description,
    siteName: SITE.name,
    type: "website",
    images: ["/brand/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} ${shantell.variable}`}>
      <body>
        <Curtain />
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          {children}
        </main>
        <SiteFooter />
        <StickyBar />
        <Behaviours />
      </body>
    </html>
  );
}
