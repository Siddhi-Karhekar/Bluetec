/**
 * "Meet the pups": on large screens the row of doors is pinned and slides
 * sideways as you scroll (a horizontal treadmill). The door nearest the
 * middle of the screen swings open. On small screens it's a plain grid and
 * doors open as they scroll into view.
 */
export function initTreadmill(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>(".tp-meet");
  if (!section) return;
  const range = section.querySelector<HTMLElement>("[data-pin-range]");
  const track = section.querySelector<HTMLElement>(".tp-meet__track");
  const hall = section.querySelector<HTMLElement>(".tp-meet__hall");
  if (!range || !track || !hall) return;
  const doors = Array.from(track.querySelectorAll<HTMLElement>(".tp-door"));

  const wide = window.matchMedia("(min-width: 1024px) and (min-height: 560px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let io: IntersectionObserver | null = null;
  let raf = 0;
  let distance = 0;

  const setOpen = (el: HTMLElement, open: boolean) => (el.dataset.open = String(open));

  const measure = () => {
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    range.style.height = `calc(${distance}px + 100vh)`;
  };

  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = range.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const x = -p * distance;
      track.style.transform = `translate3d(${x}px,0,0)`;
      hall.style.setProperty("--floor-x", `${x.toFixed(1)}px`);
      // open the door closest to the centre of the viewport
      const mid = window.innerWidth / 2;
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      for (const d of doors) {
        const r = d.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - mid);
        if (dist < bestD) {
          bestD = dist;
          best = d;
        }
      }
      doors.forEach((d) => setOpen(d, d === best && bestD < window.innerWidth * 0.22));
    });
  };

  const enablePinned = () => {
    section.setAttribute("data-pinned", "");
    range.style.setProperty("--pinned", "1");
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
  };
  const disablePinned = () => {
    section.removeAttribute("data-pinned");
    range.style.removeProperty("height");
    track.style.transform = "";
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", measure);
  };
  const enableGrid = () => {
    io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setOpen(e.target as HTMLElement, e.intersectionRatio > 0.6)),
      { threshold: [0, 0.6, 1] },
    );
    doors.forEach((d) => io!.observe(d));
  };

  const apply = () => {
    disablePinned();
    io?.disconnect();
    if (wide.matches && !reduce.matches) enablePinned();
    else enableGrid();
  };

  // hover/focus always opens a door
  const hover = (e: Event) => {
    const d = (e.target as Element).closest<HTMLElement>(".tp-door");
    if (d) setOpen(d, e.type === "pointerover" || e.type === "focusin");
  };
  track.addEventListener("pointerover", hover);
  track.addEventListener("focusin", hover);

  apply();
  wide.addEventListener("change", apply);
  return () => {
    wide.removeEventListener("change", apply);
    track.removeEventListener("pointerover", hover);
    track.removeEventListener("focusin", hover);
    disablePinned();
    io?.disconnect();
    cancelAnimationFrame(raf);
  };
}
