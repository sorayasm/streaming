import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, SectionHeader } from "@sorayasm/vietri-ds";
import { content } from "../content";
import { paths } from "../router/useRoute";
import { seasonsNewestFirst } from "../data/episodes";
import { links } from "../data/playlists";

export function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader level={1} title={content.about.title} />
      <Stack spacing={3} sx={{ mt: 4 }}>
        <Typography variant="body1">{content.about.intro}</Typography>
        <Typography variant="body1">{content.about.border}</Typography>
      </Stack>

      <Typography component="h2" variant="h4" sx={{ mt: 8, mb: 2 }}>
        {content.about.whyTitle}
      </Typography>
      <Typography variant="body1">{content.about.why}</Typography>

      <Typography component="h2" variant="h4" sx={{ mt: 8, mb: 2 }}>
        {content.about.hostTitle}
      </Typography>
      <Typography variant="body1">{content.about.host}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {content.about.moreInfo.before}
        <Link href={content.host.instagram} target="_blank" rel="noopener noreferrer">
          {content.about.moreInfo.host}
        </Link>
        {content.about.moreInfo.middle}
        <Link href={links.instagram} target="_blank" rel="noopener noreferrer">
          {content.about.moreInfo.instagram}
        </Link>
        {content.about.moreInfo.and}
        <Link href={links.youtube} target="_blank" rel="noopener noreferrer">
          {content.about.moreInfo.youtube}
        </Link>
        {content.about.moreInfo.after}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {content.about.disambiguation}
      </Typography>

      <Typography component="h2" variant="h4" sx={{ mt: 8, mb: 3 }}>
        {content.about.seasonsTitle}
      </Typography>
      <Stack component="ul" role="list" spacing={4} sx={{ listStyle: "none", m: 0, p: 0 }}>
        {seasonsNewestFirst.map((season) => (
          <Box component="li" key={season.number}>
            <Typography component="h3" variant="h6">
              {season.title} · {season.subtitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
              {season.description}
            </Typography>
            <Button size="small" variant="outlined" href={paths.home()}>
              {content.about.seeEpisodes}
            </Button>
          </Box>
        ))}
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 8 }}>
        {content.about.credits}
      </Typography>
    </Container>
  );
}
