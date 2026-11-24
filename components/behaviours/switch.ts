/**
 * Segmented "In Dubai / Imported" switch on How it works.
 * Without JS both journeys are shown; with JS it becomes an ARIA tablist.
 */
export function initSwitch(root: HTMLElement) {
  const lists = Array.from(root.querySelectorAll<HTMLElement>(".tp-switch[role=tablist]"));
  const offs: Array<() => void> = [];
  for (const list of lists) {
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>("[role=tab]"));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls") ?? ""));
    const host = list.closest<HTMLElement>(".tp-journeys");
    const select = (i: number, focus = false) => {
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        if (panels[j]) panels[j]!.hidden = i !== j;
      });
      list.style.setProperty("--at", String(i));
      if (focus) tabs[i].focus();
      // replay the step cards' entrance animation
      if (host) {
        host.removeAttribute("data-ready");
        void host.offsetWidth;
        host.setAttribute("data-ready", "");
      }
    };
    const onClick = (e: Event) => {
      const i = tabs.indexOf((e.target as Element).closest("[role=tab]") as HTMLButtonElement);
      if (i >= 0) select(i);
    };
    const onKey = (e: KeyboardEvent) => {
      const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (i < 0) return;
      if (e.key === "ArrowRight") select((i + 1) % tabs.length, true);
      if (e.key === "ArrowLeft") select((i - 1 + tabs.length) % tabs.length, true);
    };
    list.addEventListener("click", onClick);
    list.addEventListener("keydown", onKey);
    select(
      Math.max(
        0,
        tabs.findIndex((t) => t.getAttribute("aria-selected") === "true"),
      ),
    );
    offs.push(() => {
      list.removeEventListener("click", onClick);
      list.removeEventListener("keydown", onKey);
    });
  }
  return () => offs.forEach((f) => f());
}
