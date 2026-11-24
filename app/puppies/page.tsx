import type { Metadata } from "next";
import Link from "next/link";
import Sketch from "@/components/puppies/Sketch";
import Teddy from "@/components/Teddy";
import PuppyFilters from "@/components/puppies/PuppyFilters";
import { availablePuppies, filterPuppies, gonePuppies, parseFilter } from "@/lib/puppies";
import { WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Available puppies",
  description:
    "Real photos of the actual puppies looking for a family right now — teacup Maltipoos, Pomeranians, Poodles and more.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const origins = Array.from(new Set(availablePuppies.map((p) => p.origin))).sort() as Array<
  "local" | "imported"
>;

export default async function PuppiesPage({ searchParams }: { searchParams: SearchParams }) {
  const filter = parseFilter(await searchParams);
  const puppies = filterPuppies(availablePuppies, filter);
  const filtered = Object.values(filter).some(Boolean);

  return (
    <div data-page="pups" className="tp-page">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                from Teddy's sketchbook
              </p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal="true">
                Available puppies
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  className="tp-sketchbook__underline"
                >
                  <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1" />
                </svg>
              </h1>
              <p
                className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft"
                data-reveal="true"
              >
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask
                us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal="true">
              <Teddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </div>
          <div className="mt-12">
            <PuppyFilters filter={filter} origins={origins} />
            <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
              {filtered
                ? `${puppies.length} ${puppies.length === 1 ? "puppy" : "puppies"} match`
                : `${puppies.length} puppies looking for a home`}
            </p>
            {puppies.length ? (
              <div>
                <ul className="tp-sketches mt-8">
                  {puppies.map((pup, i) => (
                    <li key={pup.slug}>
                      <Sketch pup={pup} index={i} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
                <Teddy pose="sit" className="mx-auto w-44 md:w-52" label="Teddy, tilting his head" />
                <div>
                  <p className="font-plush text-big">No puppies match just now.</p>
                  <p className="mt-3 max-w-[48ch] text-cocoa-soft">
                    Tell us what you're hoping for and we'll let you know what's in our showroom or what we
                    can bring in for you.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      Ask on WhatsApp
                    </a>
                    <Link href="/puppies" scroll={false} className="btn btn-ghost">
                      Show all puppies
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/3" data-reveal="true">
            <h2 id="gone-title" className="font-plush text-big">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
            <Link className="btn btn-primary mt-6" href="/gone-home">
              See the puppies who've gone home
            </Link>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {gonePuppies.slice(0, 5).map((pup, i) => (
              <li key={pup.slug}>
                <Sketch pup={pup} index={i} small />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
