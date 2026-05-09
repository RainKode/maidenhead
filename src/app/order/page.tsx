import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CheckoutForm } from "@/components/order/checkout-form";
import { OrderSummary } from "@/components/order/order-summary";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your Maidenhead Spice order and request collection, delivery or dine-in pre-order confirmation.",
};

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Delivery, Collection & Dine-in"
          title="Checkout"
          subtitle="Review your dishes, choose how you would like them prepared, and we will call to confirm."
        />

        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto grid max-w-[1180px] gap-6 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <OrderSummary />
            <CheckoutForm />
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}