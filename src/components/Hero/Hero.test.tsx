import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../test/utils";
import { editorialTheme, streamingTheme, observatoryTheme } from "../../theme";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("the title is a level 1 heading by default", () => {
    renderWithTheme(<Hero title="Women in the blues" />);
    expect(screen.getByRole("heading", { level: 1, name: "Women in the blues" })).toBeInTheDocument();
  });

  it("allows choosing the heading level", () => {
    renderWithTheme(<Hero title="Section" level={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toBeInTheDocument();
  });

  it("shows the eyebrow, the description and the actions", () => {
    renderWithTheme(
      <Hero
        title="Title"
        eyebrow="Digital observatory"
        description="176 profiles"
        actions={<button>Explore</button>}
      />
    );
    expect(screen.getByText("Digital observatory")).toBeInTheDocument();
    expect(screen.getByText("176 profiles")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explore" })).toBeInTheDocument();
  });

  it("only the title is a heading", () => {
    renderWithTheme(<Hero title="Title" eyebrow="Label" description="Text" />);
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("does not add an unnamed landmark", () => {
    renderWithTheme(<Hero title="Title" />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("with a background image the content stays the same", () => {
    const { container } = renderWithTheme(
      <Hero
        title="Title"
        description="Text"
        actions={<button>Play</button>}
        image="https://example.com/photo.jpg"
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    // The image is a decorative background, not an <img> that screen readers would find.
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("accepts an image position", () => {
    renderWithTheme(
      <Hero title="Title" image="https://example.com/photo.jpg" imagePosition="center 30%" />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
  });

  it.each([
    ["editorial", editorialTheme],
    ["streaming", streamingTheme],
    ["observatory", observatoryTheme],
  ])("renders with the %s theme", (_name, theme) => {
    renderWithTheme(<Hero title="Title" />, theme);
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
  });
});
