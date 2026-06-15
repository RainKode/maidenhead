import type { MetadataRoute } from "next";
import { siteInfo } from "@/lib/content";
import { getPublishedPosts } from "@/lib/data/blog";
import { getPublishedRecipes } from "@/lib/data/recipes";

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
  "/blog",
  "/recipes",
  "/privacy",
  "/cookies",
  "/disclaimer",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = ROUTES.map((path) => ({
    url: `${siteInfo.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  // Published content (no-ops to empty when Supabase isn't configured).
  const [posts, recipes] = await Promise.all([getPublishedPosts(), getPublishedRecipes()]);
  const content: MetadataRoute.Sitemap = [
    ...posts.map((post) => ({
      url: `${siteInfo.url}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...recipes.map((recipe) => ({
      url: `${siteInfo.url}/recipes/${recipe.slug}`,
      lastModified: new Date(recipe.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...base, ...content];
}
