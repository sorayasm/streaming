import { describe, expect, it } from "vitest";
import { allEpisodesNewestFirst, normalize, searchEpisodes } from "./search";

describe("normalize", () => {
  it("removes accents and case", () => {
    expect(normalize("  Nahí AZUL ")).toBe("nahi azul");
    expect(normalize("Sép7ima Nota")).toBe("sep7ima nota");
  });
});

describe("searchEpisodes", () => {
  it("an empty search returns every episode, the newest season first", () => {
    const all = searchEpisodes("");
    expect(all).toHaveLength(29);
    expect(all[0].id).toBe("t3e01");
    expect(all[all.length - 1].id).toBe("t1e21");
    expect(searchEpisodes("   ")).toEqual(all);
    expect(allEpisodesNewestFirst()).toEqual(all);
  });

  it("finds a guest without caring about accents or case", () => {
    expect(searchEpisodes("nahi").map((e) => e.id)).toEqual(["t2e04"]);
    expect(searchEpisodes("NAHÍ AZUL").map((e) => e.id)).toEqual(["t2e04"]);
  });

  it("needs every word of the search", () => {
    expect(searchEpisodes("jazz fuentes").map((e) => e.id).sort()).toEqual(["t1e14", "t2e02"]);
    expect(searchEpisodes("jazz kelo")).toEqual([]);
  });

  it("finds by the name of a season or of its kind", () => {
    expect(searchEpisodes("hideaway")).toHaveLength(4);
    expect(searchEpisodes("columna")).toHaveLength(4);
    expect(searchEpisodes("minipodcast")).toHaveLength(4);
  });

  it("returns nothing when nothing matches", () => {
    expect(searchEpisodes("zzz")).toEqual([]);
  });
});
