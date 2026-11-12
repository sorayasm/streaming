import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLastEpisode, LAST_EPISODE_KEY, saveLastEpisode } from "./progress";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("last episode", () => {
  it("is empty at first", () => {
    expect(getLastEpisode()).toBeUndefined();
  });

  it("remembers the episode that was opened", () => {
    saveLastEpisode("t1e05");
    expect(getLastEpisode()?.title).toBe("Entrevista a Syldaza");
  });

  it("ignores an id that no longer exists", () => {
    localStorage.setItem(LAST_EPISODE_KEY, "t9e99");
    expect(getLastEpisode()).toBeUndefined();
  });

  it("does not break when the browser cannot store anything", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => saveLastEpisode("t1e05")).not.toThrow();
    expect(getLastEpisode()).toBeUndefined();
  });
});
