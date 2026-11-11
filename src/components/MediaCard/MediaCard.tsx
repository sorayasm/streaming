import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Card, CardContent } from "../Card";
import { Icon } from "../Icon";
import { Play } from "../Icon/icons";
import { cardFocusRing, stretchedLink } from "../internal/stretched";

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface MediaCardProps {
  title: string;
  /** Line under the title, for example the guest or the band. */
  subtitle?: string;
  /** Small label above the title, for example "Season 1 · Episode 3". */
  meta?: string;
  /** Thumbnail (16:9). Without it a plain surface is shown. */
  imageUrl?: string;
  /** Length shown over the thumbnail, for example "42:10". */
  duration?: string;
  /** Short label over the thumbnail, for example "New". */
  badge?: string;
  /** Makes the whole card a link. */
  href?: string;
  /** Makes the whole card a button. */
  onClick?: () => void;
  /** Heading level of the title. Default 3. */
  level?: HeadingLevel;
  /** Shows a play icon over the thumbnail. Default true. */
  playIcon?: boolean;
}

/**
 * Card for a video or an episode: a 16:9 thumbnail with a title. When it has
 * `href` or `onClick` the whole card is operable with mouse and keyboard and
 * the title stays a heading. The thumbnail is decorative (empty alt): the
 * title already names the content.
 */
export function MediaCard({
  title,
  subtitle,
  meta,
  imageUrl,
  duration,
  badge,
  href,
  onClick,
  level = 3,
  playIcon = true,
}: MediaCardProps) {
  const heading = `h${level}` as `h${HeadingLevel}`;
  const interactive = Boolean(href || onClick);

  const titleNode = href ? (
    <Link href={href} underline="none" sx={stretchedLink}>
      {title}
    </Link>
  ) : onClick ? (
    <Link component="button" type="button" onClick={onClick} underline="none" sx={stretchedLink}>
      {title}
    </Link>
  ) : (
    title
  );

  return (
    <Card
      sx={(theme) => ({
        position: "relative",
        height: "100%",
        overflow: "hidden",
        transition: "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
        ...(interactive && {
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: theme.vietri.shadow.lg,
            borderColor: theme.palette.primary.main,
          },
          "&:hover .media-card-image": { transform: "scale(1.06)" },
        }),
        ...cardFocusRing(theme),
      })}
    >
      <Box
        sx={(theme) => ({
          position: "relative",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          bgcolor: theme.vietri.color.chip,
        })}
      >
        {imageUrl && (
          <Box
            component="img"
            className="media-card-image"
            src={imageUrl}
            alt=""
            loading="lazy"
            sx={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 400ms ease",
            }}
          />
        )}
        {playIcon && (
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "grid",
              placeItems: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "rgba(0, 0, 0, 0.8)",
              color: "#FFFFFF",
            }}
          >
            <Icon icon={Play} size={22} />
          </Box>
        )}
        {badge && (
          <Box
            sx={(theme) => ({
              position: "absolute",
              top: 8,
              left: 8,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: 600,
              bgcolor: theme.vietri.color.action[0],
              color: theme.vietri.color.onAction,
            })}
          >
            {badge}
          </Box>
        )}
        {duration && (
          <Box
            sx={{
              position: "absolute",
              right: 8,
              bottom: 8,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: 600,
              bgcolor: "rgba(0, 0, 0, 0.9)",
              color: "#FFFFFF",
            }}
          >
            {duration}
          </Box>
        )}
      </Box>
      <CardContent>
        {meta && (
          <Typography component="p" variant="overline" color="text.secondary">
            {meta}
          </Typography>
        )}
        <Typography component={heading} variant="h6">
          {titleNode}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
