"use client";

import { useState } from "react";
import Photo from "@/components/Photo";
import Lightbox from "@/components/ui/Lightbox";
import type { Media } from "@/lib/puppies";

/**
 * Profile photo book: big page with prev/next, a strip of thumbnails,
 * and a full-screen viewer (videos play there).
 */
export default function PuppyGallery({ name, media }: { name: string; media: Media[] }) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const count = media.length;
  const current = media[index];
  const kindLabel = (m: Media) => (m.kind === "video" ? "video" : "photo");
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <button
          type="button"
          className="absolute inset-0 block size-full"
          aria-label={`Open ${name}, ${kindLabel(current)} ${index + 1} of ${count} full screen`}
          onClick={() => setViewer(index)}
        >
          <Photo
            key={current.src}
            src={current.src}
            alt={current.alt}
            pos={current.pos}
            color={current.color}
            priority={index === 0}
          />
          {current.kind === "video" ? (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full border-[3px] border-cocoa bg-milk/95 text-2xl text-cocoa">
                ▶
              </span>
            </span>
          ) : null}
        </button>
        {count > 1 ? (
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
            >
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
      {count > 1 ? (
        <ul
          aria-label={`All photos of ${name}`}
          className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]"
        >
          {media.map((m, i) => {
            const active = i === index;
            return (
              <li key={m.src + i} className="shrink-0">
                <button
                  type="button"
                  aria-label={`${name}, ${kindLabel(m)} ${i + 1} of ${count}`}
                  aria-current={active}
                  onClick={() => setIndex(i)}
                  className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                    active
                      ? "-rotate-3 -translate-y-1 border-toffee-deep"
                      : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa"
                  }`}
                >
                  <Photo src={m.src} alt="" pos={m.pos} color={m.color} />
                  {m.kind === "video" ? (
                    <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">
                      ▶
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <Lightbox
        label={`${name} photos`}
        items={media.map((m) => ({ src: m.src, alt: m.alt, video: m.video }))}
        index={viewer}
        onIndexChange={(i) => {
          setViewer(i);
          if (i !== null) setIndex(i);
        }}
      />
    </div>
  );
}
