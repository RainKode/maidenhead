import { PageHeader } from "@/components/admin/ui";
import { RecipeForm } from "../recipe-form";

export default function NewRecipePage() {
  return (
    <>
      <PageHeader title="New recipe" />
      <RecipeForm />
    </>
  );
}
