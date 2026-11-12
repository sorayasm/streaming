import { assetUrl } from "./assetUrl";

export interface Photo {
  /** URL of the image. Build it with `assetUrl("file.webp")` for files in `public/`. */
  src: string;
  /** Real size of the file in pixels (the browser reserves the space with it). */
  width: number;
  height: number;
}

export interface SiteConfig {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  npm: string;
  storybook: string;
  /** Portrait shown in the "About" section. `null` hides it. */
  photo: Photo | null;
}

/** Links and contact details. Edit this file to change them everywhere. */
export const site: SiteConfig = {
  name: "Soraya Sacaan",
  // The address shown in the contact form's mail link. It is visible in the
  // page source, so consider a dedicated address to reduce spam.
  email: "sorayasm.periodista@gmail.com",
  github: "https://github.com/sorayasm",
  linkedin: "https://www.linkedin.com/in/sorayasm",
  npm: "https://www.npmjs.com/~sorayasm",
  storybook: "https://sorayasm.github.io/vietri-ds/",
  // The file lives in `public/`. To hide the photo, set this to `null`.
  photo: { src: assetUrl("soraya.webp"), width: 800, height: 1000 },
};

export type ProjectId = "vietri" | "streaming" | "observatory";

export interface ProjectLinks {
  status: "live" | "inProgress";
  /**
   * Screenshot shown on the project card (16:9, for example 1280 × 720 px).
   * Without it the card shows a plain placeholder. Build the path with
   * `assetUrl("projects/file.webp")` for files in `public/projects/`.
   */
  image?: Photo;
  demo?: string;
  source?: string;
}

/** Where each project can be seen. Projects without links show only their status. */
export const projectLinks: Record<ProjectId, ProjectLinks> = {
  vietri: {
    status: "live",
    image: { src: assetUrl("projects/vietri.webp"), width: 1280, height: 720 },
    demo: site.storybook,
    source: "https://github.com/sorayasm/vietri-ds",
  },
  streaming: {
    status: "live",
    // Screenshot of the home page of the site.
    image: { src: assetUrl("projects/streaming.webp"), width: 1280, height: 720 },
    demo: "https://elbluesesfemenino.cl",
    source: "https://github.com/sorayasm/streaming",
  },
  observatory: {
    status: "live",
    image: { src: assetUrl("projects/observatory.webp"), width: 1280, height: 720 },
    demo: "https://observatorio.mujeresdelblues.com",
  },
};
