import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import App from "./App";
import { content } from "./content";
import { episodes, getEpisode, seasons } from "./data/episodes";
import { musicPlaylists } from "./data/playlists";

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

function goTo(hash: string) {
  window.location.hash = hash;
}

beforeEach(() => {
  window.location.hash = "";
  document.title = "";
});

describe("Home", () => {
  it("has one level 1 heading, the name of the podcast", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: content.siteName })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("es");
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
    const previous = await screen.findByRole("link", { name: /^Anterior: / });
    const next = screen.getByRole("link", { name: /^Siguiente: / });
    expect(previous).toHaveAccessibleName(`Anterior: ${getEpisode("t1e04")!.title}`);
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
    expect(covers).toHaveLength(musicPlaylists.length);
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

describe("Accessibility (axe, WCAG 2.2 A and AA)", () => {
  it.each([
    ["home", ""],
    ["an episode", "#/capitulo/t1e05"],
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
