import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { listCategories } from "@/lib/data/menu-admin";
import { CategoryForm } from "../../category-form";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = (await listCategories()).find((c) => c.id === id);
  if (!category) notFound();

  return (
    <>
      <PageHeader title="Edit category" description={category.title} />
      <CategoryForm category={category} />
    </>
  );
}
