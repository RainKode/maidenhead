import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedRecipe } from "@/lib/data/recipes";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getPublishedRecipe(slug);
  if (!recipe) return { title: "Not found" };
  return {
    title: recipe.title,
    description: recipe.excerpt,
    openGraph: recipe.cover_image ? { images: [recipe.cover_image] } : undefined,
  };
}

export default async function RecipePage({ params }: Params) {
  const { slug } = await params;
  const recipe = await getPublishedRecipe(slug);
  if (!recipe) notFound();

  const meta = [
    recipe.prep_time && `Prep ${recipe.prep_time}`,
    recipe.cook_time && `Cook ${recipe.cook_time}`,
    recipe.serves && `Serves ${recipe.serves}`,
    recipe.difficulty,
  ].filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream">
        <article className="mx-auto max-w-[820px] px-6 py-14 md:px-10 md:py-20">
          <Link href="/recipes" className="caps-track text-[11px] text-oxblood link-rule">
            ← Recipes
          </Link>
          <h1 className="mt-8 font-display text-[34px] leading-[1.1] text-ink md:text-[46px]">
            {recipe.title}
          </h1>
          {recipe.excerpt ? (
            <p className="mt-5 font-body italic text-[19px] text-ink/80">{recipe.excerpt}</p>
          ) : null}
          {meta.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {meta.map((item) => (
                <span key={item as string} className="brutal-tag">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
          <div className="brutal-divider mt-8" />

          {recipe.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.cover_image}
              alt=""
              className="mt-8 w-full border-[3px] border-ink object-cover"
            />
          ) : null}

          <div className="mt-10 grid gap-10 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
            {recipe.ingredients.length ? (
              <aside className="brutal-card-sm p-5 md:sticky md:top-6">
                <h2 className="caps-track text-[12px] text-oxblood">Ingredients</h2>
                <ul className="mt-4 space-y-2 text-[15px] text-ink">
                  {recipe.ingredients.map((item, i) => (
                    <li key={i} className="border-b border-ink/10 pb-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            <div>
              {recipe.steps.length ? (
                <>
                  <h2 className="caps-track text-[12px] text-oxblood">Method</h2>
                  <ol className="mt-4 space-y-5">
                    {recipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="font-display text-[26px] leading-none text-saffron-dark">
                          {i + 1}
                        </span>
                        <p className="text-[16px] leading-[1.7] text-ink">{step}</p>
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}

              {recipe.body ? (
                <div className="mt-10">
                  <Markdown>{recipe.body}</Markdown>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </main>
      <NewsletterFooter />
    </>
  );
}
