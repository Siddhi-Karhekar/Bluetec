import type React from "react";
import Link from "next/link";
import Teddy from "@/components/Teddy";
import Photo from "@/components/Photo";
import { coverAlt, getPuppy } from "@/lib/puppies";
import { WHATSAPP_URL } from "@/lib/site";

/** Where each puppy "sits" behind the quilt: x position, width, how far it peeks, tilt. */
const LINEUP = [
  { slug: "toy-poodle-male-female", x: "9%", w: "8.6rem", peek: 0.62, tilt: "-5deg" },
  { slug: "korean-teacup-pomeranian-male", x: "22.5%", w: "10.4rem", peek: 0.8, tilt: "3deg" },
  { slug: "pomeranian-female", x: "35%", w: "9.2rem", peek: 0.7, tilt: "-2deg" },
  { slug: "maltipoo-female-2", x: "65%", w: "9.4rem", peek: 0.74, tilt: "3deg" },
  { slug: "maltipoo-max-male", x: "77.5%", w: "10.6rem", peek: 0.82, tilt: "-3deg" },
  { slug: "maltipoo-cavapoo-male", x: "91%", w: "8.4rem", peek: 0.6, tilt: "4deg" },
];
type Seat = (typeof LINEUP)[number];

const seats = LINEUP.map((seat) => ({ seat, pup: getPuppy(seat.slug)! }));

const seatStyle = (s: Seat, i: number) =>
  ({
    "--x": s.x,
    "--w": s.w,
    "--peek": String(s.peek),
    "--tilt": s.tilt,
    "--i": String(i),
  }) as React.CSSProperties;

export default function Hero() {
  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-hero"
      style={{ "--sky-top": "#fffdf8", "--sky-bottom": "#fff1d8", "--quilt": "#fff1d8" }}
      aria-labelledby="hero-title"
      data-here="true"
      data-visited="true"
    >
      <span aria-hidden="true" className="tp-hero__sun" />
      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl">
          every puppy is family
          <svg
            viewBox="0 0 220 24"
            preserveAspectRatio="none"
            className="absolute -bottom-2 left-0 h-3 w-full text-toffee"
            aria-hidden="true"
          >
            <path
              d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="tp-hero__line">Premium teacup</span>
          <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
        </h1>
        <p className="tp-hero__lede">
          Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted
          breeders worldwide.
        </p>
        <div className="tp-hero__actions">
          <Link className="btn btn-primary" href="/puppies">
            View available puppies
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Enquire on WhatsApp
          </a>
        </div>
      </div>
      <div className="tp-hero__stage">
        <ul className="tp-lineup" aria-label="Some of the puppies in our showroom">
          {seats.map(({ pup, seat }, i) => (
            <li key={pup.slug} className="tp-lineup__seat" style={seatStyle(seat, i)}>
              <Link
                className="tp-lineup__pup"
                data-pup-friend="true"
                aria-label={`Meet ${pup.name}, ${pup.breed}`}
                href={`/puppies/${pup.slug}`}
              >
                <span className="tp-lineup__photo">
                  <Photo
                    src={pup.cover.src}
                    alt={coverAlt(pup)}
                    pos={pup.cover.pos}
                    color={pup.cover.color}
                    priority
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
          {seats.map(({ pup, seat }, i) => (
            <li key={pup.slug} className="tp-lineup__seat" style={seatStyle(seat, i)}>
              <span className="tp-lineup__ghost">
                <span className="tp-lineup__name font-scrawl">{pup.name}</span>
              </span>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="tp-lineup__wings" data-for="2">
          <Photo
            src="/media/xeMJCapr5vcU/e618c653b2/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg"
            alt=""
            pos="54.5% 45.7%"
            color="#f8d8b8"
          />
        </span>
        <div
          data-pup-stop="true"
          data-pose="peek"
          data-facing="right"
          data-act="peekaboo"
          data-behind="true"
          data-lane="true"
          className="pup-stop tp-hero__teddy"
        >
          <Teddy pose="peek" label="Teddy, the TeddyPups puppy, peeking over the quilt" />
        </div>
        <div aria-hidden="true" className="tp-quilt">
          <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
            <defs>
              <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: "var(--quilt)" }} />
                <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
                <path
                  d="M11 33A27 19 0 0 1 65 33"
                  fill="none"
                  stroke="#2a170e"
                  strokeWidth="1.6"
                  strokeDasharray="3.5 5.5"
                  strokeLinecap="round"
                  opacity=".42"
                />
              </pattern>
            </defs>
            <rect width="100%" height="40" fill="url(#tp-scallop)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
