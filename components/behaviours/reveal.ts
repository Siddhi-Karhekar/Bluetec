/** Fade/slide elements in as they enter the viewport. */
export function initReveal(root: HTMLElement) {
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
  if (!items.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.setAttribute("data-revealed", ""));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute("data-revealed", "");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );
  items.forEach((el) => {
    el.setAttribute("data-armed", "true");
    io.observe(el);
  });
  return () => io.disconnect();
}
