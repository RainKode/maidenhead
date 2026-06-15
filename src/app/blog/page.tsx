import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Stories, news and notes from the kitchen at Maidenhead Spice — our people, our spices and what's on.",
};

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Maidenhead Spice"
          title="The Journal"
          subtitle="Stories from the kitchen, news and a few of our favourite things."
        />

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-[1180px] px-6 md:px-10">
            {posts.length === 0 ? (
              <p className="text-center font-body italic text-[18px] text-ink/70">
                No stories published just yet — do check back soon.
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="brutal-card brutal-interactive group flex flex-col overflow-hidden"
                  >
                    {post.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image}
                        alt=""
                        className="aspect-[16/10] w-full border-b-[3px] border-ink object-cover"
                      />
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="caps-track-tight text-[10px] text-oxblood">
                        {formatDate(post.published_at)}
                      </p>
                      <h2 className="mt-2 font-display text-[22px] leading-tight text-ink">
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-[15px] text-ink/75">{post.excerpt}</p>
                      <span className="caps-track mt-4 inline-block text-[11px] font-bold text-oxblood">
                        Read more →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
