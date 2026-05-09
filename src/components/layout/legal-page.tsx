import { SiteHeader } from "../site-header";
import { NewsletterFooter } from "../sections/newsletter-footer";
import { PageHero } from "./page-hero";

type LegalPageProps = {
  title: string;
  intro?: string;
  /** Pre-formatted JSX body. Use semantic h2/p inside. */
  children: React.ReactNode;
};

/**
 * Shared shell for Privacy Policy, Cookie Policy and Service Disclaimer pages.
 */
export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero eyebrow="Namaste & Welcome" title={title} subtitle={intro} />
        <article className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-[760px] px-6 md:px-10 prose-legal">
            {children}
          </div>
        </article>
      </main>
      <NewsletterFooter />
    </>
  );
}
