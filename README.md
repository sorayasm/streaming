# El Blues es Femenino

Streaming site for the podcast **El Blues es Femenino** (Mujeres del Blues): every season, every episode, and the playlists on each music service. It is built with React, TypeScript and Vite on top of the design system [`@sorayasm/vietri-ds`](https://www.npmjs.com/package/@sorayasm/vietri-ds), using its `streaming` theme. The interface is in Spanish.

## Getting started

Requires Node.js 20.19 or higher.

```bash
npm install
npm run dev
```

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the dev server                     |
| `npm run build`     | Type-check and build for production      |
| `npm run preview`   | Preview the production build             |
| `npm run typecheck` | Run TypeScript checks                    |
| `npm test`          | Run tests (includes axe accessibility)   |

## Pages

The site is a single-page app with hash routing, so it works on any static host without server configuration.

| Address                | Page                                        |
| ---------------------- | ------------------------------------------- |
| `#/`                   | Home: a shelf per season, newest first      |
| `#/capitulo/<id>`      | An episode: player, season list, prev/next  |
| `#/playlists`          | Playlists on each music service             |
| `#/sobre`              | About the podcast and its seasons           |

On every page change the tab title is updated and focus moves to the new page's heading, so screen readers announce it.

## Where things live

```
src/
├── content.ts          # every text of the interface (Spanish)
├── data/
│   ├── episodes.ts     # seasons and episodes (YouTube ids)
│   ├── playlists.ts    # playlists, covers and links
│   └── assetUrl.ts     # URLs of files in public/ (works under a sub-path)
├── pages/              # Home, Episode, Playlists, About, NotFound
├── router/             # hash router
└── App.tsx             # theme, skip link, header, footer
```

## Flyers

Each episode can have a square flyer, shown on its card and in the season list instead of the video thumbnail. Every episode has a flyer in `public/flyers/` (640 × 640 px, WebP, 18 to 55 KB each), named after the episode: `t1e05.webp` is season 1, episode 5. Season 1 uses the original Goodstock flyers; seasons 2 and 3 share one layout: the guest's photo in a square over a blurred copy of itself, with the name below.

To add a flyer to another episode:

1. Save it as `public/flyers/t<season>e<number>.webp`, for example `t3e02.webp`. Use a square image (1080 × 1080 px is the size of the originals) exported at about 640 × 640 px and under 70 KB.
2. In `src/data/episodes.ts`, add `true` as the last argument of that episode: `episode(3, 2, "Columna sobre Kelo y Coolcats", "cQEvU-aeu-k", true)`.

Episodes without a flyer keep their video thumbnail. The page title text is separate from the image, so screen readers and search engines read the episode title, not the flyer.

## The picture behind the home page

The big picture at the top of the home page is the thumbnail of the latest episode, darkened so the text stays readable. If YouTube has no large thumbnail for that video, the hero shows its plain purple surface instead.

To use your own picture (a concert photo, the podcast's key art), save it in `public/` and set it in `src/data/hero.ts`. Use a wide picture (16:9, around 1920 × 1080) **without text on it**, because the page's text goes over the left side, and keep it under about 200 KB. The picture is decorative: do not put information in it.

## Adding an episode

Add one line to the list in `src/data/episodes.ts`:

```ts
episode(2, 5, "Entrevista a …", "YOUTUBE_VIDEO_ID"),
```

The arguments are the season, the number inside the season, the title and the YouTube id (the 11 characters after `v=` in the video address). It appears on the home page, gets its own page and joins its season list automatically. A test checks that ids are unique and well formed.

To add a season, add it to `seasons` first (with `kind: "column"` if its entries are columns and not chapters).

## About the videos

The data comes from the original site, `elbluesesfemenino.cl`, where each video sits above its title. Every title is paired with the video that precedes it there. **Check a few episodes by playing them.** If a video does not match its title, fix its `youtubeId` in `src/data/episodes.ts`: nothing else depends on it.

## Playlists

The Playlists page shows one card per music playlist, with its cover (files in `public/playlists/`) and a button for Spotify, YouTube Music, Amazon Music and YouTube.

Until a playlist has its own link on a service, its button opens the Mujeres del Blues profile there (the links of `linktr.ee/mujeresdelblues`). Use plain addresses, without tracking parameters such as `?si=`, `?ref=` or `&drli=`; a test checks it, and it also checks that every playlist has a link on the four services. To link a playlist directly, add its address in `src/data/playlists.ts`:

```ts
{
  id: "grandes-mujeres",
  title: "Grandes Mujeres del Blues",
  // ...
  links: {
    Spotify: "https://open.spotify.com/playlist/…",
    "YouTube Music": "https://music.youtube.com/playlist?list=…",
    "Amazon Music": "https://music.amazon.com/playlists/…",
    YouTube: "https://www.youtube.com/playlist?list=…",
  },
},
```

Video playlists of the podcast itself (such as season 1) are in `podcastPlaylists`. To add another music card, add an entry to `musicPlaylists` with a cover in `public/playlists/`.

If you prefer a card with its own buttons, this is the format used by `podcastPlaylists`:

```ts
{
  id: "mujeres-del-blues",
  title: "Mujeres del Blues",
  description: "…",
  platforms: [
    { name: "Spotify", href: "https://open.spotify.com/playlist/…" },
    { name: "YouTube Music", href: "https://music.youtube.com/playlist?list=…" },
    { name: "Amazon Music", href: "https://music.amazon.com/playlists/…" },
  ],
},
```

## Privacy

The player loads nothing from YouTube until someone presses play, and it uses the privacy-enhanced domain `youtube-nocookie.com`. Episode thumbnails are public images served by YouTube (`i.ytimg.com`), so showing them does contact that domain.

## Testing

`npm test` needs `server.deps.inline: ["@sorayasm/vietri-ds"]` in `vite.config.ts` (already set). MUI 6 has no `exports` map, so Node cannot import its folders from an ES module package; inlining the design system lets Vite resolve them. Builds and the dev server are not affected.

## Deploying

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`, after the type check and the tests pass.

1. In the repository: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
2. Push to `main`. The address is `https://<user>.github.io/<repository>/`.

For a custom domain, set it in *Settings → Pages* and create the repository variable `PAGES_BASE` with the value `/` (*Settings → Secrets and variables → Actions → Variables*).
