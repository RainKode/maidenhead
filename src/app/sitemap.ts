import type { MetadataRoute } from "next";
import { siteInfo } from "@/lib/content";

const ROUTES = [
  "/",
  "/about",
  "/menus",
  "/gallery",
  "/offers",
  "/order",
  "/order/confirmed",
  "/book",
  "/reviews",
  "/contact",
  "/privacy",
  "/cookies",
  "/disclaimer",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${siteInfo.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
