import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  /** CSS object-position (the photo's focal point). */
  pos?: string;
  /** Dominant colour shown while the photo loads. */
  color?: string | null;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * A cover-fit photo that fills its (relatively positioned) parent.
 * Images are pre-optimised (webp/avif/jpg) so a plain <img> with lazy
 * loading keeps the markup identical to the reference design.
 */
export default function Photo({ src, alt, pos = "50% 50%", color, priority, className, style }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: pos,
        backgroundColor: color ?? undefined,
        ...style,
      }}
    />
  );
}
