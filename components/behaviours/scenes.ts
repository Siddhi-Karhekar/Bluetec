/**
 * Mark each illustrated scene as "here" while it is on screen and
 * "visited" once it has been seen (drives one-off animations like the
 * house door opening).
 */
export function initScenes(root: HTMLElement) {
  const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-pup-scene]"));
  if (!scenes.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        el.dataset.here = String(e.isIntersecting);
        if (e.isIntersecting) el.dataset.visited = "true";
      }
    },
    { threshold: 0.25 },
  );
  scenes.forEach((s) => io.observe(s));
  return () => io.disconnect();
}
