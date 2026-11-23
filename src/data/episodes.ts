import { assetUrl } from "./assetUrl";

/**
 * Seasons and episodes of the podcast, taken from elbluesesfemenino.cl.
 *
 * Each video sits above its title on the original site, so every title below
 * is paired with the video that precedes it there. If an episode ever shows
 * the wrong video, fix its `youtubeId` here: nothing else depends on it.
 */

export interface Season {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  /** "chapter" → "Capítulo 3", "column" → "Columna 3". */
  kind: "chapter" | "column";
}

export interface Episode {
  id: string;
  season: number;
  number: number;
  title: string;
  /** YouTube video id (the 11 characters after `v=`). */
  youtubeId: string;
  /**
   * Square flyer of the episode (a file in `public/flyers/`). Without it the
   * thumbnail of the video is used.
   */
  flyer?: string;
}

export const seasons: Season[] = [
  {
    number: 1,
    title: "Temporada 1",
    subtitle: "El podcast",
    description:
      "El podcast nació en Goodstock, con el propósito de visibilizar a las mujeres que han marcado la historia del blues en Chile. Su primera temporada también está en YouTube.",
    kind: "chapter",
  },
  {
    number: 2,
    title: "Temporada 2",
    subtitle: "#MiniPodcast",
    description:
      "Cápsulas breves en YouTube que acercan estas historias a nuevas audiencias.",
    kind: "chapter",
  },
  {
    number: 3,
    title: "Temporada 3",
    subtitle: "Columnas para HideAway Blues",
    description:
      "Desde finales de 2025, una columna en HideAway Blues (Bahía Blanca Blues, transmitido por Taboo Radio, Argentina) lleva la voz de las mujeres del blues chileno a otros territorios.",
    kind: "column",
  },
];

/** Pass `true` as the last argument when `public/flyers/<id>.webp` exists. */
function episode(
  season: number,
  number: number,
  title: string,
  youtubeId: string,
  hasFlyer = false
): Episode {
  const id = `t${season}e${String(number).padStart(2, "0")}`;
  return {
    id,
    season,
    number,
    title,
    youtubeId,
    ...(hasFlyer && { flyer: assetUrl(`flyers/${id}.webp`) }),
  };
}

export const episodes: Episode[] = [
  // Temporada 1
  episode(1, 1, "Estreno", "dvPwoxfw_jE", true),
  episode(1, 2, "Entrevista a la Rox", "6OpOUSN131I", true),
  episode(1, 3, "Entrevista a Caro Lavanderos de La Psychoband", "XTuokU-QqrA", true),
  episode(1, 4, "Entrevista a Jo Becerra de Caña Blues", "Znmd9sBdnYU", true),
  episode(1, 5, "Entrevista a Syldaza", "0SWA9b94T1E", true),
  episode(1, 6, "Entrevista a la banda Hija del Diablo", "zQvx4Eb68Ps", true),
  episode(1, 7, "Entrevista a Gianinna Mutarello", "P0BaKaI__9s", true),
  episode(1, 8, "Entrevista a Geri Razeto", "Sb2xJKF-kRs", true),
  episode(1, 9, "Entrevista a Johanna Olivares de Lucila Blues", "-3Y9eHvfjgY", true),
  episode(1, 10, "Entrevista a Patty Torres de Bruja y Pato Lucas Band", "9toxBKlq1h0", true),
  episode(1, 11, "Entrevista a Yamila López de Prosa Onírica y Vieja Rúa", "jP0cfNJ61qg", true),
  episode(1, 12, "Entrevista a María Paz Cerda de la Sép7ima Nota", "9tM81FFVdOY", true),
  episode(1, 13, "Entrevista a Kelo de Coolcats", "gH_UxRHUud0", true),
  episode(1, 14, "Entrevista a Jazz Fuentes de As de Copas y Bim Bam Blues", "bD1cTBsu8qA", true),
  episode(1, 15, "Entrevista a La Exótica. Presentando su “Exótic Project”", "RqVCyNp4ZGE", true),
  episode(1, 16, "Especial Día del Blues con Geri Razeto", "d8r144t0WyE", true),
  episode(1, 17, "Entrevista a Ratalia", "0h9ZUTj_S2A", true),
  episode(1, 18, "Entrevista a Maka Letizia", "otCokb1kc78", true),
  episode(1, 19, "Entrevista a Catalina Pérez Garrido, la cuequera del blues", "Kj8fiRdoVvo", true),
  episode(1, 20, "Entrevista a Furronda Count", "jSahAJu-mcE", true),
  episode(1, 21, "Final de Temporada: entrevista a Miss JACK", "BhJ8ooUfFFM", true),

  // Temporada 2 · #MiniPodcast
  episode(2, 1, "Entrevista a Marcela Briones de banda Clavijeros", "6-b2K1UEU5Q", true),
  episode(2, 2, "Entrevista a Jazz Fuentes de As de Copas", "iH26nmWs1c0", true),
  episode(2, 3, "Entrevista a Elizabeth Coli", "9nCpl-Ccyak", true),
  episode(2, 4, "Entrevista a Nahí Azul de Intensa Bravura", "S8KwoTk8Oho", true),

  // Temporada 3 · Columnas para HideAway Blues
  episode(3, 1, "Columna sobre Denise de Aguaturbia", "lSi1EkzjoV0", true),
  episode(3, 2, "Columna sobre Kelo y Coolcats", "cQEvU-aeu-k", true),
  episode(3, 3, "Columna sobre Morgan Voodoo Queen", "rv65I2nl62g", true),
  episode(3, 4, "Columna sobre La Rox", "gdf8s7-df2Y", true),
];

/** Seasons from the newest to the oldest. */
export const seasonsNewestFirst: Season[] = [...seasons].sort((a, b) => b.number - a.number);

export function getSeason(number: number): Season {
  const season = seasons.find((candidate) => candidate.number === number);
  if (!season) throw new Error(`Unknown season: ${number}`);
  return season;
}

export function episodesOfSeason(seasonNumber: number): Episode[] {
  return episodes.filter((candidate) => candidate.season === seasonNumber);
}

export function getEpisode(id: string): Episode | undefined {
  return episodes.find((candidate) => candidate.id === id);
}

/** The last episode of the newest season. */
export function latestEpisode(): Episode {
  const newest = seasonsNewestFirst[0];
  const list = episodesOfSeason(newest.number);
  return list[list.length - 1];
}

/** The episodes before and after this one inside its season. */
export function adjacentEpisodes(current: Episode): { previous?: Episode; next?: Episode } {
  const list = episodesOfSeason(current.season);
  const index = list.findIndex((candidate) => candidate.id === current.id);
  return { previous: list[index - 1], next: list[index + 1] };
}

/** "Capítulo 3" or "Columna 3", depending on the season. */
export function episodeLabel(season: Season, number: number): string {
  return `${season.kind === "column" ? "Columna" : "Capítulo"} ${number}`;
}

/** 16:9 area of a YouTube thumbnail. The image has black bars; `object-fit: cover` hides them. */
export function thumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * The picture of an episode: its flyer when it has one (square), otherwise the
 * thumbnail of its video (16:9).
 */
export function episodeImage(episode: Episode): { url: string; aspectRatio: string } {
  return episode.flyer
    ? { url: episode.flyer, aspectRatio: "1 / 1" }
    : { url: thumbnailUrl(episode.youtubeId), aspectRatio: "16 / 9" };
}

/**
 * Large (1280 × 720) thumbnail for the hero. YouTube only makes it for videos
 * uploaded in HD; if it does not exist the hero shows its plain surface instead.
 */
export function heroThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}

export function episodeHref(id: string): string {
  return `#/capitulo/${id}`;
}
