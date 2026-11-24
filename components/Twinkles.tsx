/** Scattered twinkling stars (decorative). */
const STAR =
  "M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z";

export type Star = { left: string; top: string; size: number };

export default function Twinkles({ stars }: { stars: readonly Star[] }) {
  return (
    <>
      {stars.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className="tp-twinkle absolute text-honey"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            animationDelay: `${(i * 0.4).toFixed(2)}s`,
          }}
          aria-hidden="true"
        >
          <path d={STAR} fill="currentColor" />
        </svg>
      ))}
    </>
  );
}
