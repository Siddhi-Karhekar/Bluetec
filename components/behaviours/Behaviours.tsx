"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initChatSteps } from "./chat";
import { initClips } from "./clips";
import { initLineup } from "./lineup";

import { initReveal } from "./reveal";
import { initRibbon } from "./ribbon";
import { initScenes } from "./scenes";
import { initSwitch } from "./switch";
import { initTeddyChatter } from "./teddy";
import { initTreadmill } from "./treadmill";

/**
 * Progressive enhancement for the server-rendered markup.
 * Every page is fully readable without JS; these small modules add the
 * motion (reveals, pinned scroll, chat replay, notes, etc.) by toggling
 * data-attributes that the stylesheet already knows about.
 * Each init returns a cleanup so they re-run cleanly on client navigation.
 */
export default function Behaviours() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.getElementById("main") ?? document.body;
    const cleanups = [
      initReveal(root),
      initScenes(root),
      initLineup(root),
      initTreadmill(root),
      initChatSteps(root),
      initClips(root),
      initSwitch(root),
      initRibbon(root),

      initTeddyChatter(document.body),
    ];
    return () => cleanups.forEach((fn) => fn?.());
  }, [pathname]);

  return null;
}
