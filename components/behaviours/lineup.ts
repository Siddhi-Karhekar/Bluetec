/**
 * Hero line-up: puppies take turns popping up with their name tag;
 * hovering or focusing one shows its tag straight away.
 */
export function initLineup(root: HTMLElement) {
  const pups = Array.from(
    root.querySelectorAll<HTMLElement>(".tp-lineup:not(.tp-lineup--tags) .tp-lineup__pup"),
  );
  const ghosts = Array.from(root.querySelectorAll<HTMLElement>(".tp-lineup--tags .tp-lineup__ghost"));
  if (!pups.length) return;

  let current = -1;
  let paused = false;
  const show = (i: number) => {
    pups.forEach((p, j) => {
      if (j === i) p.dataset.state = "pop";
      else delete p.dataset.state;
    });
    ghosts.forEach((g, j) => {
      if (j === i) g.dataset.tag = "show";
      else delete g.dataset.tag;
    });
    current = i;
  };
  const hide = () => ghosts.forEach((g) => delete g.dataset.tag);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timer = reduce
    ? 0
    : window.setInterval(() => {
        if (!paused) show((current + 1) % pups.length);
      }, 2800);
  const first = reduce ? 0 : window.setTimeout(() => show(0), 1400);

  const offs: Array<() => void> = [];
  pups.forEach((p, i) => {
    const enter = () => {
      paused = true;
      show(i);
    };
    const leave = () => {
      paused = false;
      hide();
    };
    p.addEventListener("pointerenter", enter);
    p.addEventListener("focus", enter);
    p.addEventListener("pointerleave", leave);
    p.addEventListener("blur", leave);
    offs.push(() => {
      p.removeEventListener("pointerenter", enter);
      p.removeEventListener("focus", enter);
      p.removeEventListener("pointerleave", leave);
      p.removeEventListener("blur", leave);
    });
  });

  return () => {
    clearInterval(timer);
    clearTimeout(first);
    offs.forEach((f) => f());
  };
}
