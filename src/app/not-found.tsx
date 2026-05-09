import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-[760px] px-6 md:px-10 py-24 md:py-32 text-center">
          <p className="caps-track text-[12px] text-oxblood">404</p>
          <h1 className="mt-3 font-display text-[44px] md:text-[64px] leading-[1.05] text-ink">
            We can’t find that page
          </h1>
          <p className="mt-5 text-[16px] text-ink/75 leading-[1.7]">
            The link may be old, or the page may have moved. Why not have a
            look at the menu, or pop in for chai instead?
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="caps-track inline-flex items-center justify-center rounded-full bg-oxblood-dark px-7 h-11 text-[12px] font-semibold text-cream hover:bg-oxblood transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/menus"
              className="caps-track inline-flex items-center justify-center rounded-full border border-oxblood-dark px-7 h-11 text-[12px] font-semibold text-oxblood-dark hover:bg-oxblood-dark hover:text-cream transition-colors"
            >
              View the menu
            </Link>
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
