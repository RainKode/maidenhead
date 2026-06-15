"use client";
import { useActionState } from "react";
import { Field, SelectField, TextArea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import type { RecipeRow } from "@/lib/supabase/types";
import { saveRecipe, type SaveState } from "./actions";

export function RecipeForm({ recipe }: { recipe?: RecipeRow }) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveRecipe, {});

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      {recipe ? <input type="hidden" name="id" value={recipe.id} /> : null}

      <Field label="Title" name="title" defaultValue={recipe?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={recipe?.slug}
        placeholder="auto-generated from title"
        hint="Used in the URL: /recipes/your-slug."
      />
      <TextArea label="Excerpt" name="excerpt" defaultValue={recipe?.excerpt} rows={2} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Prep time" name="prep_time" defaultValue={recipe?.prep_time ?? ""} placeholder="20 min" />
        <Field label="Cook time" name="cook_time" defaultValue={recipe?.cook_time ?? ""} placeholder="40 min" />
        <Field label="Serves" name="serves" defaultValue={recipe?.serves ?? ""} placeholder="4" />
        <Field label="Difficulty" name="difficulty" defaultValue={recipe?.difficulty ?? ""} placeholder="Easy" />
      </div>

      <TextArea
        label="Ingredients"
        name="ingredients"
        defaultValue={recipe?.ingredients.join("\n")}
        rows={8}
        hint="One ingredient per line."
      />
      <TextArea
        label="Method"
        name="steps"
        defaultValue={recipe?.steps.join("\n")}
        rows={8}
        hint="One step per line."
      />
      <TextArea
        label="Notes (Markdown, optional)"
        name="body"
        defaultValue={recipe?.body}
        rows={6}
        hint="Extra notes shown below the method. Supports Markdown."
      />

      <div className="grid gap-2">
        <span className="caps-track-tight text-[10px] text-ink/60">Cover image</span>
        {recipe?.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.cover_image}
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
          defaultValue={recipe?.cover_image ?? ""}
          placeholder="…or paste an image URL"
          className="w-full border-[2px] border-ink bg-background px-3 h-10 text-[14px] text-ink focus:border-saffron focus:outline-none"
        />
      </div>

      <SelectField
        label="Status"
        name="status"
        defaultValue={recipe?.status ?? "draft"}
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
        <SubmitButton>{recipe ? "Save changes" : "Create recipe"}</SubmitButton>
      </div>
    </form>
  );
}
