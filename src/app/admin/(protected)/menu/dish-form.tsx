"use client";
import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import type { MenuCategoryRow } from "@/lib/supabase/types";
import type { AdminDish } from "@/lib/data/menu-admin";
import { saveDishAction, type SaveState } from "./actions";

const DIETARY: { value: string; label: string }[] = [
  { value: "V", label: "Vegetarian" },
  { value: "VG", label: "Vegan" },
  { value: "GF", label: "Gluten-free" },
  { value: "Hot", label: "Hot" },
];

type VariantRow = { label: string; price: string };
type OptionRow = { label: string; priceDelta: string };
type GroupRow = {
  label: string;
  type: "single" | "multi";
  required: boolean;
  min: string;
  max: string;
  options: OptionRow[];
};

const inputCls =
  "w-full border-[2px] border-ink bg-background px-2 h-9 text-[14px] text-ink focus:border-saffron focus:outline-none";

function num(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function DishForm({
  categories,
  dish,
  defaultCategoryId,
}: {
  categories: MenuCategoryRow[];
  dish?: AdminDish;
  defaultCategoryId?: string;
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveDishAction, {});

  const [categoryId, setCategoryId] = useState(
    defaultCategoryId ?? categories[0]?.id ?? ""
  );
  const [name, setName] = useState(dish?.name ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [basePrice, setBasePrice] = useState(
    dish?.base_price != null ? String(dish.base_price) : ""
  );
  const [dietary, setDietary] = useState<string[]>(dish?.dietary ?? []);
  const [orderable, setOrderable] = useState(dish?.orderable ?? true);
  const [available, setAvailable] = useState(dish?.available ?? true);
  const [variants, setVariants] = useState<VariantRow[]>(
    dish?.variants.map((v) => ({ label: v.label, price: String(v.price) })) ?? []
  );
  const [groups, setGroups] = useState<GroupRow[]>(
    dish?.modifiers.map((g) => ({
      label: g.label,
      type: g.type,
      required: g.required,
      min: g.min != null ? String(g.min) : "",
      max: g.max != null ? String(g.max) : "",
      options: g.options.map((o) => ({ label: o.label, priceDelta: String(o.priceDelta) })),
    })) ?? []
  );

  const payload = {
    id: dish?.id,
    categoryId,
    name: name.trim(),
    description: description.trim() || null,
    basePrice: basePrice.trim() === "" ? null : num(basePrice),
    dietary,
    orderable,
    available,
    variants: variants
      .filter((v) => v.label.trim())
      .map((v) => ({ label: v.label.trim(), price: num(v.price) })),
    modifiers: groups
      .filter((g) => g.label.trim())
      .map((g) => ({
        label: g.label.trim(),
        type: g.type,
        required: g.required,
        min: g.min.trim() === "" ? null : Math.trunc(num(g.min)),
        max: g.max.trim() === "" ? null : Math.trunc(num(g.max)),
        options: g.options
          .filter((o) => o.label.trim())
          .map((o) => ({ label: o.label.trim(), priceDelta: num(o.priceDelta) })),
      })),
  };

  function toggleDietary(value: string) {
    setDietary((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  // --- variant helpers ---
  const addVariant = () => setVariants((p) => [...p, { label: "", price: "" }]);
  const updateVariant = (i: number, patch: Partial<VariantRow>) =>
    setVariants((p) => p.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const removeVariant = (i: number) => setVariants((p) => p.filter((_, idx) => idx !== i));

  // --- group helpers ---
  const addGroup = () =>
    setGroups((p) => [
      ...p,
      { label: "", type: "single", required: false, min: "", max: "", options: [] },
    ]);
  const updateGroup = (i: number, patch: Partial<GroupRow>) =>
    setGroups((p) => p.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const removeGroup = (i: number) => setGroups((p) => p.filter((_, idx) => idx !== i));
  const addOption = (gi: number) =>
    setGroups((p) =>
      p.map((g, idx) =>
        idx === gi ? { ...g, options: [...g.options, { label: "", priceDelta: "" }] } : g
      )
    );
  const updateOption = (gi: number, oi: number, patch: Partial<OptionRow>) =>
    setGroups((p) =>
      p.map((g, idx) =>
        idx === gi
          ? { ...g, options: g.options.map((o, j) => (j === oi ? { ...o, ...patch } : o)) }
          : g
      )
    );
  const removeOption = (gi: number, oi: number) =>
    setGroups((p) =>
      p.map((g, idx) =>
        idx === gi ? { ...g, options: g.options.filter((_, j) => j !== oi) } : g
      )
    );

  return (
    <form action={formAction} className="grid max-w-3xl gap-6">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      <label className="flex flex-col gap-1.5">
        <span className="caps-track-tight text-[10px] text-ink/60">Category *</span>
        <select
          className={`${inputCls.replace("h-9", "h-10").replace("text-[14px]", "text-[15px]")} appearance-none`}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="caps-track-tight text-[10px] text-ink/60">Name *</span>
        <input
          className={inputCls.replace("h-9", "h-10").replace("text-[14px]", "text-[15px]")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="caps-track-tight text-[10px] text-ink/60">Description</span>
        <textarea
          className="w-full resize-y border-[2px] border-ink bg-background px-3 py-2 text-[15px] text-ink focus:border-saffron focus:outline-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="caps-track-tight text-[10px] text-ink/60">Base price (£)</span>
          <input
            className={inputCls.replace("h-9", "h-10").replace("text-[14px]", "text-[15px]")}
            type="number"
            step="0.05"
            min="0"
            placeholder="Leave blank if using variants"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
          />
          <span className="text-[11px] text-ink/50">
            Use a base price for single-price dishes, or add variants below.
          </span>
        </label>

        <div className="flex flex-col gap-2">
          <span className="caps-track-tight text-[10px] text-ink/60">Dietary tags</span>
          <div className="flex flex-wrap gap-3">
            {DIETARY.map((d) => (
              <label key={d.value} className="flex items-center gap-1.5 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={dietary.includes(d.value)}
                  onChange={() => toggleDietary(d.value)}
                />
                {d.label}
              </label>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-1.5 text-[13px] text-ink">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              Available (shown on site)
            </label>
            <label className="flex items-center gap-1.5 text-[13px] text-ink">
              <input
                type="checkbox"
                checked={orderable}
                onChange={(e) => setOrderable(e.target.checked)}
              />
              Orderable online
            </label>
          </div>
        </div>
      </div>

      {/* Variants */}
      <fieldset className="brutal-card-sm bg-background p-4">
        <div className="flex items-center justify-between">
          <legend className="caps-track text-[12px] text-oxblood">Variants</legend>
          <button
            type="button"
            onClick={addVariant}
            className="caps-track-tight border-[2px] border-ink px-3 py-1 text-[11px] font-bold text-ink hover:bg-ink hover:text-background"
          >
            + Variant
          </button>
        </div>
        <p className="mt-1 text-[12px] text-ink/55">
          e.g. Chicken £11.95, Lamb £12.95. Leave empty for a single-price dish.
        </p>
        <div className="mt-3 space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputCls}
                placeholder="Label (e.g. Chicken)"
                value={v.label}
                onChange={(e) => updateVariant(i, { label: e.target.value })}
              />
              <input
                className={`${inputCls} w-28`}
                type="number"
                step="0.05"
                min="0"
                placeholder="Price"
                value={v.price}
                onChange={(e) => updateVariant(i, { price: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="border-[2px] border-ink px-2 py-1 text-[12px] font-bold text-destructive hover:bg-destructive hover:text-background"
                aria-label="Remove variant"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Modifier groups */}
      <fieldset className="brutal-card-sm bg-background p-4">
        <div className="flex items-center justify-between">
          <legend className="caps-track text-[12px] text-oxblood">Option groups</legend>
          <button
            type="button"
            onClick={addGroup}
            className="caps-track-tight border-[2px] border-ink px-3 py-1 text-[11px] font-bold text-ink hover:bg-ink hover:text-background"
          >
            + Group
          </button>
        </div>
        <p className="mt-1 text-[12px] text-ink/55">
          e.g. “Spice level” (choose one) or “Add extras” (choose many, with prices).
        </p>

        <div className="mt-4 space-y-5">
          {groups.map((g, gi) => (
            <div key={gi} className="border-[2px] border-ink/30 p-3">
              <div className="flex flex-wrap items-end gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Group label (e.g. Spice level)"
                  value={g.label}
                  onChange={(e) => updateGroup(gi, { label: e.target.value })}
                />
                <select
                  className={`${inputCls} w-28`}
                  value={g.type}
                  onChange={(e) =>
                    updateGroup(gi, { type: e.target.value as "single" | "multi" })
                  }
                >
                  <option value="single">Choose one</option>
                  <option value="multi">Choose many</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeGroup(gi)}
                  className="border-[2px] border-ink px-2 py-1.5 text-[12px] font-bold text-destructive hover:bg-destructive hover:text-background"
                  aria-label="Remove group"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-1.5 text-[12px] text-ink">
                  <input
                    type="checkbox"
                    checked={g.required}
                    onChange={(e) => updateGroup(gi, { required: e.target.checked })}
                  />
                  Required
                </label>
                <label className="flex items-center gap-1.5 text-[12px] text-ink/70">
                  Min
                  <input
                    className={`${inputCls} w-16`}
                    type="number"
                    min="0"
                    value={g.min}
                    onChange={(e) => updateGroup(gi, { min: e.target.value })}
                  />
                </label>
                <label className="flex items-center gap-1.5 text-[12px] text-ink/70">
                  Max
                  <input
                    className={`${inputCls} w-16`}
                    type="number"
                    min="0"
                    value={g.max}
                    onChange={(e) => updateGroup(gi, { max: e.target.value })}
                  />
                </label>
              </div>

              <div className="mt-3 space-y-2 border-t border-ink/10 pt-3">
                {g.options.map((o, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      className={inputCls}
                      placeholder="Option (e.g. Nan)"
                      value={o.label}
                      onChange={(e) => updateOption(gi, oi, { label: e.target.value })}
                    />
                    <input
                      className={`${inputCls} w-28`}
                      type="number"
                      step="0.05"
                      placeholder="+ £"
                      value={o.priceDelta}
                      onChange={(e) => updateOption(gi, oi, { priceDelta: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(gi, oi)}
                      className="border-[2px] border-ink px-2 py-1 text-[12px] font-bold text-destructive hover:bg-destructive hover:text-background"
                      aria-label="Remove option"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(gi)}
                  className="caps-track-tight border-[2px] border-ink/40 px-3 py-1 text-[11px] font-bold text-ink/70 hover:border-ink hover:text-ink"
                >
                  + Option
                </button>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {state.error ? (
        <p role="alert" className="text-[13px] text-destructive">
          {state.error}
        </p>
      ) : null}

      <div>
        <SubmitButton>{dish ? "Save dish" : "Create dish"}</SubmitButton>
      </div>
    </form>
  );
}
