import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { PlaylistCard, SectionHeader } from "@sorayasm/vietri-ds";
import { content } from "../content";
import { musicPlaylists, platformsFor, podcastPlaylists } from "../data/playlists";

const grid = {
  display: "grid",
  gap: 3,
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
  },
};

export function PlaylistsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader
        level={1}
        title={content.playlists.title}
        description={content.playlists.description}
      />

      <Typography component="h2" variant="h4" sx={{ mt: 6, mb: 3 }}>
        {content.playlists.musicTitle}
      </Typography>
      <Box sx={grid}>
        {musicPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            level={3}
            title={playlist.title}
            description={playlist.description}
            imageUrl={playlist.cover}
            platforms={platformsFor(playlist)}
            platformsLabel={content.playlists.listenOn}
            externalLabel={content.footer.external}
          />
        ))}
      </Box>

      <Typography component="h2" variant="h4" sx={{ mt: 8, mb: 3 }}>
        {content.playlists.podcastTitle}
      </Typography>
      <Box sx={grid}>
        {podcastPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            level={3}
            title={playlist.title}
            description={playlist.description}
            platforms={playlist.platforms}
            platformsLabel={content.playlists.listenOn}
            externalLabel={content.footer.external}
          />
        ))}
      </Box>
    </Container>
  );
}
