import { EmptyState, PageHeader } from "@/components/admin/ui";
import { listCategories } from "@/lib/data/menu-admin";
import { DishForm } from "../../dish-form";

export default async function NewDishPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = await listCategories();

  if (categories.length === 0) {
    return (
      <>
        <PageHeader title="New dish" />
        <EmptyState>Create a category first, then add dishes to it.</EmptyState>
      </>
    );
  }

  return (
    <>
      <PageHeader title="New dish" />
      <DishForm categories={categories} defaultCategoryId={category} />
    </>
  );
}
