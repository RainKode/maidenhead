import Link from "next/link";
import { ButtonLink, EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAllPosts } from "@/lib/data/blog";
import { removePost } from "./actions";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageHeader
        title="Journal"
        description="Blog posts shown on /blog."
        action={<ButtonLink href="/admin/blog/new">New post</ButtonLink>}
      />

      {posts.length === 0 ? (
        <EmptyState>No posts yet. Create your first story.</EmptyState>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="brutal-card-sm flex flex-wrap items-center justify-between gap-4 bg-background p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-display text-[18px] text-ink link-rule"
                  >
                    {post.title}
                  </Link>
                  <StatusBadge status={post.status} />
                </div>
                <p className="mt-0.5 text-[12px] text-ink/55">/blog/{post.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="caps-track-tight border-[2px] border-ink px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-ink hover:text-background"
                >
                  Edit
                </Link>
                <form action={removePost}>
                  <input type="hidden" name="id" value={post.id} />
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
