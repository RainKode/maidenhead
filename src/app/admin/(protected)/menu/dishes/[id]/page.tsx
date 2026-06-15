import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { getAdminDish, listCategories } from "@/lib/data/menu-admin";
import { DishForm } from "../../dish-form";

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, categories] = await Promise.all([getAdminDish(id), listCategories()]);
  if (!result) notFound();

  return (
    <>
      <PageHeader title="Edit dish" description={result.dish.name} />
      <DishForm
        categories={categories}
        dish={result.dish}
        defaultCategoryId={result.categoryId}
      />
    </>
  );
}
