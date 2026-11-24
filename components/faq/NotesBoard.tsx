"use client";

import type React from "react";
import { useId, useMemo, useState } from "react";
import Teddy from "@/components/Teddy";
import type { Faq } from "@/lib/content";
import { WHATSAPP_URL } from "@/lib/site";

const TILTS = ["-1.6deg", "1.2deg", "-0.8deg", "1.8deg", "-1.2deg", "0.7deg", "-1.9deg", "1.4deg"];
const PINS = ["var(--color-toffee)", "var(--color-sky-deep)", "#d9a13c", "#c45a6a"];

/** Wrap every occurrence of the search terms in <mark>. */
function highlight(text: string, terms: string[]) {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

/**
 * The FAQ "cork board": each question is a pinned note that unfolds to show
 * its answer. A search box filters notes live and highlights matches.
 */
export default function NotesBoard({ faqs }: { faqs: Faq[] }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());

  const terms = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 1),
    [query],
  );
  const visible = faqs.filter((f) => {
    const hay = `${f.question} ${f.answer}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const count = visible.length;

  return (
    <div className="tp-notes" data-open={open.size ? "" : undefined}>
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={searchId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="tp-notes__lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={searchId}
            type="search"
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {terms.length
            ? `${count} ${count === 1 ? "note matches" : "notes match"}`
            : `${faqs.length} notes on the board`}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden="true" className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          <Teddy pose="sit" label="Teddy, reading the notes" />
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp tp-notes__ask"
        >
          Ask your own question
        </a>
      </aside>
      <div className="tp-notes__board">
        {count ? (
          <ul className="tp-notes__list">
            {visible.map((f) => {
              const i = faqs.indexOf(f);
              const isOpen = open.has(f.id);
              return (
                <li
                  key={f.id}
                  className="tp-note"
                  data-reveal="true"
                  data-unfolded={isOpen ? "" : undefined}
                  style={
                    {
                      "--tilt": TILTS[i % TILTS.length],
                      "--pin": PINS[i % PINS.length],
                      "--i": String(i),
                    } as React.CSSProperties
                  }
                >
                  <span aria-hidden="true" className="tp-note__pin" />
                  <h2 className="tp-note__q">
                    <button
                      type="button"
                      id={`q-${f.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`a-${f.id}`}
                      onClick={() => toggle(f.id)}
                    >
                      <span className="font-plush-text">{highlight(f.question, terms)}</span>
                      <span aria-hidden="true" className="tp-note__chevron" />
                    </button>
                  </h2>
                  <div
                    id={`a-${f.id}`}
                    role="region"
                    aria-labelledby={`q-${f.id}`}
                    className="tp-note__answer"
                    inert={!isOpen}
                  >
                    <div className="tp-note__flap">
                      <p>{highlight(f.answer, terms)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="tp-note tp-note--empty">
            <p className="font-plush-text text-xl font-bold">
              Teddy sniffed everywhere — no note about that yet.
            </p>
            <p className="mt-2 text-cocoa-soft">
              Try another word, or{" "}
              <a className="link-ink" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                ask us on WhatsApp
              </a>
              . We reply 24/7.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
