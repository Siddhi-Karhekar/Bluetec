# Porting helpers (one-off)

These scripts were used once, while building the clone, to turn the reference
site's server-rendered HTML into a first draft of JSX. Every generated section
was then rewritten by hand: lists became `.map()` over typed data, repeated
SVG (Teddy, icons, twinkles) became components, and the interactive parts were
re-implemented as React / client behaviours.

- `html2jsx.py` — HTML → JSX (attribute renames, inline styles → objects,
  SVG attribute casing, boolean attributes, image URL unwrapping).
- `mergetext.py` — merges sibling text nodes that React SSR splits
  (`"Sarah M."` + `", Dubai"`) so JSX doesn't insert stray spaces.

They are kept for transparency; the app does not depend on them.
