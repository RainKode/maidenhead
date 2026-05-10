"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery-data";

type Props = { images: GalleryImage[] };

/**
 * CSS-columns masonry grid with a custom keyboard-accessible lightbox.
 * No third-party libraries — keeps bundle small.
 */
export function MasonryLightboxGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () =>
      setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="relative mb-3 md:mb-4 block w-full break-inside-avoid overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ink brutal-frame"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={
                img.ratio === "tall"
                  ? 1100
                  : img.ratio === "wide"
                  ? 520
                  : 800
              }
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
            <span className="sr-only">Open {img.alt}</span>
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[80] bg-ink/95 flex items-center justify-center p-4 md:p-10"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex size-10 items-center justify-center border-[3px] border-background bg-ink text-background hover:bg-background hover:text-ink transition-colors"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 md:left-8 inline-flex size-12 items-center justify-center border-[3px] border-background bg-ink text-background hover:bg-background hover:text-ink transition-colors"
          >
            <ChevronLeft className="size-6" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 md:right-8 inline-flex size-12 items-center justify-center border-[3px] border-background bg-ink text-background hover:bg-background hover:text-ink transition-colors"
          >
            <ChevronRight className="size-6" strokeWidth={1.5} />
          </button>
          <div
            className="relative w-full max-w-[1200px] aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <p className="absolute -bottom-9 inset-x-0 text-center caps-track-tight text-[11px] text-cream/80">
              {active.alt}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
