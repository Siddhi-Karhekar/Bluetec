"use client";

import { useRef, useState } from "react";
import { PawIcon } from "@/components/icons";
import { type FieldErrors, readEnquiry, validateEnquiry } from "@/lib/enquiry";
import { WHATSAPP_URL } from "@/lib/site";

type Phase = "writing" | "sealing" | "posting" | "sent";
type Option = { id: string; label: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Envelope() {
  return (
    <svg viewBox="0 0 120 80" className="tp-post__envelope" aria-hidden="true">
      <rect x="4" y="6" width="112" height="70" rx="8" fill="#fffdf8" stroke="#2a170e" strokeWidth="3.4" />
      <path
        d="M4 70 L50 40 M116 70 L70 40"
        stroke="#2a170e"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="tp-post__flap"
        d="M6 9 L60 46 L114 9 Z"
        fill="#fbe3b4"
        stroke="#2a170e"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="46" r="7" fill="#a24a1a" stroke="#2a170e" strokeWidth="2.4" />
    </svg>
  );
}

function Mailbox({ className = "tp-post__box" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden="true">
      <rect x="74" y="110" width="12" height="88" fill="#7a4a2e" stroke="#2a170e" strokeWidth="3" />
      <path
        d="M20 112 V60 a50 50 0 0 1 100 0 V112 Z"
        fill="#a24a1a"
        stroke="#2a170e"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path d="M40 112 V62 a30 30 0 0 1 60 0 V112" fill="#3b2215" stroke="#2a170e" strokeWidth="3" />
      <rect x="40" y="74" width="60" height="8" rx="4" fill="#2a170e" />
      <g className="tp-post__flag">
        <rect x="122" y="40" width="6" height="52" fill="#2a170e" />
        <path
          d="M128 40 h26 v18 h-26 Z"
          fill="#f2be6b"
          stroke="#2a170e"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * The contact page's "Dear TeddyPups" letter. Fill in the blanks, post it:
 * the letter folds, drops into an envelope and goes into the mailbox.
 */
export default function LetterForm({ puppies }: { puppies: Option[] }) {
  const [phase, setPhase] = useState<Phase>("writing");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const sentRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = readEnquiry(new FormData(e.currentTarget));
    const errs = validateEnquiry(data);
    setErrors(errs);
    setFailed(false);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.ok) {
        if (json.errors) setErrors(json.errors);
        else setFailed(true);
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        setPhase("sealing");
        await wait(700);
        setPhase("posting");
        await wait(1500);
      }
      setPhase("sent");
      requestAnimationFrame(() => sentRef.current?.focus());
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (phase === "sent") {
    return (
      <div className="tp-post" data-phase="sent">
        <div ref={sentRef} tabIndex={-1} className="tp-post__sent" role="status">
          <Mailbox className="tp-post__box tp-post__box--sent" />
          <p className="font-plush mt-4 text-[2rem] leading-tight">Your letter is in the mailbox!</p>
          <p className="mx-auto mt-3 max-w-[36ch]">
            Thank you — our team will get back to you shortly. For the quickest reply, say hello on WhatsApp.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
            Say hello on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const invalid = (k: keyof FieldErrors) => (errors[k] ? true : undefined);
  const errorList = Object.values(errors).filter(Boolean);

  return (
    <div className="tp-post" data-phase={phase}>
      <form noValidate className="tp-letterform" onSubmit={onSubmit}>
        <span aria-hidden="true" className="tp-letter__stamp">
          <PawIcon className="size-9" />
        </span>
        <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>
        <p className="tp-letterform__line">
          {"my name is "}
          <span className="tp-blank" style={{ "--size": "16ch" }}>
            <input
              aria-label="Your name (required)"
              aria-invalid={invalid("name")}
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              name="name"
            />
          </span>
          {", and you can reach me on "}
          <span className="tp-blank" style={{ "--size": "15ch" }}>
            <input
              aria-label="Phone or WhatsApp number with country code (required)"
              aria-invalid={invalid("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="+971 50 123 4567"
              name="phone"
            />
          </span>
          {" or by email at "}
          <span className="tp-blank" style={{ "--size": "20ch" }}>
            <input
              aria-label="Email (optional)"
              aria-invalid={invalid("email")}
              type="email"
              autoComplete="email"
              placeholder="optional"
              name="email"
            />
          </span>
          .
        </p>
        <p className="tp-letterform__line">
          {"I live in "}
          <span className="tp-blank" style={{ "--size": "13ch" }}>
            <input
              aria-label="Your area (optional)"
              autoComplete="address-level2"
              maxLength={80}
              placeholder="e.g. Dubai Marina"
              name="area"
            />
          </span>
          {", and I'm curious about "}
          <span className="tp-blank tp-blank--select">
            <label htmlFor="letter-puppy" className="sr-only">
              Puppy you&apos;re interested in (optional)
            </label>
            <select id="letter-puppy" name="puppyId" defaultValue="">
              <option value="">any puppy (not sure yet)</option>
              {puppies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </span>
          .
        </p>
        <label htmlFor="letter-message" className="sr-only">
          Your message (optional)
        </label>
        <textarea
          id="letter-message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Anything else you'd like to tell us…"
          className="tp-letterform__note"
        />
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
          </label>
        </div>
        {errorList.length || failed ? (
          <div className="tp-letterform__alert" role="alert">
            <p className="font-semibold">
              {failed
                ? "Your letter couldn't be posted — please try again, or message us on WhatsApp."
                : "Almost there — just a couple of things:"}
            </p>
            {errorList.length ? (
              <ul>
                {errorList.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div className="tp-letterform__sign">
          <p className="font-scrawl">with love, a future puppy parent</p>
          <button type="submit" className="btn btn-primary disabled:opacity-70" disabled={busy}>
            {busy ? "Posting…" : "Post my letter"}
          </button>
        </div>
      </form>
      {phase === "sealing" || phase === "posting" ? (
        <div className="tp-post__scene" aria-hidden="true">
          <Envelope />
          <Mailbox />
        </div>
      ) : null}
    </div>
  );
}
