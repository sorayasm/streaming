import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeroProps {
  title: string;
  /** Small label above the title. */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Buttons or links under the text. */
  actions?: ReactNode;
  /** Heading level of the title (h1–h6). A page's hero is normally h1. */
  level?: HeadingLevel;
  align?: "left" | "center";
  /**
   * Address of a background image. It is decorative (it carries no text
   * alternative), so do not put information in it. A dark layer (the theme's
   * `scrim`) sits over it and the text stays in the area it covers best, so the
   * text keeps AA contrast whatever the photo. If the image fails to load, the
   * theme surface shows instead.
   */
  image?: string;
  /** CSS `background-position` of the image, for example "center 30%". Default "center". */
  imagePosition?: string;
}

/**
 * Banner for the top of a page. It uses the theme surface color with light
 * text on top, or a background image under a dark layer. Outlined and text
 * buttons inside it take the text color of the surface, so they stay visible.
 */
export function Hero({
  title,
  eyebrow,
  description,
  actions,
  level = 1,
  align = "left",
  image,
  imagePosition = "center",
}: HeroProps) {
  const heading = `h${level}` as `h${HeadingLevel}`;
  const center = align === "center";
  const hasImage = Boolean(image);

  return (
    <Box
      component="section"
      sx={(theme) => {
        const scrim = theme.vietri.color.scrim;
        const surface = theme.vietri.gradient.surface;
        // The bottom of the image melts into the dark layer color.
        const fade = `linear-gradient(0deg, ${scrim} 0%, ${alpha(scrim, 0)} 28%)`;
        const photo = `url(${JSON.stringify(image ?? "")})`;

        return {
          display: "flex",
          alignItems: "center",
          py: { xs: 6, md: 10 },
          ...(hasImage && { minHeight: { xs: 440, md: 600 } }),
          color: theme.vietri.color.onSurface,
          ...(hasImage
            ? {
                // Layers, from top to bottom: dark layer, bottom fade, photo, surface.
                backgroundImage: {
                  xs: `linear-gradient(${alpha(scrim, 0.88)}, ${alpha(scrim, 0.88)}), ${fade}, ${photo}, ${surface}`,
                  md: `linear-gradient(90deg, ${alpha(scrim, 0.92)} 0%, ${alpha(scrim, 0.86)} 62%, ${alpha(scrim, 0.25)} 100%), ${fade}, ${photo}, ${surface}`,
                },
                backgroundSize: "cover",
                backgroundPosition: imagePosition,
                backgroundRepeat: "no-repeat",
              }
            : { background: surface }),
          // Focus ring and secondary buttons that stay visible on a dark surface.
          "& a:focus-visible, & button:focus-visible": {
            outline: "2px solid",
            outlineColor: theme.vietri.color.onSurface,
            outlineOffset: 3,
          },
          "& .MuiButton-outlined, & .MuiButton-text": {
            color: "inherit",
            borderColor: "currentColor",
          },
        };
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Stack
          spacing={2}
          sx={{
            alignItems: center ? "center" : "flex-start",
            textAlign: align,
            // With an image the text stays in the left 60%, where the dark layer is strongest.
            ...(hasImage && { maxWidth: { md: "60%" }, ...(center && { mx: "auto" }) }),
          }}
        >
          {eyebrow && (
            <Typography
              component="p"
              variant="overline"
              sx={(theme) => ({ color: theme.vietri.color.onSurfaceSoft })}
            >
              {eyebrow}
            </Typography>
          )}
          <Typography component={heading} variant="h2" sx={{ maxWidth: 900 }}>
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body1"
              sx={(theme) => ({
                maxWidth: 680,
                color: theme.vietri.color.onSurfaceSoft,
              })}
            >
              {description}
            </Typography>
          )}
          {actions && (
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              flexWrap="wrap"
              sx={{ pt: 2, justifyContent: center ? "center" : "flex-start" }}
            >
              {actions}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
