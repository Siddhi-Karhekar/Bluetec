"use client";

import { useCallback, useEffect, useRef } from "react";

export type LightboxItem = {
  src: string;
  alt: string;
  caption?: string;
  /** Set for videos; `src` is then the poster frame. */
  video?: string;
};

type Props = {
  label: string;
  items: LightboxItem[];
  /** Index to show, or null when closed. */
  index: number | null;
  onIndexChange: (i: number | null) => void;
};

/**
 * Full-screen photo/video viewer built on a native <dialog>
 * (focus trap, Esc to close and top-layer stacking come for free).
 * Arrow keys and swipes move between items.
 */
export default function Lightbox({ label, items, index, onIndexChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const count = items.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const item = index !== null ? items[index] : null;

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={() => onIndexChange(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onIndexChange(null);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
    >
      {item ? (
        <div className="flex h-full flex-col gutter py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-scrawl text-lg text-honey" aria-live="polite">
              {index! + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => onIndexChange(null)}
              className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa"
              autoFocus
            >
              Close
            </button>
          </div>
          <figure className="relative mt-4 flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
            {item.video ? (
              <video
                key={item.video}
                src={item.video}
                poster={item.src}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-2xl border-[3px] border-milk/80 object-contain"
              />
            ) : (
              <img
                key={item.src}
                src={item.src}
                alt={item.alt}
                className="max-h-full max-w-full rounded-2xl border-[3px] border-milk/80 object-contain"
              />
            )}
            {item.caption ? <figcaption className="font-scrawl text-lg">{item.caption}</figcaption> : null}
          </figure>
          {count > 1 ? (
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="grid size-12 place-items-center rounded-full border-2 border-milk text-xl font-bold hover:bg-milk hover:text-cocoa"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="grid size-12 place-items-center rounded-full border-2 border-milk text-xl font-bold hover:bg-milk hover:text-cocoa"
              >
                ›
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
