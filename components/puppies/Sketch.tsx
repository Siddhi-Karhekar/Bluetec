import Link from "next/link";
import type React from "react";
import { PAW_PATH } from "@/components/icons";
import Photo from "@/components/Photo";
import { coverAlt, genderWord, hasName, hasVideo, type Puppy } from "@/lib/puppies";
import { type Doodle, maskUrl, sketchArt } from "@/lib/sketch";

const stroke = { fill: "none", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function DoodleShape({ kind, color }: Pick<Doodle, "kind" | "color">) {
  switch (kind) {
    case "swirl":
      return (
        <path
          d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2"
          stroke={color}
          {...stroke}
        />
      );
    case "paw":
      return <path d={PAW_PATH} transform="scale(.17) translate(-32 -34)" fill={color} opacity="0.85" />;
    case "whiskers":
      return <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" stroke={color} {...stroke} />;
    case "dots":
      return (
        <g fill={color}>
          <circle cx="-4" cy="1" r="1.2" />
          <circle cx="0" cy="-2" r="1.2" />
          <circle cx="4" cy="1" r="1.2" />
        </g>
      );
    case "sparkle":
      return (
        <path
          d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z"
          fill={color}
        />
      );
    case "heart":
      return (
        <path
          d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z"
          stroke={color}
          {...stroke}
        />
      );
  }
}

/**
 * A puppy drawn into Teddy's sketchbook: photo inside a wobbly ink outline
 * with a watercolour wash behind and little doodles around it.
 * `small` is the compact variant used for puppies that have gone home.
 */
export default function Sketch({
  pup,
  index,
  small = false,
}: {
  pup: Puppy;
  index: number;
  small?: boolean;
}) {
  const art = sketchArt(pup.slug);
  const gone = pup.status === "gone";
  const mask = maskUrl(art.maskPath);
  const label = [
    pup.name,
    hasName(pup) ? pup.breed : null,
    genderWord(pup),
    pup.age,
    gone ? "gone home" : "available",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      className={small ? "tp-sketch tp-sketch--small" : "tp-sketch"}
      data-reveal="true"
      style={
        { "--tilt": art.tilt, "--d": `${(index % 8) * 70}ms`, "--wash": art.wash } as React.CSSProperties
      }
      aria-label={label}
      href={`/puppies/${pup.slug}`}
    >
      <span className="tp-sketch__frame">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="tp-sketch__wash"
          style={{ translate: art.washShift }}
        >
          <path d={art.washPath} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <Photo
            src={pup.cover.src}
            alt={small ? "" : coverAlt(pup)}
            pos={pup.cover.pos}
            color={pup.cover.color}
          />
        </span>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={art.inkPath} pathLength={1} className="tp-sketch__line" />
          <path d={art.retracePath} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {art.doodles.map((d, i) => (
            <g key={i} transform={d.transform}>
              <g className="tp-sketch__doodle">
                <DoodleShape kind={d.kind} color={d.color} />
              </g>
            </g>
          ))}
        </svg>
        {gone ? (
          <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>
        ) : (
          <span className="tp-sketch__sticker font-scrawl">Available</span>
        )}
        {!small && hasVideo(pup) ? <span className="tp-sketch__video">▶ video</span> : null}
      </span>
      <span className="tp-sketch__name font-plush">{pup.name}</span>
      {small ? null : (
        <span className="tp-sketch__meta">
          {hasName(pup) ? `${pup.breed} · ` : ""}
          {genderWord(pup)}
          {` · ${pup.age}`}
        </span>
      )}
    </Link>
  );
}
