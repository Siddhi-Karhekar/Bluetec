"use client";

import type React from "react";
import { useState } from "react";
import { PawIcon } from "@/components/icons";
import Lightbox from "@/components/ui/Lightbox";
import { type FamilyPhoto, polaroidLook } from "@/lib/content";

function Polaroid({ photo, i }: { photo: FamilyPhoto; i: number }) {
  const look = polaroidLook(i);
  return (
    <span
      className="tp-polaroid"
      style={{ "--tilt": look.tilt, "--tape": look.tape, "--i": String(i) } as React.CSSProperties}
    >
      {look.tapes.map((t) => (
        <span key={t} aria-hidden="true" className={`tp-tape tp-tape--${t}`} />
      ))}
      <span className="tp-polaroid__photo">
        <img
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "auto", backgroundColor: photo.color }}
          src={photo.src}
        />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span>
    </span>
  );
}

const openLabel = (i: number, total: number, p: FamilyPhoto) =>
  `Open photo ${i + 1} of ${total}${p.caption ? `: ${p.caption}` : ""}`;

/** The full masonry wall on /happy-families. */
export function FamilyWall({ photos }: { photos: FamilyPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <ul className="tp-wall" aria-label="Photos from TeddyPups families">
        {photos.map((p, i) => (
          <li
            key={p.src}
            className="tp-wall__item"
            data-reveal="true"
            style={{ "--d": `${(i % 4) * 60}ms` } as React.CSSProperties}
          >
            <button
              type="button"
              className="tp-wall__print"
              aria-label={openLabel(i, photos.length, p)}
              onClick={() => setOpen(i)}
            >
              <Polaroid photo={p} i={i} />
              <PawIcon className="tp-wall__paw" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        label="Photo viewer"
        items={photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }))}
        index={open}
        onIndexChange={setOpen}
      />
    </div>
  );
}

/** Staggered pop-in delays for the eight prints on the home page wall. */
const HOME_DELAYS = [330, 0, 550, 110, 660, 220, 770, 440];

/**
 * The eight framed prints on the home page "house". Opening one shows the
 * whole family album, starting from that photo.
 */
export function HomePhotoWall({
  picks,
  all,
  children,
}: {
  picks: FamilyPhoto[];
  all: FamilyPhoto[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className="tp-photowall__wall">
        <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
          {picks.map((p, i) => {
            const idx = all.indexOf(p);
            return (
              <li
                key={p.src}
                data-reveal="true"
                style={{ "--d": `${HOME_DELAYS[i % 8]}ms` } as React.CSSProperties}
              >
                <button
                  type="button"
                  className="tp-photowall__print"
                  aria-label={openLabel(idx, all.length, p)}
                  onClick={() => setOpen(idx)}
                >
                  <Polaroid photo={p} i={i} />
                </button>
              </li>
            );
          })}
        </ul>
        {children}
      </div>
      <Lightbox
        label="Photo viewer"
        items={all.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }))}
        index={open}
        onIndexChange={setOpen}
      />
    </>
  );
}
