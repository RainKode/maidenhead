"use client";
import { useActionState } from "react";
import { Field, SelectField, TextArea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import type { BlogPostRow } from "@/lib/supabase/types";
import { savePost, type SaveState } from "./actions";

export function PostForm({ post }: { post?: BlogPostRow }) {
  const [state, formAction] = useActionState<SaveState, FormData>(savePost, {});

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <Field label="Title" name="title" defaultValue={post?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={post?.slug}
        placeholder="auto-generated from title"
        hint="Used in the URL: /blog/your-slug. Leave blank to generate from the title."
      />
      <Field label="Author" name="author" defaultValue={post?.author ?? "Maidenhead Spice"} />
      <TextArea
        label="Excerpt"
        name="excerpt"
        defaultValue={post?.excerpt}
        rows={2}
        hint="Short summary shown on the Journal listing."
      />
      <TextArea
        label="Body (Markdown)"
        name="body"
        defaultValue={post?.body}
        rows={16}
        hint="Supports Markdown: # headings, **bold**, lists, [links](https://…)."
      />

      <div className="grid gap-2">
        <span className="caps-track-tight text-[10px] text-ink/60">Cover image</span>
        {post?.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt=""
            className="max-h-40 w-full border-[2px] border-ink object-cover"
          />
        ) : null}
        <input
          type="file"
          name="cover_file"
          accept="image/*"
          className="text-[13px] text-ink/70 file:mr-3 file:border-[2px] file:border-ink file:bg-saffron file:px-3 file:py-1.5 file:text-[11px] file:font-bold"
        />
        <input
          type="text"
          name="cover_image"
          defaultValue={post?.cover_image ?? ""}
          placeholder="…or paste an image URL"
          className="w-full border-[2px] border-ink bg-background px-3 h-10 text-[14px] text-ink focus:border-saffron focus:outline-none"
        />
      </div>

      <SelectField
        label="Status"
        name="status"
        defaultValue={post?.status ?? "draft"}
        options={[
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ]}
      />

      {state.error ? (
        <p role="alert" className="text-[13px] text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <SubmitButton>{post ? "Save changes" : "Create post"}</SubmitButton>
      </div>
    </form>
  );
}
