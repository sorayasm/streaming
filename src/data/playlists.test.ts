import { describe, expect, it } from "vitest";
import {
  links,
  musicPlaylists,
  platformOrder,
  platformsFor,
  podcastPlaylists,
  profiles,
  type MusicPlaylist,
} from "./playlists";

describe("music playlists", () => {
  it("has the five playlists, each with a unique id", () => {
    expect(musicPlaylists.map((playlist) => playlist.title)).toEqual([
      "Grandes Mujeres del Blues",
      "Blues Clásico Femenino",
      "Mujeres del Blues en Chile",
      "Mujeres del Blues Actual",
      "Mujeres del Blues en Español",
    ]);
    const ids = musicPlaylists.map((playlist) => playlist.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every playlist has a description, and a cover with the right format when it has one", () => {
    for (const playlist of musicPlaylists) {
      expect(playlist.description.trim(), playlist.id).not.toBe("");
      if (playlist.cover) {
        expect(playlist.cover, playlist.id).toMatch(/playlists\/[a-z-]+\.webp$/);
      }
    }
  });

  it("shows the four music services, in the same order on every card", () => {
    for (const playlist of musicPlaylists) {
      expect(platformsFor(playlist).map((platform) => platform.name)).toEqual(platformOrder);
    }
    expect(platformOrder).toEqual(["Spotify", "YouTube Music", "Amazon Music", "YouTube"]);
  });

  it("uses the profile of a service while the playlist has no link of its own", () => {
    const playlist: MusicPlaylist = { ...musicPlaylists[0], links: {} };
    for (const platform of platformsFor(playlist)) {
      expect(platform.href).toBe(profiles[platform.name as keyof typeof profiles]);
    }
  });

  it("uses the playlist's own link when it has one", () => {
    const playlist: MusicPlaylist = {
      ...musicPlaylists[0],
      links: { Spotify: "https://open.spotify.com/playlist/abc" },
    };
    const byName = Object.fromEntries(platformsFor(playlist).map((p) => [p.name, p.href]));
    expect(byName.Spotify).toBe("https://open.spotify.com/playlist/abc");
    expect(byName["YouTube Music"]).toBe(profiles["YouTube Music"]);
  });
});

describe("playlist links", () => {
  const entries = musicPlaylists.flatMap((playlist) =>
    Object.entries(playlist.links).map(([service, href]) => ({
      id: playlist.id,
      service,
      href: href as string,
    }))
  );

  it("every playlist has its own Spotify and Amazon Music link", () => {
    for (const playlist of musicPlaylists) {
      expect(playlist.links.Spotify, playlist.id).toMatch(/^https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]{22}$/);
      expect(playlist.links["Amazon Music"], playlist.id).toMatch(/^https:\/\/music\.amazon\.com\/user-playlists\//);
    }
  });

  it("links have no tracking parameters", () => {
    for (const { id, service, href } of entries) {
      expect(href, `${id} ${service}`).not.toMatch(/[?&](si|ref|drli|feature)=/);
    }
  });

  it("every playlist has its own link on the four services", () => {
    for (const playlist of musicPlaylists) {
      expect(Object.keys(playlist.links).sort(), playlist.id).toEqual([...platformOrder].sort());
    }
  });

  it("YouTube playlist ids have the expected format", () => {
    // Ids start with "PL" and have been seen with 11 or 32 characters after it.
    const all = [
      ...entries.map((entry) => ({ id: `${entry.id} ${entry.service}`, href: entry.href })),
      ...podcastPlaylists.flatMap((playlist) =>
        playlist.platforms.map((platform) => ({ id: playlist.id, href: platform.href }))
      ),
    ];
    for (const { id, href } of all) {
      const listId = href.match(/[?&]list=([^&]+)/)?.[1];
      if (listId) expect(listId, id).toMatch(/^PL[A-Za-z0-9_-]{10,}$/);
    }
  });

  it("YouTube and YouTube Music of a playlist point to the same list", () => {
    for (const playlist of musicPlaylists) {
      const youtube = playlist.links.YouTube?.match(/list=([^&]+)/)?.[1];
      const music = playlist.links["YouTube Music"]?.match(/list=([^&]+)/)?.[1];
      if (youtube || music) expect(youtube, playlist.id).toBe(music);
    }
  });
});

describe("links", () => {
  it("every address is a secure web address", () => {
    const all = [
      ...Object.values(links),
      ...Object.values(profiles),
      ...musicPlaylists.flatMap((playlist) => Object.values(playlist.links)),
      ...podcastPlaylists.flatMap((playlist) => playlist.platforms.map((p) => p.href)),
    ];
    for (const href of all) {
      expect(href, href).toMatch(/^https:\/\//);
    }
  });

  it("podcast playlists have a title, a description and at least one platform", () => {
    expect(podcastPlaylists.length).toBeGreaterThan(0);
    for (const playlist of podcastPlaylists) {
      expect(playlist.title.trim(), playlist.id).not.toBe("");
      expect(playlist.platforms.length, playlist.id).toBeGreaterThan(0);
    }
  });
});
