import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://www.anthonychilaka.com";

const ROUTES = [
  "",
  "/about",
  "/services",
  "/ai-automation",
  "/templates",
  "/blog",
  "/portfolio",
  "/walkthroughs",
  "/contact",
  "/terms",
  "/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
