import { useEffect, useState } from "react";

export type Route =
  | { name: "home" }
  | { name: "episode"; id: string }
  | { name: "playlists" }
  | { name: "search" }
  | { name: "about" }
  | { name: "notFound" };

/**
 * Turns a URL hash into a route:
 *   ""  "#"  "#/"          → home
 *   "#/capitulo/t1e05"     → episode
 *   "#/playlists"          → playlists
 *   "#/buscar"             → search
 *   "#/sobre"              → about
 */
export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home" };
  if (parts.length === 1 && parts[0] === "playlists") return { name: "playlists" };
  if (parts.length === 1 && parts[0] === "sobre") return { name: "about" };
  if (parts.length === 1 && parts[0] === "buscar") return { name: "search" };
  if (parts.length === 2 && parts[0] === "capitulo") {
    return { name: "episode", id: decodeURIComponent(parts[1]) };
  }
  return { name: "notFound" };
}

/**
 * Turns a real address into a route, for the static pages that search engines
 * read (`/capitulo/t1e05/`, `/sobre/`, `/playlists/`). `base` is the folder the
 * site is served from ("/" or "/repository/").
 */
export function parsePath(pathname: string, base = "/"): Route {
  const path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const clean = path.replace(/index\.html$/, "").replace(/^\/+|\/+$/g, "");
  return parseHash(clean ? `#/${clean}` : "");
}

/** A hash that points to a page (`#/…`), as opposed to an anchor such as `#content`. */
function isRouteHash(hash: string): boolean {
  return hash === "" || hash === "#" || hash.startsWith("#/");
}

/**
 * Hash-based routing: it works on any static host (GitHub Pages included)
 * without server configuration. Anchors like `#content` (the skip link) are
 * ignored, so they scroll and focus without changing the page.
 */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash;
    // A page hash wins; without one, the address itself says the page.
    if (hash.startsWith("#/")) return parseHash(hash);
    return parsePath(window.location.pathname, import.meta.env.BASE_URL);
  });

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash;
      if (!isRouteHash(hash)) return;
      setRoute(parseHash(hash));
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}
