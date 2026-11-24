import Link from "next/link";
import Teddy from "@/components/Teddy";
import { HomePhotoWall } from "@/components/families/FamilyPhotos";
import { TESTIMONIAL, familyPhotos, homeWallPhotos } from "@/lib/content";

export default function HappyFamilies() {
  return (
    <section
      data-pup-scene="true"
      data-tone="dark"
      className="tp-scene tp-dusk"
      style={{ "--sky-top": "#a65a30", "--sky-bottom": "#4d2b19" }}
      aria-labelledby="dusk-title"
      data-here="false"
      data-visited="false"
    >
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">
            Happy families & puppies
          </h2>
          <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
            We are truly honored to see our puppies become cherished members of loving families. These
            heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their
            homes and hearts.
          </p>
        </div>
        <figure className="tp-dusk__note">
          <blockquote className="font-plush-text">“{TESTIMONIAL.quote}”</blockquote>
          <figcaption className="font-scrawl">
            {TESTIMONIAL.name}, {TESTIMONIAL.place}
          </figcaption>
        </figure>
      </div>
      <div className="tp-photowall">
        <HomePhotoWall picks={homeWallPhotos} all={familyPhotos}>
          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp">
              <span className="tp-lamp__light" />
            </span>
            <Link className="btn btn-primary tp-facade__cta" href="/happy-families">
              See every happy family
            </Link>
            <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-dusk__teddy">
              <Teddy pose="sit" />
            </div>
          </div>
        </HomePhotoWall>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
    </section>
  );
}
