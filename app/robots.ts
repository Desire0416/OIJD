import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.APP_URL || siteConfig.url).replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/login", "/reinitialiser-mot-de-passe"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
