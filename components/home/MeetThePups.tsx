import type React from "react";
import Link from "next/link";
import Teddy from "@/components/Teddy";
import { PawIcon } from "@/components/icons";
import Photo from "@/components/Photo";
import { availablePuppies, coverAlt, genderWord, hasName, hasVideo, type Puppy } from "@/lib/puppies";

const DOOR_COLORS = ["#a24a1a", "#5a3a28", "#d4893f", "#b8644a", "#7a4a2e"];

/** "Maltipoo, boy, 3 months, with video" — the breed is skipped when it is already the name. */
function doorMeta(p: Puppy) {
  return [hasName(p) ? p.breed : null, genderWord(p), p.age, hasVideo(p) ? "with video" : null]
    .filter(Boolean)
    .join(", ");
}

export default function MeetThePups() {
  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-meet"
      style={{ "--sky-top": "#fff1d8", "--sky-bottom": "#fbe3b4" }}
      aria-labelledby="meet-title"
      data-here="false"
      data-visited="false"
    >
      <div data-pin-range="true">
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">
                Meet the pups
              </h2>
              <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                Real puppies, real photos, looking for their families right now.
              </p>
            </div>
            <Link className="btn btn-primary shrink-0" href="/puppies">
              See all available puppies
            </Link>
          </header>
          <div className="tp-meet__hall">
            <ol className="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
              {availablePuppies.map((pup, i) => (
                <li key={pup.slug} className="tp-door" data-open="false">
                  <Link
                    className="tp-door__link"
                    style={{ "--door": DOOR_COLORS[i % DOOR_COLORS.length] } as React.CSSProperties}
                    href={`/puppies/${pup.slug}`}
                  >
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">{pup.name}</span>
                      <span className="tp-door__meta">{doorMeta(pup)}</span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Photo
                          src={pup.cover.src}
                          alt={coverAlt(pup)}
                          pos={pup.cover.pos}
                          color={pup.cover.color}
                        />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">Available</span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="false">
                <Link className="tp-door__link" href="/puppies">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </Link>
              </li>
            </ol>
            <div aria-hidden="true" className="tp-meet__floor" />
            <div
              data-pup-stop="true"
              data-pose="walk"
              data-facing="right"
              className="pup-stop tp-meet__teddy"
              data-act="treadmill"
            >
              <Teddy pose="stand" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
