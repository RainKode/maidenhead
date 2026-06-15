import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { getPostById } from "@/lib/data/blog";
import { PostForm } from "../post-form";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <>
      <PageHeader title="Edit post" description={`/blog/${post.slug}`} />
      <PostForm post={post} />
    </>
  );
}
