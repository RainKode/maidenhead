import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { contact, hours } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Visit, call or message Maidenhead Spice — 117 Bridge Road, Maidenhead SL6 8NA.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Get in touch"
          title="Contact Us"
          subtitle="Open seven days a week. Drop in, give us a ring, or send us a note — we will get back to you."
        />

        <section className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 grid gap-12 lg:grid-cols-[1fr_320px]">
            <div className="bg-cream-deep border border-ink/10 px-6 md:px-10 py-10 md:py-12">
              <h2 className="caps-track text-[12px] text-oxblood mb-2">
                Send a message
              </h2>
              <p className="font-display text-[24px] text-ink mb-6">
                We will reply within one working day.
              </p>
              <ContactForm />
            </div>

            <aside className="space-y-8">
              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  Visit
                </h3>
                <address className="not-italic font-display text-[16px] text-ink/85 leading-relaxed">
                  {contact.addressLine1}
                  <br />
                  {contact.addressLine2}
                  <br />
                  {contact.postcode}
                </address>
              </div>
              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  Call
                </h3>
                <ul className="space-y-1.5 font-display text-[16px] text-ink/85">
                  {contact.phones.map((p) => (
                    <li key={p}>
                      <a href={`tel:${p.replace(/\s+/g, "")}`} className="link-rule">
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  WhatsApp
                </h3>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-[16px] text-ink/85 link-rule"
                >
                  {contact.whatsapp}
                </a>
              </div>
              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  Email
                </h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-display text-[16px] text-ink/85 link-rule"
                >
                  {contact.email}
                </a>
              </div>
              <div>
                <h3 className="caps-track text-[11px] text-oxblood mb-3">
                  Hours
                </h3>
                <ul className="space-y-1 text-[14px] text-ink/85">
                  {hours.weekly.map((d) => (
                    <li key={d.day} className="flex justify-between gap-4">
                      <span className="font-display">{d.day}</span>
                      <span className="text-right text-ink/70">{d.times}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-cream-deep border-t border-ink/10">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/8]">
            <iframe
              title="Maidenhead Spice on Google Maps"
              src={contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </section>
      </main>
      <NewsletterFooter />
    </>
  );
}
