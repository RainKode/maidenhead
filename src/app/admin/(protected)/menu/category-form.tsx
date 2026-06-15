"use client";
import { useActionState } from "react";
import { Field, TextArea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import type { MenuCategoryRow } from "@/lib/supabase/types";
import { saveCategory, type SaveState } from "./actions";

export function CategoryForm({ category }: { category?: MenuCategoryRow }) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveCategory, {});

  return (
    <form action={formAction} className="grid max-w-2xl gap-5">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <Field label="Title" name="title" defaultValue={category?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={category?.slug}
        placeholder="auto-generated from title"
        hint="Used as the section anchor on the menu page."
      />
      <TextArea label="Blurb" name="blurb" defaultValue={category?.blurb} rows={2} />

      {state.error ? (
        <p role="alert" className="text-[13px] text-destructive">
          {state.error}
        </p>
      ) : null}

      <div>
        <SubmitButton>{category ? "Save changes" : "Create category"}</SubmitButton>
      </div>
    </form>
  );
}
