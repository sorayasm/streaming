// Runs after `vite build`. The app draws everything with JavaScript, so a
// search engine or an AI that reads only the HTML used to see an empty page.
// This script writes, for every page, an HTML file that already contains its
// text, links and structured data (schema.org), plus sitemap.xml and llms.txt.
// When the app starts, React replaces that text with the real interface.
//
//   node scripts/prerender.mjs        (BASE_PATH and SITE_URL are optional)

import { register } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

register("./ts-hooks.mjs", import.meta.url);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const src = (file) => pathToFileURL(join(root, "src", file)).href;

const { content } = await import(src("content.ts"));
const { seasons, episodes, episodesOfSeason, getSeason, episodeLabel, adjacentEpisodes } =
  await import(src("data/episodes.ts"));
const { links, musicPlaylists, podcastPlaylists, platformsFor } = await import(
  src("data/playlists.ts")
);

/** Public address of the site, without the final slash. */
const SITE_URL = (process.env.SITE_URL || "https://elbluesesfemenino.cl").replace(/\/+$/, "");
/** Folder the files are served from: "/" or "/repository/". */
const BASE = process.env.BASE_PATH || "/";
const site = content.siteName;
const host = content.host;
const siteDescription =
  "Podcast sobre las mujeres del blues en Chile, desde una mirada crítica y feminista. " +
  `Conducido por ${host.name}. Una iniciativa de Mujeres del Blues.`;

// ---------------------------------------------------------------- helpers

const escape = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** Link inside the site, as served (with the base folder). */
const href = (path) => `${BASE}${path}`;
/** Full public address of a page, for canonical links, the sitemap and llms.txt. */
const url = (path) => `${SITE_URL}/${path}`;
/** Full address of a file in public/ (flyers, covers), whatever assetUrl returned. */
const fileUrl = (path) => `${SITE_URL}/${path.slice(BASE.length).replace(/^\/+/, "")}`;

const youtube = (id) => `https://www.youtube.com/watch?v=${id}`;
const episodePath = (episode) => `capitulo/${episode.id}/`;
const fullTitle = (episode) => {
  const season = getSeason(episode.season);
  return `${episodeLabel(season, episode.number)} · ${season.title}: ${episode.title}`;
};
const episodeDescription = (episode) => {
  const season = getSeason(episode.season);
  return (
    `${episode.title}. ${episodeLabel(season, episode.number)} de la ${season.title.toLowerCase()} ` +
    `(${season.subtitle}) de ${site}, podcast sobre las mujeres del blues en Chile ` +
    `conducido por ${host.name}.`
  );
};

const hostPerson = { "@type": "Person", name: host.name, jobTitle: host.role, sameAs: [host.instagram] };
const organization = {
  "@type": "Organization",
  name: "Mujeres del Blues",
  url: links.motherSite,
  sameAs: [links.youtube, links.instagram],
};
const series = {
  "@type": "PodcastSeries",
  "@id": `${SITE_URL}/#podcast`,
  name: site,
  url: `${SITE_URL}/`,
  description: siteDescription,
  inLanguage: "es-CL",
  image: `${SITE_URL}/og.jpg`,
  genre: ["Blues", "Música", "Feminismo"],
  author: hostPerson,
  actor: hostPerson,
  publisher: organization,
  sameAs: [links.youtube, links.instagram, links.motherSite],
};

// ---------------------------------------------------------------- page body

const nav = `
<nav aria-label="${escape(content.nav.ariaLabel)}"><ul>
  <li><a href="${href("")}">${escape(content.nav.home)}</a></li>
  <li><a href="${href("buscar/")}">${escape(content.nav.search)}</a></li>
  <li><a href="${href("playlists/")}">${escape(content.nav.playlists)}</a></li>
  <li><a href="${href("sobre/")}">${escape(content.nav.about)}</a></li>
</ul></nav>`;

const footer = `
<footer>
  <p>${escape(content.footer.description)}</p>
  <ul>
    <li><a href="${links.motherSite}">${escape(content.footer.links.motherSite)}</a></li>
    <li><a href="${links.youtube}">${escape(content.footer.links.youtube)}</a></li>
    <li><a href="${links.instagram}">${escape(content.footer.links.instagram)}</a></li>
  </ul>
</footer>`;

const moreInfo = content.about.moreInfo;
const moreInfoHtml = `<p>${escape(moreInfo.before)}<a href="${host.instagram}">${escape(moreInfo.host)}</a>${escape(moreInfo.middle)}<a href="${links.instagram}">${escape(moreInfo.instagram)}</a>${escape(moreInfo.and)}<a href="${links.youtube}">${escape(moreInfo.youtube)}</a>${escape(moreInfo.after)}</p>`;
const hostBlock = `<p><strong>${escape(host.role)}:</strong> ${escape(host.name)}.</p>`;

function episodeList(list) {
  return `<ol>${list
    .map(
      (episode) =>
        `<li value="${episode.number}"><a href="${href(episodePath(episode))}">${escape(episode.title)}</a></li>`
    )
    .join("")}</ol>`;
}

/** Link to the YouTube playlist of a season, when there is one. */
function seasonPlaylist(season) {
  const playlist = podcastPlaylists.find((item) => item.id === `temporada-${season.number}-youtube`);
  const youtubeLink = playlist?.platforms.find((platform) => platform.name === "YouTube");
  return youtubeLink
    ? `<p><a href="${escape(youtubeLink.href)}">Ver la ${escape(season.title.toLowerCase())} completa en YouTube</a></p>`
    : "";
}

function seasonsBlock(level = 2) {
  return seasons
    .map(
      (season) => `
<section>
  <h${level}>${escape(season.title)} · ${escape(season.subtitle)}</h${level}>
  <p>${escape(season.description)}</p>
  ${seasonPlaylist(season)}
  ${episodeList(episodesOfSeason(season.number))}
</section>`
    )
    .join("");
}

function homeBody() {
  return `
<header>
  <p>${escape(content.hero.eyebrow)}</p>
  <h1>${escape(site)}</h1>
  <p>${escape(content.hero.description)}</p>
  ${hostBlock}
  <p>${escape(content.about.disambiguation)}</p>
</header>
<h2>Capítulos</h2>
${seasonsBlock(3)}
<h2>${escape(content.about.whyTitle)}</h2>
<p>${escape(content.about.why)}</p>
<p><a href="${href("sobre/")}">${escape(content.nav.about)}</a> · <a href="${href("playlists/")}">${escape(content.nav.playlists)}</a></p>`;
}

function episodeBody(episode) {
  const season = getSeason(episode.season);
  const { previous, next } = adjacentEpisodes(episode);
  return `
<article>
  <p>${escape(season.title)} · ${escape(season.subtitle)} · ${escape(episodeLabel(season, episode.number))}</p>
  <h1>${escape(episode.title)}</h1>
  <p>${escape(episodeDescription(episode))}</p>
  ${hostBlock}
  ${episode.flyer ? `<img src="${escape(episode.flyer)}" alt="" width="320" height="320" />` : ""}
  <p><a href="${youtube(episode.youtubeId)}">Ver “${escape(episode.title)}” en YouTube</a></p>
  <p>${escape(season.description)}</p>
  <nav aria-label="Capítulos">
    ${previous ? `<a href="${href(episodePath(previous))}" rel="prev">${escape(content.episode.previous)}: ${escape(previous.title)}</a>` : ""}
    ${next ? `<a href="${href(episodePath(next))}" rel="next">${escape(content.episode.next)}: ${escape(next.title)}</a>` : ""}
  </nav>
  <h2>${escape(content.episode.moreFromSeason)}</h2>
  ${episodeList(episodesOfSeason(season.number))}
</article>`;
}

function aboutBody() {
  return `
<h1>${escape(content.about.title)}</h1>
<p>${escape(content.about.intro)}</p>
<p>${escape(content.about.border)}</p>
<h2>${escape(content.about.hostTitle)}</h2>
<p>${escape(content.about.host)}</p>
${moreInfoHtml}
<p>${escape(content.about.disambiguation)}</p>
<h2>${escape(content.about.whyTitle)}</h2>
<p>${escape(content.about.why)}</p>
<h2>${escape(content.about.seasonsTitle)}</h2>
${seasonsBlock(3)}
<p>${escape(content.about.credits)}</p>`;
}

function playlistsBody() {
  const music = musicPlaylists
    .map(
      (playlist) => `
<li>
  <h3>${escape(playlist.title)}</h3>
  <p>${escape(playlist.description)}</p>
  <p>${platformsFor(playlist)
    .map((platform) => `<a href="${escape(platform.href)}">${escape(content.playlists.listenOn)} ${escape(platform.name)}</a>`)
    .join(" · ")}</p>
</li>`
    )
    .join("");
  const podcast = podcastPlaylists
    .map(
      (playlist) => `
<li>
  <h3>${escape(playlist.title)}</h3>
  <p>${escape(playlist.description)}</p>
  <p>${playlist.platforms
    .map((platform) => `<a href="${escape(platform.href)}">${escape(content.playlists.listenOn)} ${escape(platform.name)}</a>`)
    .join(" · ")}</p>
</li>`
    )
    .join("");
  return `
<h1>${escape(content.playlists.title)}</h1>
<p>${escape(content.playlists.description)}</p>
<h2>${escape(content.playlists.musicTitle)}</h2>
<ul>${music}</ul>
${podcast ? `<h2>${escape(content.playlists.podcastTitle)}</h2><ul>${podcast}</ul>` : ""}`;
}

// ---------------------------------------------------------------- the HTML file

const template = await readFile(join(dist, "index.html"), "utf8");
if (template.includes('class="static-page"')) {
  throw new Error("dist/index.html ya fue procesado. Corre `npm run build` (vite build) antes de este script.");
}

// Readable before the app starts and for readers without JavaScript. React
// replaces it, so it only needs to be plain and legible on the dark page.
const style = `<style>
  .static-page{max-width:760px;margin:0 auto;padding:24px;font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#f4eefc;background:#20123A}
  .static-page a{color:#ffb380}
  .static-page nav ul,.static-page footer ul{list-style:none;padding:0;display:flex;gap:16px;flex-wrap:wrap}
  .static-page img{max-width:100%;height:auto}
</style>`;

function setMeta(html, attribute, key, value) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*(")`, "s");
  if (pattern.test(html)) return html.replace(pattern, `$1${escape(value)}$2`);
  return html.replace("</head>", `    <meta ${attribute}="${key}" content="${escape(value)}" />\n  </head>`);
}

function page({ path, title, description, body, data, image, type = "website", noindex = false }) {
  const canonical = url(path);
  let html = template;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/s,
    `<meta name="description" content="${escape(description)}" />`
  );
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`);
  html = setMeta(html, "property", "og:type", type);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "property", "og:url", canonical);
  if (image) {
    html = setMeta(html, "property", "og:image", image);
    html = setMeta(html, "name", "twitter:image", image);
    // The flyers are square: the size of og.jpg no longer applies.
    html = html.replace(/\s*<meta property="og:image:(width|height)" content="\d+" \/>/g, "");
  }
  html = setMeta(html, "name", "author", host.name);
  if (noindex) html = setMeta(html, "name", "robots", "noindex");
  const jsonLd = JSON.stringify({ "@context": "https://schema.org", ...data }).replaceAll("<", "\\u003c");
  html = html.replace(
    "</head>",
    `    <link rel="alternate" type="text/plain" href="${href("llms.txt")}" title="Resumen para IA" />
    <script type="application/ld+json">${jsonLd}</script>
    ${style}
  </head>`
  );
  html = html.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root"><div class="static-page">${nav}<main>${body}</main>${footer}</div></div>`
  );
  return html;
}

async function write(path, html) {
  const file = join(dist, path, path.endsWith(".html") ? "" : "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

// ---------------------------------------------------------------- pages

const pages = [];

pages.push({
  path: "",
  title: `${site} · Podcast sobre las mujeres del blues en Chile`,
  description: siteDescription,
  body: homeBody(),
  data: {
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: site, url: `${SITE_URL}/`, inLanguage: "es-CL", publisher: organization },
      {
        ...series,
        hasPart: episodes.map((episode) => ({
          "@type": "PodcastEpisode",
          name: episode.title,
          url: url(episodePath(episode)),
        })),
      },
    ],
  },
});

for (const episode of episodes) {
  const season = getSeason(episode.season);
  const image = episode.flyer ? fileUrl(episode.flyer) : `https://i.ytimg.com/vi/${episode.youtubeId}/hqdefault.jpg`;
  pages.push({
    path: episodePath(episode),
    title: `${episode.title} · ${site}`,
    description: episodeDescription(episode),
    body: episodeBody(episode),
    image,
    type: "video.episode",
    data: {
      "@type": "PodcastEpisode",
      "@id": url(episodePath(episode)),
      name: episode.title,
      alternateName: fullTitle(episode),
      url: url(episodePath(episode)),
      description: episodeDescription(episode),
      episodeNumber: episode.number,
      inLanguage: "es-CL",
      image,
      author: hostPerson,
      actor: hostPerson,
      partOfSeason: {
        "@type": "PodcastSeason",
        seasonNumber: season.number,
        name: `${season.title} · ${season.subtitle}`,
      },
      partOfSeries: { "@type": "PodcastSeries", "@id": `${SITE_URL}/#podcast`, name: site, url: `${SITE_URL}/` },
      associatedMedia: {
        "@type": "VideoObject",
        name: episode.title,
        description: episodeDescription(episode),
        thumbnailUrl: `https://i.ytimg.com/vi/${episode.youtubeId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${episode.youtubeId}`,
        url: youtube(episode.youtubeId),
      },
    },
  });
}

pages.push({
  path: "sobre/",
  title: `${content.about.title} · ${site}`,
  description: `${content.about.intro.split(". ")[0]}. Conducido por ${host.name}.`,
  body: aboutBody(),
  data: {
    "@type": "AboutPage",
    name: content.about.title,
    url: url("sobre/"),
    about: series,
  },
});

pages.push({
  path: "playlists/",
  title: `${content.playlists.title} · ${site}`,
  description: content.playlists.description,
  body: playlistsBody(),
  data: {
    "@type": "CollectionPage",
    name: content.playlists.title,
    url: url("playlists/"),
    hasPart: musicPlaylists.map((playlist) => ({
      "@type": "MusicPlaylist",
      name: playlist.title,
      description: playlist.description,
      url: playlist.links.Spotify ?? platformsFor(playlist)[0].href,
    })),
  },
});

for (const item of pages) await write(item.path, page(item));

// The search page works only with JavaScript; without it, it lists every episode.
// It repeats the home page, so search engines are asked not to index it.
await write(
  "buscar/",
  page({
    path: "buscar/",
    title: `${content.search.title} · ${site}`,
    description: content.search.description,
    body: `<h1>${escape(content.search.title)}</h1><p>${escape(content.search.description)}</p>${seasonsBlock(2)}`,
    data: { "@type": "WebPage", name: content.search.title, url: url("buscar/") },
    noindex: true,
  })
);

// GitHub Pages answers unknown addresses with 404.html (and a 404 status).
await write(
  "404.html",
  page({
    path: "",
    title: `${content.notFound.title} · ${site}`,
    description: content.notFound.description,
    body: `<h1>${escape(content.notFound.title)}</h1><p>${escape(content.notFound.description)}</p><p><a href="${href("")}">${escape(content.notFound.back)}</a></p>`,
    data: { "@type": "WebPage", name: content.notFound.title },
    noindex: true,
  })
);

// ---------------------------------------------------------------- sitemap.xml

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((item) => `  <url><loc>${url(item.path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
await writeFile(join(dist, "sitemap.xml"), sitemap);

// ---------------------------------------------------------------- llms.txt
// A plain summary for AI assistants (https://llmstxt.org).

const llms = `# ${site}

> ${siteDescription}

- Conductora: ${host.name} (Instagram: ${host.instagram})
- Iniciativa de: Mujeres del Blues (${links.motherSite})
- YouTube de Mujeres del Blues: ${links.youtube}
- Instagram de Mujeres del Blues: ${links.instagram}
- Idioma: español (Chile)

Importante: ${content.about.disambiguation}

## Sobre el podcast

${content.about.intro}

${content.about.border}

${content.about.why}

${seasons
  .map(
    (season) => `## ${season.title} · ${season.subtitle}

${season.description}

${episodesOfSeason(season.number)
  .map(
    (episode) =>
      `- [${episodeLabel(season, episode.number)}: ${episode.title}](${url(episodePath(episode))}) · video: ${youtube(episode.youtubeId)}`
  )
  .join("\n")}`
  )
  .join("\n\n")}

## Otras páginas

- [${content.about.title}](${url("sobre/")})
- [${content.playlists.title}](${url("playlists/")})
`;
await writeFile(join(dist, "llms.txt"), llms);

console.log(`prerender: ${pages.length} páginas, sitemap.xml y llms.txt en dist/`);
