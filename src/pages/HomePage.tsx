import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button, ContentRail, Hero, Icon, MediaCard, icons } from "@sorayasm/vietri-ds";
import { content } from "../content";
import {
  episodeHref,
  episodeImage,
  episodeLabel,
  episodesOfSeason,
  latestEpisode,
  seasonsNewestFirst,
} from "../data/episodes";
import { heroImage } from "../data/hero";
import { getLastEpisode } from "../data/progress";

export function HomePage() {
  // If the person already opened an episode, the main button takes them back to it.
  const last = getLastEpisode();
  const featured = last ?? latestEpisode();
  const featuredLabel = last ? content.hero.continueLabel : content.hero.latestLabel;

  return (
    <>
      <Hero
        accentRule
        image={heroImage()}
        imagePosition="80% 20%"
        eyebrow={content.hero.eyebrow}
        title={content.siteName}
        description={
          <>
            {content.hero.description}
            {/* Says what the main button opens, so nobody has to guess. */}
            <Typography
              component="span"
              sx={{ display: "block", mt: 2, fontWeight: 600, color: "text.primary" }}
            >
              {featuredLabel}: {featured.title}
            </Typography>
          </>
        }
        actions={
          <>
            <Button
              size="large"
              variant="contained"
              href={episodeHref(featured.id)}
              startIcon={<Icon icon={icons.Play} size={20} />}
            >
              {last ? content.hero.continue : content.hero.latest}
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
            {episodesOfSeason(season.number).map((episode) => {
              const image = episodeImage(episode);
              return (
                <MediaCard
                  key={episode.id}
                  title={episode.title}
                  meta={episodeLabel(season, episode.number)}
                  imageUrl={image.url}
                  aspectRatio={image.aspectRatio}
                  href={episodeHref(episode.id)}
                />
              );
            })}
          </ContentRail>
        ))}
      </Container>
    </>
  );
}
