"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { dishoomImages } from "@/lib/dishoom-images";
import type { MenuCategory } from "@/lib/menu-data";

type Props = { categories: MenuCategory[] };

/**
 * Mowgli-inspired menu cards — image reveals on hover, click expands an
 * inline accordion of dishes.
 */
export function MenuCategoryGrid({ categories }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => {
        const isOpen = open === c.slug;
        const imageSrc = dishoomImages[
          c.image as keyof typeof dishoomImages
        ] as string;
        return (
          <article
            id={c.slug}
            key={c.slug}
            className={cn(
              "group relative bg-cream border border-ink/10 overflow-hidden transition-shadow",
              isOpen ? "shadow-lg ring-1 ring-oxblood/20" : "hover:shadow-md"
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : c.slug)}
              aria-expanded={isOpen}
              aria-controls={`${c.slug}-panel`}
              className="block w-full text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-700",
                    isOpen ? "scale-105" : "group-hover:scale-110"
                  )}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-oxblood-dark/15 group-hover:bg-oxblood-dark/35 transition-colors"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                  <h3 className="caps-track font-display text-[18px] md:text-[20px]">
                    {c.title}
                  </h3>
                  <p className="mt-1 italic font-display text-[14px] text-cream/85 line-clamp-2">
                    {c.blurb}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="caps-track-tight text-[11px] text-oxblood">
                  {c.dishes.length} dishes
                </span>
                <span className="inline-flex items-center gap-1 caps-track-tight text-[11px] text-oxblood-dark">
                  {isOpen ? "Close" : "View"}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      isOpen ? "rotate-180" : ""
                    )}
                    strokeWidth={1.5}
                  />
                </span>
              </div>
            </button>

            <div
              id={`${c.slug}-panel`}
              role="region"
              aria-label={`${c.title} dishes`}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <ul className="divide-y divide-ink/10 px-5 pb-5">
                  {c.dishes.map((d) => (
                    <li
                      key={d.name}
                      className="flex items-baseline justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="font-display text-[16px] text-ink">
                          {d.name}
                          {d.dietary?.length ? (
                            <span className="ml-2 inline-flex gap-1 align-middle">
                              {d.dietary.map((tag) => (
                                <span
                                  key={tag}
                                  className="caps-track-tight text-[9px] border border-oxblood/40 text-oxblood px-1.5 py-0.5 rounded-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </span>
                          ) : null}
                        </p>
                        {d.description ? (
                          <p className="text-[14px] text-ink/70 mt-0.5">
                            {d.description}
                          </p>
                        ) : null}
                      </div>
                      <span className="font-display text-[16px] text-oxblood-dark whitespace-nowrap">
                        {d.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
