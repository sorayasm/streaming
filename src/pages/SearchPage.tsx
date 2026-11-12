import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { Search } from "lucide-react";
import { Icon, Input, MediaCard, SectionHeader } from "@sorayasm/vietri-ds";
import { content } from "../content";
import { episodeHref, episodeImage, episodeLabel, getSeason } from "../data/episodes";
import { searchEpisodes } from "../data/search";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchEpisodes(query), [query]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader
        level={1}
        title={content.search.title}
        description={content.search.description}
      />

      <Box sx={{ mt: 4, maxWidth: 640 }}>
        <Input
          label={content.search.label}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fullWidth
          autoComplete="off"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon={Search} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* The count is announced as you type: screen reader users know what the search found. */}
      <Typography role="status" aria-live="polite" variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
        {results.length === 0
          ? content.search.empty(query.trim())
          : content.search.count(results.length)}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        {results.map((episode) => {
          const season = getSeason(episode.season);
          const image = episodeImage(episode);
          return (
            <MediaCard
              key={episode.id}
              title={episode.title}
              meta={`${season.title} · ${episodeLabel(season, episode.number)}`}
              imageUrl={image.url}
              aspectRatio={image.aspectRatio}
              href={episodeHref(episode.id)}
            />
          );
        })}
      </Box>
    </Container>
  );
}
