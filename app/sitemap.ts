import type { MetadataRoute } from "next";
import { allPuppies } from "@/lib/puppies";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/puppies", "/gone-home", "/happy-families", "/how-it-works", "/faq", "/contact"];
  return [
    ...pages.map((p) => ({
      url: `${SITE.url}${p}`,
      changeFrequency: "weekly" as const,
      priority: p ? 0.8 : 1,
    })),
    ...allPuppies.map((p) => ({
      url: `${SITE.url}/puppies/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
