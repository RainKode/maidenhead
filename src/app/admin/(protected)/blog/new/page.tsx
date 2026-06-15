import { PageHeader } from "@/components/admin/ui";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="New post" />
      <PostForm />
    </>
  );
}
