/**
 * "Your puppy journey": as each step scrolls past, the phone on the right
 * types and then shows the matching WhatsApp reply.
 */
export function initChatSteps(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>(".tp-chat");
  if (!section) return;
  const steps = Array.from(section.querySelectorAll<HTMLElement>(".tp-chat__step"));
  const groups = Array.from(section.querySelectorAll<HTMLElement>(".tp-msg-group"));
  const typing = section.querySelector<HTMLElement>(".tp-typing");
  const screen = section.querySelector<HTMLElement>(".tp-phone__screen");
  let shown = -1;
  let typingTimer = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveal = (upTo: number) => {
    steps.forEach((s, i) => {
      if (i === upTo) s.setAttribute("data-active", "");
      else s.removeAttribute("data-active");
      if (i < upTo) s.setAttribute("data-done", "");
      else s.removeAttribute("data-done");
    });
    if (upTo <= shown) return;
    const next = shown + 1;
    shown = upTo;
    const showGroups = () => {
      if (typing) typing.dataset.show = "false";
      groups.forEach((g, i) => (g.dataset.show = String(i <= upTo)));
      screen?.scrollTo({ top: screen.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    };
    if (reduce || !typing) return showGroups();
    // type for a moment before the new message(s) arrive
    groups.forEach((g, i) => (g.dataset.show = String(i < next)));
    typing.dataset.show = "true";
    clearTimeout(typingTimer);
    typingTimer = window.setTimeout(showGroups, 650);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        reveal(steps.indexOf(e.target as HTMLElement));
      }
    },
    { rootMargin: "-40% 0px -45% 0px" },
  );
  steps.forEach((s) => io.observe(s));
  return () => {
    io.disconnect();
    clearTimeout(typingTimer);
  };
}
