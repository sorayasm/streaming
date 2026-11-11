import Container from "@mui/material/Container";
import { Button, ContentRail, Hero, MediaCard } from "@sorayasm/vietri-ds";
import { content } from "../content";
import {
  episodeHref,
  episodeLabel,
  episodesOfSeason,
  latestEpisode,
  seasonsNewestFirst,
  thumbnailUrl,
} from "../data/episodes";

export function HomePage() {
  const latest = latestEpisode();

  return (
    <>
      <Hero
        eyebrow={content.hero.eyebrow}
        title={content.siteName}
        description={content.hero.description}
        actions={
          <>
            <Button size="large" href={episodeHref(latest.id)}>
              {content.hero.latest}
            </Button>
            <Button size="large" variant="outlined" href="#/playlists">
              {content.hero.listen}
            </Button>
          </>
        }
      />
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        {seasonsNewestFirst.map((season) => (
          <ContentRail
            key={season.number}
            title={`${season.title} · ${season.subtitle}`}
            previousLabel={content.rail.previous}
            nextLabel={content.rail.next}
          >
            {episodesOfSeason(season.number).map((episode) => (
              <MediaCard
                key={episode.id}
                title={episode.title}
                meta={episodeLabel(season, episode.number)}
                imageUrl={thumbnailUrl(episode.youtubeId)}
                href={episodeHref(episode.id)}
              />
            ))}
          </ContentRail>
        ))}
      </Container>
    </>
  );
}
