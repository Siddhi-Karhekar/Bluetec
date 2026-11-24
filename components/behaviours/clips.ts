/** Tap-to-play video clips (muted, looping). */
export function initClips(root: HTMLElement) {
  const onClick = (e: Event) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>(".tp-clip__play");
    if (!btn) return;
    const video = btn.parentElement?.querySelector("video");
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Pause video");
    } else {
      video.pause();
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play video");
    }
  };
  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
