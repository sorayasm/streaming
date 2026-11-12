import { assetUrl } from "./assetUrl";
import { heroThumbnailUrl, latestEpisode } from "./episodes";

/**
 * The picture behind the home page: a file inside `public/`, for example
 * "hero.webp". With `null`, the thumbnail of the latest episode is used.
 *
 * Use a wide picture (16:9, around 1920 × 1080) WITHOUT text on it, because the
 * text of the page goes over the left side. Keep it under about 200 KB.
 */
const HERO_FILE: string | null = "hero.webp";

export function pickHeroImage(file: string | null, youtubeId: string): string {
  return file ? assetUrl(file) : heroThumbnailUrl(youtubeId);
}

export function heroImage(): string {
  return pickHeroImage(HERO_FILE, latestEpisode().youtubeId);
}
