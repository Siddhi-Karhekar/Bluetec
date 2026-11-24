import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PawIcon } from "@/components/icons";
import Photo from "@/components/Photo";
import EnquiryForm from "@/components/puppies/EnquiryForm";
import PuppyGallery from "@/components/puppies/PuppyGallery";
import Teddy from "@/components/Teddy";
import { allPuppies, coverAlt, getPuppy, hasName, neighbours, type Puppy } from "@/lib/puppies";
import { SITE, WHATSAPP_URL } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return allPuppies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const pup = getPuppy((await params).slug);
  if (!pup) return {};
  const title = hasName(pup) ? `${pup.name} the ${pup.breed}` : `${pup.breed} puppy`;
  return {
    title,
    description: `${title} — ${pup.gender.toLowerCase()}, ${pup.age}. ${
      pup.status === "available"
        ? "Available now at TeddyPups Dubai."
        : "Already gone home to a loving family."
    }`,
    openGraph: { images: [pup.cover.src] },
  };
}

const PROMISES = [
  "Vaccinated",
  "Dewormed",
  "Verified health certificate from licensed vets",
  "Thoroughly checked before joining your family",
];

const IMPORT_STEPS = [
  ["Reserve your puppy", "Tell us which puppy has captured your heart."],
  ["Personalized consultation", "We finalize details with you and share updates on your puppy's journey."],
  ["Import and arrival", "We manage health checks, travel arrangements, and documentation."],
  ["Welcome home", "We help your new puppy settle in and ensure a smooth transition into your home."],
] as const;

function Check() {
  return (
    <svg viewBox="0 0 32 32" className="mt-0.5 size-6 shrink-0 text-toffee-deep" aria-hidden="true">
      <path
        d="M5 17l7 7L27 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreLink({ pup, label }: { pup: Puppy; label: string }) {
  return (
    <Link
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
      href={`/puppies/${pup.slug}`}
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        <Photo src={pup.cover.src} alt={coverAlt(pup)} pos={pup.cover.pos} color={pup.cover.color} />
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{pup.name}</span>
      </span>
    </Link>
  );
}

/**
 * A puppy's "storybook" profile: photo book on the left, name tag on the
 * right, then (for available puppies) the way home and an enquiry letter.
 */
export default async function PuppyPage({ params }: { params: Params }) {
  const pup = getPuppy((await params).slug);
  if (!pup) notFound();

  const available = pup.status === "available";
  const named = hasName(pup);
  const { prev, next } = neighbours(pup);
  const title = named ? `${pup.name} (${pup.breed})` : pup.name;
  let chapter = 0;
  const n = () => ++chapter;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: available ? "Puppies" : "Gone home",
        item: `${SITE.url}${available ? "/puppies" : "/gone-home"}`,
      },
      { "@type": "ListItem", position: 2, name: pup.name, item: `${SITE.url}/puppies/${pup.slug}` },
    ],
  };

  return (
    <div className="tp-page" data-page="pup">
      <article
        className="tp-storybook"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${pup.tint} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`,
        }}
      >
        <div aria-hidden="true" className="tp-ribbon">
          <div className="tp-ribbon__track">
            <span className="tp-ribbon__band" style={{ transform: "scaleY(0)" }} />
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={available ? "/puppies" : "/gone-home"}>
              {available ? "Available puppies" : "Gone home"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{pup.name}</span>
          </nav>

          <p className="tp-chapter">
            <span aria-hidden="true" className="tp-chapter__n font-plush">
              {n()}
            </span>
            <span className="font-scrawl">{available ? "hello, it's me" : "the day they went home"}</span>
          </p>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <PuppyGallery name={pup.name} media={pup.media} />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div
                  className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20"
                  data-reveal="true"
                >
                  <span aria-hidden="true" className="tp-tag__ring" />
                  <Teddy
                    pose="peek"
                    className="absolute -top-[4.8rem] right-6 w-[9.5rem]"
                    label={`Teddy, peeking over ${pup.name}'s tag`}
                  />
                  {available ? (
                    <span className="chip">
                      <PawIcon className="size-4 text-toffee" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-grid place-items-center rounded-full border-[3px] border-current px-3 py-1 font-scrawl text-sm uppercase tracking-wide -rotate-6 text-toffee-deep">
                      Gone home ♥
                    </span>
                  )}
                  <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.name}</h1>
                  <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      ["Breed", pup.breed],
                      ["Boy or girl", pup.gender],
                      ["Age", pup.age],
                      ["Where", pup.origin === "local" ? "In Dubai" : "Imported for you"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-scrawl text-sm text-cocoa-soft">{k}</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-8 flex flex-col gap-3">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      {available
                        ? `Ask about ${named ? pup.name : "this puppy"} on WhatsApp`
                        : "Ask about a puppy like this"}
                    </a>
                    <a href={`#enquire-${pup.slug}`} className="btn btn-ghost">
                      Send an enquiry
                    </a>
                  </div>
                </div>

                <div className="tp-paper mt-8 -rotate-1">
                  <p className="tp-chapter">
                    <span aria-hidden="true" className="tp-chapter__n font-plush">
                      {n()}
                    </span>
                    <span className="font-scrawl">what comes with {pup.name}</span>
                  </p>
                  <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {PROMISES.map((p) => (
                      <li key={p} className="flex items-start gap-3 font-semibold">
                        <Check />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {available && pup.origin === "imported" ? (
            <section aria-labelledby={`home-steps-${pup.slug}`} className="mt-20">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  {n()}
                </span>
                <span className="font-scrawl">the way home</span>
              </p>
              <h2 id={`home-steps-${pup.slug}`} className="font-plush text-big mt-3">
                Coming home from abroad
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                {IMPORT_STEPS.map(([h, p], i) => (
                  <li key={h}>
                    <span aria-hidden="true" className="tp-trail__num font-plush">
                      {i + 1}
                    </span>
                    <h3 className="font-plush-text text-xl font-bold leading-tight">{h}</h3>
                    <p className="mt-2 max-w-[38ch] text-cocoa-soft">{p}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section
            id={`enquire-${pup.slug}`}
            aria-labelledby={`enquire-title-${pup.slug}`}
            className="tp-letter mt-20 grid gap-10 lg:grid-cols-12"
          >
            <span aria-hidden="true" className="tp-letter__stamp">
              <PawIcon className="size-9" />
            </span>
            <div className="lg:col-span-4">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  {n()}
                </span>
                <span className="font-scrawl">dear TeddyPups…</span>
              </p>
              <h2 className="font-plush text-big mt-2" id={`enquire-title-${pup.slug}`}>
                {available
                  ? `Ask about ${named ? pup.name : "this puppy"}`
                  : "Looking for a puppy like this?"}
              </h2>
              <p className="mt-4 text-cocoa-soft">
                Leave your details and our team will get back to you promptly — or message us on WhatsApp for
                the quickest reply.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm puppyId={pup.id} defaultMessage={`Hi! I'd love to know more about ${title}.`} />
            </div>
          </section>

          <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
            <MoreLink pup={prev} label="Previous pup" />
            <MoreLink pup={next} label="Next pup" />
          </nav>
        </div>
      </article>
    </div>
  );
}
