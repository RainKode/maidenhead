import { PageHeader } from "@/components/admin/ui";
import { CategoryForm } from "../../category-form";

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader title="New category" />
      <CategoryForm />
    </>
  );
}
