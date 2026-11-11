import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Button,
  EpisodeList,
  Icon,
  VideoEmbed,
  VisuallyHidden,
  icons,
} from "@sorayasm/vietri-ds";
import { content } from "../content";
import {
  adjacentEpisodes,
  episodeHref,
  episodeLabel,
  episodesOfSeason,
  getEpisode,
  getSeason,
  thumbnailUrl,
} from "../data/episodes";
import { NotFoundPage } from "./NotFoundPage";

export function EpisodePage({ id }: { id: string }) {
  const episode = getEpisode(id);
  if (!episode) return <NotFoundPage />;

  const season = getSeason(episode.season);
  const { previous, next } = adjacentEpisodes(episode);
  const label = (number: number) => episodeLabel(season, number);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Button
        href="#/"
        variant="text"
        color="secondary"
        startIcon={<Icon icon={icons.ChevronLeft} />}
        sx={{ mb: 2 }}
      >
        {content.episode.back}
      </Button>

      <Box
        sx={{
          display: "grid",
          gap: 5,
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 2fr) minmax(0, 1fr)" },
          alignItems: "start",
        }}
      >
        <Box>
          {/* `key` resets the player (and its play button) when the episode changes. */}
          <VideoEmbed
            key={episode.id}
            videoId={episode.youtubeId}
            title={episode.title}
            poster={thumbnailUrl(episode.youtubeId)}
            playLabel={content.episode.play(episode.title)}
          />
          <Typography component="p" variant="overline" color="text.secondary" sx={{ mt: 3 }}>
            {content.episode.season(season.number)} · {label(episode.number)}
          </Typography>
          <Typography component="h1" variant="h3" sx={{ mb: 3 }}>
            {episode.title}
          </Typography>
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            {previous && (
              <Button
                variant="outlined"
                href={episodeHref(previous.id)}
                startIcon={<Icon icon={icons.ChevronLeft} />}
              >
                {content.episode.previous}
                <VisuallyHidden>{`: ${previous.title}`}</VisuallyHidden>
              </Button>
            )}
            {next && (
              <Button
                variant="outlined"
                href={episodeHref(next.id)}
                endIcon={<Icon icon={icons.ChevronRight} />}
              >
                {content.episode.next}
                <VisuallyHidden>{`: ${next.title}`}</VisuallyHidden>
              </Button>
            )}
          </Stack>
        </Box>

        <Box component="aside" aria-labelledby="more-from-season">
          <Typography id="more-from-season" component="h2" variant="h5" sx={{ mb: 1 }}>
            {content.episode.moreFromSeason}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {season.title} · {season.subtitle}
          </Typography>
          <EpisodeList
            level={3}
            ariaLabel={content.episode.playlistLabel(season.title)}
            currentId={episode.id}
            currentLabel={content.episode.nowPlaying}
            episodeLabel={label}
            episodes={episodesOfSeason(season.number).map((item) => ({
              id: item.id,
              number: item.number,
              title: item.title,
              imageUrl: thumbnailUrl(item.youtubeId),
              href: episodeHref(item.id),
            }))}
          />
        </Box>
      </Box>
    </Container>
  );
}
