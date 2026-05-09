import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";
import { MasonryLightboxGallery } from "@/components/gallery/masonry-lightbox";
import { gallery } from "@/lib/gallery-data";

export const metadata: Metadata = {
  title: "Gallery & Ambience",
  description:
    "A peek inside Maidenhead Spice — the dining room, the food, the people. Tap any image to view it full-size.",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Ambience"
          title="A Peek Inside"
          subtitle="They say home is where the heart is. We have poured ours into every corner of this room — come and have a look."
        />
        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-[1320px] px-4 md:px-8">
            <MasonryLightboxGallery images={gallery} />
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
