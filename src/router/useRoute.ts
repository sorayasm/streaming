import { useEffect, useState } from "react";
import { pageUrl } from "../data/assetUrl";

export type Route =
  | { name: "home" }
  | { name: "episode"; id: string }
  | { name: "playlists" }
  | { name: "search" }
  | { name: "about" }
  | { name: "notFound" };

/**
 * The address of every page, inside the folder the site is served from:
 *   /                     → home
 *   /capitulo/t1e05/      → episode
 *   /playlists/           → playlists
 *   /buscar/              → search
 *   /sobre/               → about
 * Each one is also a real file in `dist/` (written by scripts/prerender.mjs),
 * so it opens directly, can be shared, and search engines can read it.
 */
export const paths = {
  home: () => pageUrl(""),
  episode: (id: string) => pageUrl(`capitulo/${encodeURIComponent(id)}/`),
  playlists: () => pageUrl("playlists/"),
  search: () => pageUrl("buscar/"),
  about: () => pageUrl("sobre/"),
};

function fromParts(parts: string[]): Route {
  if (parts.length === 0) return { name: "home" };
  if (parts.length === 1 && parts[0] === "playlists") return { name: "playlists" };
  if (parts.length === 1 && parts[0] === "sobre") return { name: "about" };
  if (parts.length === 1 && parts[0] === "buscar") return { name: "search" };
  if (parts.length === 2 && parts[0] === "capitulo") {
    return { name: "episode", id: decodeURIComponent(parts[1]) };
  }
  return { name: "notFound" };
}

/** Turns an address into a route. `base` is the folder the site is served from. */
export function parsePath(pathname: string, base = "/"): Route {
  const path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const clean = path.replace(/(^|\/)index\.html$/, "");
  return fromParts(clean.split("/").filter(Boolean));
}

/**
 * Old addresses had the page after a hash (`#/capitulo/t1e05`). They keep
 * working: this reads them, and the router then replaces them with the new one.
 */
export function parseHash(hash: string): Route {
  return fromParts(hash.replace(/^#\/?/, "").split("/").filter(Boolean));
}

/** The address of a route, or null for the not found page (it has none). */
export function routePath(route: Route): string | null {
  switch (route.name) {
    case "home":
      return paths.home();
    case "episode":
      return paths.episode(route.id);
    case "playlists":
      return paths.playlists();
    case "search":
      return paths.search();
    case "about":
      return paths.about();
    case "notFound":
      return null;
  }
}

function readLocation(): Route {
  const { hash, pathname } = window.location;
  if (hash.startsWith("#/")) {
    const route = parseHash(hash);
    const path = routePath(route);
    if (path) window.history.replaceState(null, "", path);
    return route;
  }
  return parsePath(pathname, import.meta.env.BASE_URL);
}

/** A click that the browser should handle itself: new tab, download, another site… */
function isPlainClick(event: MouseEvent): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/** The link of the site that was clicked, if the router should open it without reloading. */
function internalLink(event: MouseEvent): URL | null {
  if (!isPlainClick(event)) return null;
  const anchor = (event.target as Element | null)?.closest?.("a");
  if (!anchor) return null;
  const href = anchor.getAttribute("href");
  // Anchors such as the skip link (#content) only scroll and focus.
  if (!href || href.startsWith("#")) return null;
  if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (!url.pathname.startsWith(import.meta.env.BASE_URL)) return null;
  // Files of the site (llms.txt, sitemap.xml, images) are not pages.
  if (/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.endsWith(".html")) return null;
  return url;
}

/**
 * Routing with real addresses. Clicking a link of the site changes the address
 * without reloading the page, and the browser's back and forward buttons work.
 */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readLocation);

  useEffect(() => {
    function onPopState() {
      setRoute(readLocation());
    }
    function onClick(event: MouseEvent) {
      const url = internalLink(event);
      if (!url) return;
      event.preventDefault();
      const target = `${url.pathname}${url.search}${url.hash}`;
      if (target !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.history.pushState(null, "", target);
      }
      setRoute(readLocation());
    }
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return route;
}
