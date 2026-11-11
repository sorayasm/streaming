import { Children, useId, useRef, type ReactNode } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Icon } from "../Icon";
import { ChevronLeft, ChevronRight } from "../Icon/icons";

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface ContentRailProps {
  /** Title of the row, for example "Season 1". It names the section. */
  title: string;
  /** The items of the row, usually MediaCards. */
  children: ReactNode;
  /** Heading level of the title. Default 2. */
  level?: HeadingLevel;
  /** Width of each item in pixels. Default 280. */
  itemWidth?: number;
  previousLabel?: string;
  nextLabel?: string;
  /** Extra element next to the arrows, for example a "See all" link. */
  action?: ReactNode;
}

/**
 * Horizontal row of items, like a season shelf. The row can be scrolled with
 * the arrows, with the mouse or touch, and with the keyboard: the scroll area
 * receives focus, and every interactive item inside it is reachable with Tab.
 */
export function ContentRail({
  title,
  children,
  level = 2,
  itemWidth = 280,
  previousLabel = "Scroll left",
  nextLabel = "Scroll right",
  action,
}: ContentRailProps) {
  const heading = `h${level}` as `h${HeadingLevel}`;
  const headingId = useId();
  const scroller = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  function scrollBy(direction: 1 | -1) {
    const element = scroller.current;
    if (!element) return;
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy?.({
      left: direction * element.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <Box component="section" aria-labelledby={headingId} sx={{ mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography id={headingId} component={heading} variant="h5">
          {title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {action}
          <IconButton aria-label={previousLabel} onClick={() => scrollBy(-1)}>
            <Icon icon={ChevronLeft} />
          </IconButton>
          <IconButton aria-label={nextLabel} onClick={() => scrollBy(1)}>
            <Icon icon={ChevronRight} />
          </IconButton>
        </Stack>
      </Stack>
      <Box
        ref={scroller}
        tabIndex={0}
        sx={(theme) => ({
          overflowX: "auto",
          // Room for the cards that grow on hover, which the scroll area would clip.
          pt: 1.5,
          pb: 2,
          scrollSnapType: "x proximity",
          // A thin scrollbar in the theme's text color, instead of the heavy one of
          // the system. Still visible (it uses the secondary text color), so people
          // who scroll with a mouse can see there is more to the right.
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.text.secondary} transparent`,
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.text.secondary,
            borderRadius: 4,
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        })}
      >
        <Box
          component="ul"
          role="list"
          sx={{ listStyle: "none", m: 0, p: 0, display: "flex", gap: 2 }}
        >
          {items.map((item, index) => (
            <Box
              component="li"
              key={index}
              sx={{ flex: `0 0 ${itemWidth}px`, scrollSnapAlign: "start" }}
            >
              {item}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
