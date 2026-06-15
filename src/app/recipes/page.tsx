import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedRecipes } from "@/lib/data/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Cook a little of Maidenhead Spice at home — recipes and kitchen notes from our chefs.",
};

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await getPublishedRecipes();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="From our kitchen to yours"
          title="Recipes"
          subtitle="A few of our dishes, written down so you can cook them at home."
        />

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-[1180px] px-6 md:px-10">
            {recipes.length === 0 ? (
              <p className="text-center font-body italic text-[18px] text-ink/70">
                No recipes published just yet — do check back soon.
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.slug}`}
                    className="brutal-card brutal-interactive group flex flex-col overflow-hidden"
                  >
                    {recipe.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={recipe.cover_image}
                        alt=""
                        className="aspect-[16/10] w-full border-b-[3px] border-ink object-cover"
                      />
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-[22px] leading-tight text-ink">
                        {recipe.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-[15px] text-ink/75">{recipe.excerpt}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {recipe.prep_time ? (
                          <span className="brutal-tag">Prep {recipe.prep_time}</span>
                        ) : null}
                        {recipe.serves ? (
                          <span className="brutal-tag">Serves {recipe.serves}</span>
                        ) : null}
                      </div>
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
