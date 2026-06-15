import Link from "next/link";
import { ButtonLink, EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAllRecipes } from "@/lib/data/recipes";
import { removeRecipe } from "./actions";

export default async function AdminRecipesPage() {
  const recipes = await getAllRecipes();

  return (
    <>
      <PageHeader
        title="Recipes"
        description="Recipes shown on /recipes."
        action={<ButtonLink href="/admin/recipes/new">New recipe</ButtonLink>}
      />

      {recipes.length === 0 ? (
        <EmptyState>No recipes yet. Add your first dish.</EmptyState>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="brutal-card-sm flex flex-wrap items-center justify-between gap-4 bg-background p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/recipes/${recipe.id}`}
                    className="font-display text-[18px] text-ink link-rule"
                  >
                    {recipe.title}
                  </Link>
                  <StatusBadge status={recipe.status} />
                </div>
                <p className="mt-0.5 text-[12px] text-ink/55">/recipes/{recipe.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/recipes/${recipe.id}`}
                  className="caps-track-tight border-[2px] border-ink px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-ink hover:text-background"
                >
                  Edit
                </Link>
                <form action={removeRecipe}>
                  <input type="hidden" name="id" value={recipe.id} />
                  <SubmitButton variant="danger" pendingLabel="…">
                    Delete
                  </SubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
