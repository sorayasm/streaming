# Changelog

All notable changes to Vietri DS are listed here. The project follows
[Semantic Versioning](https://semver.org/); while the version is 0.x, a minor
version may include breaking changes.

## 0.3.0

### Added

- `Hero` accepts an `image` and an `imagePosition`: a decorative background
  picture under a dark layer. The text keeps AA contrast over any photo.
- `ThemeColors.scrim`: the dark layer color of each theme.

### Changed

- `MediaCard` grows slightly on hover and its image zooms, like a streaming
  catalogue.
- `ContentRail` leaves room above and below its cards so the growing cards are
  not clipped.

## 0.2.4

### Changed

- Streaming theme: the primary action is now cyan (`#1CDAF3`, was orange), and
  the surface of footers and banners is a soft gradient from violet to lavender
  (`#693BCC` to `#7A64AE`). `#7A64AE` is the supplied `#816CB2` darkened a hair,
  so white text keeps a 4.5:1 contrast at that end. Soft text on surfaces is
  now `#F7F3FF`.
- The Streaming palette lists `lavender` and `cyan` instead of `orange`.

## 0.2.3

### Changed

- `ContentRail` uses a thin scrollbar in the theme's secondary text color
  instead of the heavy scrollbar of the system, which clashed with the design.

## 0.2.2

### Documentation

- README explains how to test an app that uses the library with Vitest
  (`server.deps.inline`), because MUI 6 has no `exports` map.

## 0.2.1

### Fixed

- `NavBar` content is now limited to the large width (1200 px) by default, so
  the header lines up with the page content instead of spanning the whole
  screen. A new `maxWidth` prop (`"lg"` by default, `false` for full width)
  controls it.

## 0.2.0

### Added

- Shared components: `Icon`, `Chip`, `CategoryChip`, `Footer`, `SectionHeader`,
  `Select`, `Dialog`, `Drawer`, `CopyField`, `SkipLink`, `VisuallyHidden`.
- Observatory components: `Hero`, `FeatureCard`, `Steps`, `Timeline`,
  `ProfileCard`.
- Streaming components: `MediaCard`, `ContentRail`, `VideoEmbed`,
  `EpisodeList`, `PlaylistCard`.
- A palette per theme (`editorialColors`, `streamingColors`,
  `observatoryColors`), typed as `ThemeColors` and available as
  `theme.vietri.color`.
- `createVietriTheme(colors)` to build a theme from a palette.
- Two category palettes: the default soft tints and
  `observatoryCategoryPalette`.
- Automated accessibility checks (axe-core) for every component, contrast
  tests for every theme, and an Accessibility panel in Storybook.

### Changed

- Themes are flat: no theme uses gradients or decorative lights.
- Default text colors for success, warning, info and error meet WCAG AA in
  every theme.
- Default chips are opaque, so they stay legible on any surface.
- `@mui/material` peer dependency is limited to 6.x until 7.x is verified.
- The package is now published as `@sorayasm/vietri-ds` under the MIT license.

### Breaking

- The global color exports `brand`, `derived` and `gradientStops` were removed.
  Each theme now has its own palette in `palettes.ts`.

## 0.1.0

- Tokens, three themes, and the first components: `Button`, `Typography`,
  `Card`, `Input`, `NavBar`, `LanguageSwitch`, `Tabs`, `StatCard`, `DataTable`
  and `BarChart`.
