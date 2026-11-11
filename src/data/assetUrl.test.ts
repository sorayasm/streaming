import { afterEach, describe, expect, it, vi } from "vitest";
import { assetUrl } from "./assetUrl";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("assetUrl", () => {
  it("returns a root path by default", () => {
    expect(assetUrl("soraya.webp")).toBe("/soraya.webp");
  });

  it("accepts a path that already starts with a slash", () => {
    expect(assetUrl("/soraya.webp")).toBe("/soraya.webp");
  });

  it("adds the sub-path the site is deployed under", () => {
    vi.stubEnv("BASE_URL", "/portfolio/");
    expect(assetUrl("soraya.webp")).toBe("/portfolio/soraya.webp");
  });
});
