import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ml3m.github.io";

  const staticRoutes = [
    "",
    "/projects",
    "/yapping",
    "/bookmarks",
    "/garden",
    "/gallery",
    "/tools",
    "/tools/byond-ckey",
    "/tools/byte-shifter",
    "/tools/dip-switch",
    "/tools/doc-comment",
    "/tools/redirection",
    "/tools/uwuify",
    "/tools/when-you",
    "/tools/winscp-decrypt",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Post slugs and dates kept in sync with lib/yapping.ts
  // Avoiding direct import because the metadata route loader
  // cannot parse the template literals in yapping.ts content fields.
  const postRoutes = [
    { slug: "impulsive-thought-deleted-windows", date: "2026-03-11" },
    { slug: "hello-world", date: "2026-02-21" },
  ].map((post) => ({
    url: `${baseUrl}/yapping/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...postRoutes];
}

