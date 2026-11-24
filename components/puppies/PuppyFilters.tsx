"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { BREEDS, COLLECTIONS, type PuppyFilter } from "@/lib/puppies";

type Key = keyof PuppyFilter;

/**
 * Sticker-chip filters for the puppies page. State lives in the URL
 * (?origin=&collection=&breed=&gender=) so filtered views are shareable and
 * the list itself is rendered on the server.
 */
export default function PuppyFilters({
  filter,
  origins,
}: {
  filter: PuppyFilter;
  /** Which "where" options exist right now (e.g. no local pups in stock). */
  origins: Array<"local" | "imported">;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const apply = (next: PuppyFilter) => {
    const sp = new URLSearchParams();
    (Object.entries(next) as Array<[Key, string | undefined]>).forEach(([k, v]) => v && sp.set(k, v));
    const qs = sp.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };
  const toggle = (k: Key, v: string) => apply({ ...filter, [k]: filter[k] === v ? undefined : v });

  const Chip = ({
    on,
    onClick,
    children,
  }: {
    on: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button type="button" aria-pressed={on} className="tp-sticker-chip" onClick={onClick}>
      {children}
    </button>
  );
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  );

  return (
    <div
      role="group"
      aria-label="Filter puppies"
      aria-busy={pending}
      className="tp-sketchpad flex flex-col gap-4"
    >
      <Row label="where">
        <Chip
          on={!filter.origin && !filter.collection}
          onClick={() => apply({ ...filter, origin: undefined, collection: undefined })}
        >
          Everywhere
        </Chip>
        {origins.includes("local") ? (
          <Chip on={filter.origin === "local"} onClick={() => toggle("origin", "local")}>
            In Dubai
          </Chip>
        ) : null}
        {origins.includes("imported") ? (
          <Chip on={filter.origin === "imported"} onClick={() => toggle("origin", "imported")}>
            Imported
          </Chip>
        ) : null}
        {COLLECTIONS.map((c) => (
          <Chip key={c.slug} on={filter.collection === c.slug} onClick={() => toggle("collection", c.slug)}>
            {c.name}
          </Chip>
        ))}
      </Row>
      <Row label="breed">
        {BREEDS.map((b) => (
          <Chip key={b.slug} on={filter.breed === b.slug} onClick={() => toggle("breed", b.slug)}>
            {b.name}
          </Chip>
        ))}
      </Row>
      <Row label="boy or girl">
        <Chip on={filter.gender === "male"} onClick={() => toggle("gender", "male")}>
          Boys
        </Chip>
        <Chip on={filter.gender === "female"} onClick={() => toggle("gender", "female")}>
          Girls
        </Chip>
      </Row>
    </div>
  );
}
