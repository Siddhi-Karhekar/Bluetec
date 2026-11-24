"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PawIcon } from "@/components/icons";
import { NAV, SITE, WHATSAPP_URL } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Fixed header with a scalloped hem.
 * - `data-scrolled` shows the hem once the page has scrolled.
 * - `data-hidden` tucks the header away while scrolling down, back on scroll up.
 * - The mobile menu is a native <dialog> with an exit animation.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        // only hide after the first screen, and only when moving down noticeably
        if (Math.abs(y - lastY) > 6) setHidden(y > lastY && y > window.innerHeight * 0.6);
        lastY = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the menu whenever the route changes
  useEffect(() => {
    const d = dialogRef.current;
    if (d?.open) d.close();
    setHidden(false);
  }, [pathname]);

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => {
    const d = dialogRef.current;
    if (!d?.open) return;
    d.setAttribute("data-closing", "");
    const done = () => {
      d.removeAttribute("data-closing");
      d.close();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) done();
    else d.addEventListener("animationend", done, { once: true });
  };

  return (
    <header
      id="site-header"
      data-scrolled={scrolled}
      data-hidden={hidden}
      data-home={pathname === "/" ? "" : undefined}
      className="tp-header fixed inset-x-0 top-0 z-50"
    >
      <div className="tp-header__bar gutter">
        <Link className="tp-header__brand" aria-label={`${SITE.name} — home`} href="/">
          <img alt="" width={56} height={56} className="tp-header__logo" src="/brand/logo.png" />
          <span className="font-plush tp-header__name">{SITE.short}</span>
        </Link>
        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    data-active={active}
                    className="tp-nav-link"
                    href={item.href}
                  >
                    <span>{item.label}</span>
                    <PawIcon className="tp-nav-link__paw" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="tp-header__end">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp tp-header__wa"
          >
            WhatsApp us
          </a>
          <button
            type="button"
            onClick={openMenu}
            className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
            aria-haspopup="dialog"
          >
            <PawIcon className="size-4" />
            Menu
          </button>
          <dialog
            ref={dialogRef}
            aria-label="Site menu"
            onCancel={(e) => {
              e.preventDefault();
              closeMenu();
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeMenu();
            }}
            className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
          >
            <div className="flex h-full flex-col gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk"
                >
                  Close
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {NAV.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          aria-current={active ? "page" : undefined}
                          data-active={active}
                          onClick={closeMenu}
                          className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                          href={item.href}
                        >
                          <span>{item.label}</span>
                          <PawIcon className="tp-nav-link__paw" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="space-y-3">
                <a
                  href={WHATSAPP_URL}
                  className="btn btn-whatsapp w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>
                <p className="text-center text-sm font-medium">{SITE.phone}</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <svg aria-hidden="true" className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  );
}
