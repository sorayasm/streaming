import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, SectionHeader } from "@sorayasm/vietri-ds";
import { content } from "../content";
import { seasonsNewestFirst } from "../data/episodes";

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
            <Button size="small" variant="outlined" href="#/">
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
