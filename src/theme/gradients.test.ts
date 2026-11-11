import { describe, it, expect } from "vitest";
import { getContrastRatio } from "@mui/material/styles";
import {
  editorialTheme,
  streamingTheme,
  observatoryTheme,
  editorialColors,
  streamingColors,
  observatoryColors,
  createGradients,
  type ThemeColors,
} from "./index";

const AA = 4.5;

const cases: [string, ThemeColors, typeof editorialTheme][] = [
  ["editorial", editorialColors, editorialTheme],
  ["streaming", streamingColors, streamingTheme],
  ["observatory", observatoryColors, observatoryTheme],
];

const isFlat = (stops: readonly [string, string]) => stops[0] === stops[1];

describe("fills and gradients", () => {
  it.each(cases)("%s exposes CSS gradients on theme.vietri", (_name, _colors, theme) => {
    const { surface, action, actionHover } = theme.vietri.gradient;
    expect(surface).toMatch(/^linear-gradient\(/);
    expect(action).toMatch(/^linear-gradient\(/);
    expect(actionHover).toMatch(/^linear-gradient\(/);
  });

  it("actions are flat in every theme", () => {
    for (const [, colors] of cases) {
      expect(isFlat(colors.action)).toBe(true);
      expect(isFlat(colors.actionHover)).toBe(true);
    }
  });

  it("only the streaming surface uses a soft gradient", () => {
    expect(isFlat(editorialColors.surface)).toBe(true);
    expect(isFlat(observatoryColors.surface)).toBe(true);
    expect(isFlat(streamingColors.surface)).toBe(false);
  });

  it("the streaming gradient goes from violet to lavender", () => {
    expect(streamingColors.surface[0]).toBe(streamingColors.brand.violet);
    expect(streamingColors.surface[1]).toBe(streamingColors.derived.lavenderDeep);
  });

  it("no theme draws decorative glows", () => {
    for (const [, colors] of cases) {
      expect(colors.glow).toBeNull();
    }
  });

  it("createGradients still turns two different colors into a gradient", () => {
    const g = createGradients({
      surface: ["#000000", "#FFFFFF"],
      action: ["#111111", "#EEEEEE"],
      actionHover: ["#EEEEEE", "#111111"],
    });
    expect(g.surface).toContain("#000000 0%");
    expect(g.surface).toContain("#FFFFFF 100%");
    expect(g.actionHover).toContain("#EEEEEE 0%");
  });
});

describe("contrast on fills and gradients (WCAG AA, 4.5:1)", () => {
  it.each(cases)("%s: text on the primary action is readable at every color", (_name, colors) => {
    for (const stop of [...colors.action, ...colors.actionHover]) {
      expect(getContrastRatio(colors.onAction, stop)).toBeGreaterThanOrEqual(AA);
    }
  });

  it.each(cases)("%s: text on the surface is readable at every color", (_name, colors) => {
    for (const stop of colors.surface) {
      expect(getContrastRatio(colors.onSurface, stop)).toBeGreaterThanOrEqual(AA);
      expect(getContrastRatio(colors.onSurfaceSoft, stop)).toBeGreaterThanOrEqual(AA);
    }
  });
});

/** Mixes a color over white: `amount` of `color`, the rest white (a pure white photo under it). */
function overWhite(color: string, amount: number): string {
  const channels = [1, 3, 5].map((index) => parseInt(color.slice(index, index + 2), 16));
  const mixed = channels.map((value) => Math.round(value * amount + 255 * (1 - amount)));
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

describe("text over a hero image (WCAG AA, 4.5:1)", () => {
  // Under the text the dark layer is at least 86% opaque. We test 85%, over the worst
  // possible photo: pure white.
  it.each(cases)("%s: text stays readable over a white photo", (_name, colors) => {
    const worst = overWhite(colors.scrim, 0.85);
    expect(getContrastRatio(colors.onSurface, worst)).toBeGreaterThanOrEqual(AA);
    expect(getContrastRatio(colors.onSurfaceSoft, worst)).toBeGreaterThanOrEqual(AA);
  });

  it.each(cases)("%s: the dark layer is a dark color", (_name, colors) => {
    expect(getContrastRatio(colors.onSurface, colors.scrim)).toBeGreaterThanOrEqual(AA);
  });
});
