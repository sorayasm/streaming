import { describe, expect, it } from "vitest";
import {
  adjacentEpisodes,
  episodeHref,
  episodeImage,
  episodeLabel,
  episodes,
  episodesOfSeason,
  getEpisode,
  getSeason,
  latestEpisode,
  seasons,
  seasonsNewestFirst,
  thumbnailUrl,
} from "./episodes";

describe("episodes data", () => {
  it("has the three seasons of the podcast", () => {
    expect(seasons.map((season) => season.number)).toEqual([1, 2, 3]);
  });

  it("has 21, 4 and 4 episodes in seasons 1, 2 and 3", () => {
    expect(episodesOfSeason(1)).toHaveLength(21);
    expect(episodesOfSeason(2)).toHaveLength(4);
    expect(episodesOfSeason(3)).toHaveLength(4);
    expect(episodes).toHaveLength(29);
  });

  it("every id is unique", () => {
    const ids = episodes.map((episode) => episode.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every YouTube id is unique and has the right format", () => {
    const youtubeIds = episodes.map((episode) => episode.youtubeId);
    expect(new Set(youtubeIds).size).toBe(youtubeIds.length);
    for (const youtubeId of youtubeIds) {
      expect(youtubeId, youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
    }
  });

  it("numbers every season consecutively from 1", () => {
    for (const season of seasons) {
      const numbers = episodesOfSeason(season.number).map((episode) => episode.number);
      expect(numbers).toEqual(numbers.map((_value, index) => index + 1));
    }
  });

  it("every episode belongs to a known season and has a title", () => {
    for (const episode of episodes) {
      expect(() => getSeason(episode.season)).not.toThrow();
      expect(episode.title.trim(), episode.id).not.toBe("");
    }
  });
});

describe("flyers", () => {
  it("every episode has a flyer named after it", () => {
    for (const episode of episodes) {
      expect(episode.flyer, episode.id).toMatch(new RegExp(`flyers/${episode.id}\\.webp$`));
    }
  });

  it("the flyer file is named after the episode", () => {
    expect(getEpisode("t1e05")!.flyer).toMatch(/flyers\/t1e05\.webp$/);
  });

  it("an episode with a flyer shows it, square; the others show the video thumbnail", () => {
    expect(episodeImage(getEpisode("t1e05")!)).toEqual({
      url: getEpisode("t1e05")!.flyer,
      aspectRatio: "1 / 1",
    });
    // An episode without a flyer (none of the real ones, so it is built here).
    const video = { id: "t9e01", season: 9, number: 1, title: "No flyer", youtubeId: "abcdefghijk" };
    expect(episodeImage(video)).toEqual({
      url: thumbnailUrl(video.youtubeId),
      aspectRatio: "16 / 9",
    });
  });
});

describe("helpers", () => {
  it("lists the seasons from the newest to the oldest", () => {
    expect(seasonsNewestFirst.map((season) => season.number)).toEqual([3, 2, 1]);
  });

  it("the latest episode is the last one of the newest season", () => {
    expect(latestEpisode().id).toBe("t3e04");
  });

  it("finds an episode by id", () => {
    expect(getEpisode("t1e05")?.title).toBe("Entrevista a Syldaza");
    expect(getEpisode("nope")).toBeUndefined();
  });

  it("finds the previous and the next episode inside a season", () => {
    const middle = getEpisode("t1e05")!;
    expect(adjacentEpisodes(middle).previous?.id).toBe("t1e04");
    expect(adjacentEpisodes(middle).next?.id).toBe("t1e06");
  });

  it("the first episode has no previous and the last has no next", () => {
    expect(adjacentEpisodes(getEpisode("t2e01")!).previous).toBeUndefined();
    expect(adjacentEpisodes(getEpisode("t2e04")!).next).toBeUndefined();
  });

  it("labels chapters and columns differently", () => {
    expect(episodeLabel(getSeason(1), 3)).toBe("Capítulo 3");
    expect(episodeLabel(getSeason(3), 2)).toBe("Columna 2");
  });

  it("builds the thumbnail and the page link of an episode", () => {
    expect(thumbnailUrl("abc")).toBe("https://i.ytimg.com/vi/abc/hqdefault.jpg");
    expect(episodeHref("t1e05")).toBe("#/capitulo/t1e05");
  });
});
