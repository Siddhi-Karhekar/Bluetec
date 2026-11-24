import type { Metadata } from "next";
import NotesBoard from "@/components/faq/NotesBoard";
import { FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Questions & answers",
  description:
    "Vaccinations, meeting a puppy, delivery, imports from Korea — answers to the questions families ask us most.",
};

export default function FaqPage() {
  return (
    <div data-page="faq" className="tp-page">
      <section
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-faqroom overflow-hidden"
        style={{ "--sky-top": "#a95e32", "--sky-bottom": "#331c11" }}
        aria-labelledby="faq-title"
      >
        <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions & answers
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
              Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7.
            </p>
          </header>
          <div className="mt-12 md:mt-16">
            <NotesBoard faqs={FAQS} />
          </div>
        </div>
      </section>
    </div>
  );
}
