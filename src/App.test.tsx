import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import App from "./App";
import { content } from "./content";
import { episodes, getEpisode, seasons } from "./data/episodes";
import { musicPlaylists } from "./data/playlists";
import { LAST_EPISODE_KEY } from "./data/progress";
import indexHtml from "../index.html?raw";

async function a11yViolations() {
  const results = await axe.run(document.body, {
    iframes: false,
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
    },
    // jsdom does not compute real colors; contrast is checked in the design system.
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help} → ${violation.nodes
        .map((node) => String(node.target))
        .join(" | ")}`
  );
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function goTo(hash: string) {
  window.location.hash = hash;
}

beforeEach(() => {
  window.location.hash = "";
  document.title = "";
  localStorage.clear();
});

describe("Home", () => {
  it("has one level 1 heading, the name of the podcast", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: content.siteName })).toBeInTheDocument();
  });

  it("declares Spanish as the page language", () => {
    // The language lives in index.html (jsdom does not load it), so the file itself is checked.
    expect(indexHtml).toMatch(/<html lang="es">/);
  });

  it("shows one shelf per season, the newest first", () => {
    render(<App />);
    const shelves = screen.getAllByRole("heading", { level: 2 });
    expect(shelves.map((heading) => heading.textContent)).toEqual([
      "Temporada 3 · Columnas para HideAway Blues",
      "Temporada 2 · #MiniPodcast",
      "Temporada 1 · El podcast",
    ]);
  });

  it("shows every episode as a card with a link to its page", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(episodes.length);
    expect(screen.getByRole("link", { name: "Entrevista a Syldaza" })).toHaveAttribute(
      "href",
      "#/capitulo/t1e05"
    );
  });

  it("the hero links to the latest episode and to the playlists", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: content.hero.latest })).toHaveAttribute(
      "href",
      "#/capitulo/t3e04"
    );
    expect(screen.getByRole("link", { name: content.hero.listen })).toHaveAttribute(
      "href",
      "#/playlists"
    );
  });

  it("has a skip link, and following it does not change the page", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("link", { name: content.skip }));
    expect(screen.getByRole("heading", { level: 1, name: content.siteName })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
  });

  it("shows the Mujeres del Blues icon as a decorative image next to the name", () => {
    const { container } = render(<App />);
    const logo = container.querySelector("header img");
    expect(logo).toHaveAttribute("alt", "");
    expect(logo?.getAttribute("src")).toContain("logo-mdb.webp");
    expect(screen.getByRole("link", { name: content.siteName })).toBeInTheDocument();
  });

  it("has the header and footer landmarks", () => {
    render(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

describe("Episode page", () => {
  it("opens from a card: shows the title as the page heading and focuses it", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("link", { name: "Entrevista a Syldaza" }));

    const heading = await screen.findByRole("heading", { level: 1, name: "Entrevista a Syldaza" });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(document.title).toBe(`Entrevista a Syldaza · ${content.siteName}`);
  });

  it("shows a play button instead of loading YouTube", async () => {
    goTo("#/capitulo/t1e05");
    const { container } = render(<App />);
    expect(
      await screen.findByRole("button", { name: "Reproducir video: Entrevista a Syldaza" })
    ).toBeInTheDocument();
    expect(container.querySelector("iframe")).not.toBeInTheDocument();
  });

  it("shows the season, the episode label and the list of the season", async () => {
    goTo("#/capitulo/t1e05");
    render(<App />);
    expect(await screen.findByText("Temporada 1 · Capítulo 5")).toBeInTheDocument();

    const list = screen.getByRole("list", { name: "Episodios de la temporada 1" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(21);
    const current = within(list).getByRole("link", { name: "Entrevista a Syldaza" });
    expect(current).toHaveAttribute("aria-current", "true");
    expect(within(list).getByText(/Reproduciendo/)).toBeInTheDocument();
  });

  it("columns are labeled as columns", async () => {
    goTo("#/capitulo/t3e02");
    render(<App />);
    expect(await screen.findByText("Temporada 3 · Columna 2")).toBeInTheDocument();
  });

  it("has links to the previous and the next episode", async () => {
    goTo("#/capitulo/t1e05");
    render(<App />);
    const previous = await screen.findByRole("link", { name: /^Anterior/ });
    const next = screen.getByRole("link", { name: /^Siguiente/ });
    // The name is "Anterior" plus the hidden title of that episode; whether a space
    // comes before the colon depends on the browser, so only the title is checked.
    expect(previous).toHaveAccessibleName(new RegExp(escapeRegExp(getEpisode("t1e04")!.title)));
    expect(next).toHaveAccessibleName(new RegExp(escapeRegExp(getEpisode("t1e06")!.title)));
    expect(previous).toHaveAttribute("href", "#/capitulo/t1e04");
    expect(next).toHaveAttribute("href", "#/capitulo/t1e06");
  });

  it("the first episode has no previous link", async () => {
    goTo("#/capitulo/t2e01");
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByRole("link", { name: /^Anterior/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Siguiente/ })).toBeInTheDocument();
  });

  it("an unknown episode shows the not found page", async () => {
    goTo("#/capitulo/no-existe");
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: content.notFound.title })
    ).toBeInTheDocument();
  });
});

describe("Other pages", () => {
  it("the playlists page lists the playlists with links that open a new tab", async () => {
    goTo("#/playlists");
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: content.playlists.title })
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /^YouTube.*Temporada 1 en YouTube/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("href")).toContain("youtube.com/playlist?list=");
  });

  it("shows a card with a cover for each music playlist", async () => {
    goTo("#/playlists");
    const { container } = render(<App />);
    await screen.findByRole("heading", { level: 1, name: content.playlists.title });

    for (const playlist of musicPlaylists) {
      expect(screen.getByRole("heading", { level: 3, name: playlist.title })).toBeInTheDocument();
    }
    // Covers are decorative: the title already names each playlist.
    const covers = container.querySelectorAll('img[src*="playlists/"]');
    expect(covers).toHaveLength(musicPlaylists.filter((playlist) => playlist.cover).length);
    covers.forEach((cover) => expect(cover).toHaveAttribute("alt", ""));
  });

  it("every music playlist links to the four music services", async () => {
    goTo("#/playlists");
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: content.playlists.title });

    expect(screen.getAllByRole("link", { name: /^Spotify/ })).toHaveLength(musicPlaylists.length);
    expect(screen.getAllByRole("link", { name: /^YouTube Music/ })).toHaveLength(musicPlaylists.length);
    expect(screen.getAllByRole("link", { name: /^Amazon Music/ })).toHaveLength(musicPlaylists.length);

    const spotify = screen.getByRole("link", { name: /^Spotify – Grandes Mujeres del Blues/ });
    expect(spotify.getAttribute("href")).toContain("open.spotify.com");
    expect(spotify).toHaveAttribute("target", "_blank");
  });

  it("the season 1 card of the podcast has a cover: the flyer of the premiere", async () => {
    goTo("#/playlists");
    const { container } = render(<App />);
    await screen.findByRole("heading", { level: 1, name: content.playlists.title });

    const heading = screen.getByRole("heading", { level: 3, name: "Temporada 1 en YouTube" });
    const card = heading.closest(".MuiCard-root") as HTMLElement;
    const cover = card.querySelector("img");
    expect(cover?.getAttribute("src")).toContain("flyers/t1e01.webp");
    expect(cover).toHaveAttribute("alt", "");
    expect(container).toBeTruthy();
  });

  it("a playlist opens its own list on a service, not the profile", async () => {
    goTo("#/playlists");
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: content.playlists.title });

    expect(
      screen.getByRole("link", { name: /^Spotify – Blues Clásico Femenino/ })
    ).toHaveAttribute("href", "https://open.spotify.com/playlist/2LSFMVQlfvPDTyrffmmCNE");
    expect(
      screen.getByRole("link", { name: /^YouTube – Blues Clásico Femenino/ })
    ).toHaveAttribute(
      "href",
      "https://www.youtube.com/playlist?list=PLajddc99FTAsc_4F5HWMtltv0KDlbTO-t"
    );
  });

  it("the about page explains the podcast and lists the seasons", async () => {
    goTo("#/sobre");
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: content.about.title })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: content.about.whyTitle })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(seasons.length);
  });

  it("an unknown address shows the not found page", async () => {
    goTo("#/nada");
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: content.notFound.title })
    ).toBeInTheDocument();
  });
});

describe("Navigation", () => {
  it("marks the current page in the main navigation", async () => {
    goTo("#/playlists");
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: content.playlists.title });
    // The test environment shows the compact header: open its menu.
    await userEvent.click(screen.getByRole("button", { name: content.nav.menu }));
    const nav = await screen.findByRole("navigation", { name: content.nav.ariaLabel });
    expect(within(nav).getByRole("link", { name: content.nav.playlists })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(within(nav).getByRole("link", { name: content.nav.home })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("moves between pages with the browser's hash changes", async () => {
    render(<App />);
    goTo("#/sobre");
    expect(
      await screen.findByRole("heading", { level: 1, name: content.about.title })
    ).toBeInTheDocument();
    goTo("#/");
    expect(
      await screen.findByRole("heading", { level: 1, name: content.siteName })
    ).toBeInTheDocument();
  });
});

describe("Search", () => {
  it("shows every episode at first, with their count", async () => {
    goTo("#/buscar");
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: content.search.title })
    ).toBeInTheDocument();
    expect(screen.getByText(content.search.count(episodes.length))).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(episodes.length);
  });

  it("filters while typing, without caring about accents", async () => {
    const user = userEvent.setup();
    goTo("#/buscar");
    render(<App />);
    await user.type(await screen.findByRole("searchbox", { name: content.search.label }), "nahi");
    expect(screen.getByText(content.search.count(1))).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Entrevista a Nahí Azul de Intensa Bravura" })
    ).toHaveAttribute("href", "#/capitulo/t2e04");
  });

  it("says so when nothing matches", async () => {
    const user = userEvent.setup();
    goTo("#/buscar");
    render(<App />);
    await user.type(await screen.findByRole("searchbox", { name: content.search.label }), "zzz");
    expect(screen.getByText(content.search.empty("zzz"))).toBeInTheDocument();
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  });

  it("has its link in the menu, marked as the current page", async () => {
    goTo("#/buscar");
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: content.search.title });
    await userEvent.click(screen.getByRole("button", { name: content.nav.menu }));
    const nav = await screen.findByRole("navigation", { name: content.nav.ariaLabel });
    expect(within(nav).getByRole("link", { name: content.nav.search })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});

describe("Continue watching", () => {
  it("says what the main button opens", () => {
    render(<App />);
    const latest = episodes.find((episode) => episode.id === "t3e04")!;
    expect(screen.getByText(`${content.hero.latestLabel}: ${latest.title}`)).toBeInTheDocument();
  });

  it("remembers the episode that was opened", async () => {
    goTo("#/capitulo/t1e05");
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: "Entrevista a Syldaza" });
    expect(localStorage.getItem(LAST_EPISODE_KEY)).toBe("t1e05");
  });

  it("offers to continue where the person was", () => {
    localStorage.setItem(LAST_EPISODE_KEY, "t1e05");
    render(<App />);
    expect(screen.getByRole("link", { name: content.hero.continue })).toHaveAttribute(
      "href",
      "#/capitulo/t1e05"
    );
    expect(
      screen.getByText(`${content.hero.continueLabel}: Entrevista a Syldaza`)
    ).toBeInTheDocument();
  });
});

describe("Share", () => {
  it("every episode has a share button", async () => {
    goTo("#/capitulo/t1e05");
    render(<App />);
    expect(await screen.findByRole("button", { name: content.episode.share })).toBeInTheDocument();
  });
});

describe("Accessibility (axe, WCAG 2.2 A and AA)", () => {
  it.each([
    ["home", ""],
    ["an episode", "#/capitulo/t1e05"],
    ["the search page", "#/buscar"],
    ["the playlists", "#/playlists"],
    ["the about page", "#/sobre"],
    ["the not found page", "#/nada"],
  ])("%s has no violations", async (_name, hash) => {
    goTo(hash);
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    expect(await a11yViolations()).toEqual([]);
  });
});
