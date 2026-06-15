import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedPost } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.cover_image ? { images: [post.cover_image] } : undefined,
  };
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream">
        <article className="mx-auto max-w-[760px] px-6 py-14 md:px-10 md:py-20">
          <Link href="/blog" className="caps-track text-[11px] text-oxblood link-rule">
            ← The Journal
          </Link>
          <p className="caps-track-tight mt-8 text-[11px] text-oxblood">
            {formatDate(post.published_at)} · {post.author}
          </p>
          <h1 className="mt-3 font-display text-[34px] leading-[1.1] text-ink md:text-[46px]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-5 font-body italic text-[19px] text-ink/80">{post.excerpt}</p>
          ) : null}
          <div className="brutal-divider mt-8" />

          {post.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image}
              alt=""
              className="mt-8 w-full border-[3px] border-ink object-cover"
            />
          ) : null}

          <div className="mt-8">
            <Markdown>{post.body}</Markdown>
          </div>
        </article>
      </main>
      <NewsletterFooter />
    </>
  );
}
