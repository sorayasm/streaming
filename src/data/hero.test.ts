import { describe, expect, it } from "vitest";
import { heroThumbnailUrl, latestEpisode } from "./episodes";
import { heroImage, pickHeroImage } from "./hero";

describe("hero image", () => {
  it("builds the large thumbnail address of a video", () => {
    expect(heroThumbnailUrl("abc")).toBe("https://i.ytimg.com/vi/abc/maxresdefault.jpg");
  });

  it("uses the file in public/ when there is one", () => {
    expect(pickHeroImage("hero.webp", "abc")).toBe("/hero.webp");
  });

  it("uses the thumbnail of the video when there is no file", () => {
    expect(pickHeroImage(null, "abc")).toBe(heroThumbnailUrl("abc"));
  });

  it("always gives an address to use", () => {
    expect(heroImage()).toMatch(/^(\/|https:\/\/)/);
    expect(heroImage().length).toBeGreaterThan(5);
    expect(latestEpisode().youtubeId).toHaveLength(11);
  });
});
