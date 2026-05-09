import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { OurStorySection } from "@/components/sections/our-story-section";
import { MenuBookOrderSection } from "@/components/sections/menu-book-order-section";
import { ComfortFoodSection } from "@/components/sections/comfort-food-section";
import { AmbienceSection } from "@/components/sections/ambience-section";
import { OffersSection } from "@/components/sections/offers-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <OurStorySection />
        <ComfortFoodSection />
        <MenuBookOrderSection />
        <AmbienceSection />
        <OffersSection />
        <ReviewsSection />
        <FinalCtaSection />
      </main>
      <NewsletterFooter />
    </>
  );
}
