import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Hero } from "./Hero";

const meta = {
  title: "Components/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: "Digital observatory",
    title: "Women in the blues, mapped and documented",
    description:
      "176 profiles, their relationships and their stories, built from cited sources and reviewed by people.",
    level: 1,
    align: "left",
  },
  argTypes: {
    level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    align: { control: "inline-radio", options: ["left", "center"] },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button size="large">Explore the observatory</Button>
        <Button size="large" variant="outlined">
          About the project
        </Button>
      </>
    ),
  },
};

export const Centered: Story = {
  args: {
    align: "center",
    actions: <Button size="large">Get started</Button>,
  },
};

// A flat-color picture, so the story does not depend on the network.
const sampleImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="700"><rect width="1600" height="700" fill="#CCCCCC"/><circle cx="1250" cy="260" r="240" fill="#FFFFFF"/><circle cx="1000" cy="480" r="160" fill="#F2F2F2"/></svg>'
  );

/** A background image under a dark layer. Try a very light picture: the text stays readable. */
export const WithImage: Story = {
  args: {
    image: sampleImage,
    imagePosition: "center",
    actions: (
      <>
        <Button size="large">Play</Button>
        <Button size="large" variant="outlined">
          More information
        </Button>
      </>
    ),
  },
};
