"use client";

import { useId, useState } from "react";
import { type FieldErrors, readEnquiry, validateEnquiry } from "@/lib/enquiry";
import { WHATSAPP_URL } from "@/lib/site";

const input =
  "mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]";

function Field({
  label,
  name,
  required,
  hint,
  error,
  ...rest
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label className="block text-[0.95rem] font-semibold" htmlFor={id}>
        {label}{" "}
        {required ? (
          <span className="text-toffee-ink">*</span>
        ) : (
          <span className="font-normal text-cocoa-soft">(optional)</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={input}
        {...rest}
      />
      {hint ? (
        <p className="mt-1 text-sm text-cocoa-soft" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1 text-sm font-semibold text-[#b3261e]" id={`${id}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** "Ask about this puppy" form on each profile page. */
export default function EnquiryForm({
  puppyId,
  defaultMessage,
}: {
  puppyId: string;
  defaultMessage: string;
}) {
  const msgId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = readEnquiry(new FormData(e.currentTarget));
    const errs = validateEnquiry(data);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) setState("sent");
      else {
        setErrors(json.errors ?? {});
        setState("failed");
      }
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-[1.6rem] border-[3px] border-cocoa bg-honey p-8 text-center">
        <p className="font-plush text-[2rem] leading-tight">Thank you — we&apos;ve got your enquiry!</p>
        <p className="mx-auto mt-3 max-w-[40ch]">
          Our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          required
          autoComplete="name"
          minLength={2}
          maxLength={80}
          error={errors.name}
        />
        <Field
          label="Phone or WhatsApp"
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="With country code, e.g. +971 50 123 4567"
          error={errors.phone}
        />
        <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
        <Field
          label="Your area"
          name="area"
          autoComplete="address-level2"
          maxLength={80}
          hint="e.g. Dubai Marina"
          error={errors.area}
        />
      </div>
      <input type="hidden" name="puppyId" value={puppyId} />
      <div>
        <label className="block text-[0.95rem] font-semibold" htmlFor={msgId}>
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={msgId}
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={defaultMessage}
          className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
        />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
        </label>
      </div>
      {state === "failed" && !Object.keys(errors).length ? (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">
          Something went wrong sending your enquiry — please try again or message us on WhatsApp.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-primary w-full disabled:opacity-70 sm:w-auto"
      >
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
