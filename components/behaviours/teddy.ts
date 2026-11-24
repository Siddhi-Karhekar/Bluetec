const LINES = ["woof!", "hi friend!", "hm?", "♥", "pet me again", "yip!"];

/** Click (or tap) Teddy and he says something in a speech bubble. */
export function initTeddyChatter(root: HTMLElement) {
  let n = 0;
  const timers = new Set<number>();
  const onClick = (e: Event) => {
    const buddy = (e.target as Element).closest<HTMLElement>(".pup-buddy");
    if (!buddy) return;
    const bubble = buddy.querySelector<HTMLElement>(".pup-bubble");
    if (!bubble) return;
    bubble.textContent = LINES[n++ % LINES.length];
    bubble.dataset.show = "true";
    buddy.setAttribute("data-playing", "");
    const t = window.setTimeout(() => {
      bubble.dataset.show = "false";
      buddy.removeAttribute("data-playing");
      timers.delete(t);
    }, 1600);
    timers.add(t);
  };
  root.addEventListener("click", onClick);
  return () => {
    root.removeEventListener("click", onClick);
    timers.forEach(clearTimeout);
  };
}
