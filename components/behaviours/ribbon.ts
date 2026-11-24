/** Bookmark ribbon on puppy profiles grows as you read down the page. */
export function initRibbon(root: HTMLElement) {
  const band = root.querySelector<HTMLElement>(".tp-ribbon__band");
  const book = band?.closest<HTMLElement>(".tp-storybook");
  if (!band || !book) return;
  let raf = 0;
  const update = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = book.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      band.style.transform = `scaleY(${p.toFixed(3)})`;
    });
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}
