import { describe, expect, it } from "vitest";
import { parseHash } from "./useHashRoute";

describe("parseHash", () => {
  it.each(["", "#", "#/", "/"])("%j is the home page", (hash) => {
    expect(parseHash(hash)).toEqual({ name: "home" });
  });

  it("recognizes the search page", () => {
    expect(parseHash("#/buscar")).toEqual({ name: "search" });
  });

  it("recognizes the playlists and about pages", () => {
    expect(parseHash("#/playlists")).toEqual({ name: "playlists" });
    expect(parseHash("#/sobre")).toEqual({ name: "about" });
  });

  it("recognizes an episode and reads its id", () => {
    expect(parseHash("#/capitulo/t1e05")).toEqual({ name: "episode", id: "t1e05" });
  });

  it("decodes the episode id", () => {
    expect(parseHash("#/capitulo/a%20b")).toEqual({ name: "episode", id: "a b" });
  });

  it.each(["#/nada", "#/capitulo", "#/capitulo/a/b", "#/playlists/x", "#/buscar/x"])(
    "%s is not found",
    (hash) => {
      expect(parseHash(hash)).toEqual({ name: "notFound" });
    }
  );
});
