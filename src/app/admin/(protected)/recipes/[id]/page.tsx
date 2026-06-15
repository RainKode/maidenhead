import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { getRecipeById } from "@/lib/data/recipes";
import { RecipeForm } from "../recipe-form";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  return (
    <>
      <PageHeader title="Edit recipe" description={`/recipes/${recipe.slug}`} />
      <RecipeForm recipe={recipe} />
    </>
  );
}
