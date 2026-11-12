import {
  episodeLabel,
  episodesOfSeason,
  getSeason,
  seasonsNewestFirst,
  type Episode,
} from "./episodes";

/** Lowercase and without accents, so "Nahi" finds "Nahí". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Every episode, from the newest season to the oldest. */
export function allEpisodesNewestFirst(): Episode[] {
  return seasonsNewestFirst.flatMap((season) => episodesOfSeason(season.number));
}

/**
 * Episodes that match every word of the query, in the title, the season or its
 * subtitle, or the label ("Columna 2"). An empty query returns every episode.
 */
export function searchEpisodes(query: string): Episode[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const all = allEpisodesNewestFirst();
  if (terms.length === 0) return all;

  return all.filter((episode) => {
    const season = getSeason(episode.season);
    const text = normalize(
      `${episode.title} ${season.title} ${season.subtitle} ${episodeLabel(season, episode.number)}`
    );
    return terms.every((term) => text.includes(term));
  });
}
