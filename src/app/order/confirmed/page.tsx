import type { Metadata } from "next";
import { ConfirmedSummary } from "@/components/order/confirmed-summary";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Maidenhead Spice order request has been received.",
};

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream px-6 py-16 md:px-10 md:py-20">
        <ConfirmedSummary refFromQuery={ref} />
      </main>
      <NewsletterFooter />
    </>
  );
}