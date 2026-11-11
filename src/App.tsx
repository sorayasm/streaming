import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Footer, NavBar, SkipLink, streamingTheme } from "@sorayasm/vietri-ds";
import { content } from "./content";
import { assetUrl } from "./data/assetUrl";
import { getEpisode } from "./data/episodes";
import { links } from "./data/playlists";
import { AboutPage } from "./pages/AboutPage";
import { EpisodePage } from "./pages/EpisodePage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PlaylistsPage } from "./pages/PlaylistsPage";
import { useHashRoute, type Route } from "./router/useHashRoute";

function pageTitle(route: Route): string {
  const site = content.siteName;
  switch (route.name) {
    case "home":
      return site;
    case "episode": {
      const episode = getEpisode(route.id);
      return episode ? `${episode.title} · ${site}` : `${content.notFound.title} · ${site}`;
    }
    case "playlists":
      return `${content.playlists.title} · ${site}`;
    case "about":
      return `${content.about.title} · ${site}`;
    case "notFound":
      return `${content.notFound.title} · ${site}`;
  }
}

/** The Mujeres del Blues icon next to the name. It is decorative: the name already says it. */
function BrandName({ size }: { size: number }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}>
      <img
        src={assetUrl("logo-mdb.webp")}
        alt=""
        width={size}
        height={size}
        style={{ display: "block" }}
      />
      {content.siteName}
    </Box>
  );
}

function Page() {
  const route = useHashRoute();
  const lastKey = useRef<string | null>(null);

  // A single-page app does not reload, so on every page change we update the
  // tab title and move focus to the new page's heading. Screen readers then
  // announce the new page, and keyboard users start at its top. Nothing is
  // focused on the first load, or when the page did not really change.
  useEffect(() => {
    document.title = pageTitle(route);

    const key = JSON.stringify(route);
    const isFirstLoad = lastKey.current === null;
    const changed = lastKey.current !== key;
    lastKey.current = key;
    if (isFirstLoad || !changed) return;

    window.scrollTo(0, 0);
    const heading = document.querySelector<HTMLElement>("main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [route]);

  return (
    <>
      <SkipLink href="#content">{content.skip}</SkipLink>
      <NavBar
        brand={<BrandName size={36} />}
        brandHref="#/"
        ariaLabel={content.nav.ariaLabel}
        menuLabel={content.nav.menu}
        closeLabel={content.nav.close}
        links={[
          { label: content.nav.home, href: "#/", current: route.name === "home" || route.name === "episode" },
          { label: content.nav.playlists, href: "#/playlists", current: route.name === "playlists" },
          { label: content.nav.about, href: "#/sobre", current: route.name === "about" },
        ]}
      />
      <Box component="main" id="content" tabIndex={-1} sx={{ outline: "none", minHeight: "60vh" }}>
        {route.name === "home" && <HomePage />}
        {route.name === "episode" && <EpisodePage id={route.id} />}
        {route.name === "playlists" && <PlaylistsPage />}
        {route.name === "about" && <AboutPage />}
        {route.name === "notFound" && <NotFoundPage />}
      </Box>
      <Footer
        title={<BrandName size={28} />}
        description={content.footer.description}
        linksLabel={content.footer.linksLabel}
        externalLabel={content.footer.external}
        links={[
          { label: content.footer.links.motherSite, href: links.motherSite, external: true },
          { label: content.footer.links.youtube, href: links.youtube, external: true },
          { label: content.footer.links.instagram, href: links.instagram, external: true },
        ]}
        legal={content.footer.legal.replace("{year}", String(new Date().getFullYear()))}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={streamingTheme}>
      <CssBaseline />
      <Page />
    </ThemeProvider>
  );
}
