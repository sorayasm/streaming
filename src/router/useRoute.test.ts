import { describe, expect, it } from "vitest";
import { parseHash, parsePath, paths, routePath } from "./useRoute";

describe("parsePath", () => {
  it.each(["/", "/index.html", ""])("%j is the home page", (path) => {
    expect(parsePath(path)).toEqual({ name: "home" });
  });

  it("recognizes the search, playlists and about pages", () => {
    expect(parsePath("/buscar/")).toEqual({ name: "search" });
    expect(parsePath("/playlists/")).toEqual({ name: "playlists" });
    expect(parsePath("/playlists/index.html")).toEqual({ name: "playlists" });
    expect(parsePath("/sobre")).toEqual({ name: "about" });
  });

  it("recognizes an episode and decodes its id", () => {
    expect(parsePath("/capitulo/t1e05/")).toEqual({ name: "episode", id: "t1e05" });
    expect(parsePath("/capitulo/a%20b/")).toEqual({ name: "episode", id: "a b" });
  });

  it("ignores the folder the site is served from", () => {
    expect(parsePath("/repo/", "/repo/")).toEqual({ name: "home" });
    expect(parsePath("/repo/capitulo/t3e04/", "/repo/")).toEqual({ name: "episode", id: "t3e04" });
  });

  it.each(["/nada/", "/capitulo/", "/capitulo/a/b/", "/playlists/x/", "/buscar/x/"])(
    "%s is not found",
    (path) => {
      expect(parsePath(path)).toEqual({ name: "notFound" });
    }
  );
});

describe("old addresses with a hash", () => {
  it("are still read", () => {
    expect(parseHash("#/")).toEqual({ name: "home" });
    expect(parseHash("#/capitulo/t1e05")).toEqual({ name: "episode", id: "t1e05" });
    expect(parseHash("#/sobre")).toEqual({ name: "about" });
  });

  it("turn into the new address", () => {
    expect(routePath(parseHash("#/capitulo/t1e05"))).toBe("/capitulo/t1e05/");
    expect(routePath(parseHash("#/buscar"))).toBe("/buscar/");
    expect(routePath({ name: "notFound" })).toBeNull();
  });
});

describe("paths", () => {
  it("builds the address of every page", () => {
    expect(paths.home()).toBe("/");
    expect(paths.episode("t1e05")).toBe("/capitulo/t1e05/");
    expect(paths.playlists()).toBe("/playlists/");
    expect(paths.search()).toBe("/buscar/");
    expect(paths.about()).toBe("/sobre/");
  });
});
