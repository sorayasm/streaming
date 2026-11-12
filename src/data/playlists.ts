import { assetUrl } from "./assetUrl";

export const links = {
  motherSite: "https://www.mujeresdelblues.com",
  youtube: "https://www.youtube.com/@mujeresdelblues",
  instagram: "https://www.instagram.com/mujeresdelblues/",
} as const;

export type PlatformName = "Spotify" | "YouTube Music" | "Amazon Music" | "YouTube";

/** The order in which the music services are shown on every card. */
export const platformOrder: PlatformName[] = [
  "Spotify",
  "YouTube Music",
  "Amazon Music",
  "YouTube",
];

/**
 * The Mujeres del Blues profile on each service (from linktr.ee/mujeresdelblues).
 * A playlist uses it for any service where it has no link of its own yet.
 */
export const profiles: Record<PlatformName, string> = {
  Spotify: "https://open.spotify.com/user/31tcsu56vsccjmuafhqnlyt7kcvm",
  "YouTube Music": "https://music.youtube.com/@mujeresdelblues",
  "Amazon Music": "https://music.amazon.it/profiles/2ufzaw5jrwz4mrkzjn4tl7xhlu",
  YouTube: "https://www.youtube.com/@mujeresdelblues/playlists",
};

export interface MusicPlaylist {
  id: string;
  title: string;
  description: string;
  /** Square cover, a file inside `public/playlists/`. Without it the card shows a plain placeholder. */
  cover?: string;
  /**
   * Address of this playlist on each service. A missing one falls back to the
   * profile above. Use the plain address, without tracking parameters
   * (`si=`, `ref=`, `drli=`).
   */
  links: Partial<Record<PlatformName, string>>;
}

export const musicPlaylists: MusicPlaylist[] = [
  {
    id: "grandes-mujeres",
    title: "Grandes Mujeres del Blues",
    description: "Artistas del blues clásico femenino y del blues eléctrico.",
    cover: assetUrl("playlists/grandes-mujeres.webp"),
    links: {
      Spotify: "https://open.spotify.com/playlist/1Lcj0JONrP0FzmiLZpTnEH",
      "YouTube Music": "https://music.youtube.com/playlist?list=PLFXPkUuUM9hE",
      YouTube: "https://www.youtube.com/playlist?list=PLFXPkUuUM9hE",
      "Amazon Music":
        "https://music.amazon.com/user-playlists/56936aeb2f784a17a8703736c9e9703citit",
    },
  },
  {
    id: "clasico-femenino",
    title: "Blues Clásico Femenino",
    description: "El blues clásico femenino, desarrollado entre 1920 y 1929 en Estados Unidos.",
    cover: assetUrl("playlists/clasico-femenino.webp"),
    links: {
      Spotify: "https://open.spotify.com/playlist/2LSFMVQlfvPDTyrffmmCNE",
      "YouTube Music":
        "https://music.youtube.com/playlist?list=PLajddc99FTAsc_4F5HWMtltv0KDlbTO-t",
      "Amazon Music": "https://music.amazon.com/user-playlists/3aa03f84-f105-4e7e-bfe5-c6816762bb7e",
      YouTube: "https://www.youtube.com/playlist?list=PLajddc99FTAsc_4F5HWMtltv0KDlbTO-t",
    },
  },
  {
    id: "en-chile",
    title: "Mujeres del Blues en Chile",
    description: "Artistas de blues femenino en Chile.",
    cover: assetUrl("playlists/en-chile.webp"),
    links: {
      Spotify: "https://open.spotify.com/playlist/6rHVbjZQNVJhUUo4syReSV",
      "YouTube Music": "https://music.youtube.com/playlist?list=PLOh4pTLn-_ns",
      YouTube: "https://www.youtube.com/playlist?list=PLOh4pTLn-_ns",
      "Amazon Music": "https://music.amazon.com/user-playlists/7877fa91-f30a-48ac-923e-6082c6cf4ea1",
    },
  },
  {
    id: "actual",
    title: "Mujeres del Blues Actual",
    description: "La escena actual del blues hecho por mujeres.",
    cover: assetUrl("playlists/actual.webp"),
    links: {
      Spotify: "https://open.spotify.com/playlist/7mMXaIVFHxXPRIsQzVgqZs",
      "YouTube Music": "https://music.youtube.com/playlist?list=PLOnfRLeFK0iQ",
      YouTube: "https://www.youtube.com/playlist?list=PLOnfRLeFK0iQ",
      "Amazon Music":
        "https://music.amazon.com/user-playlists/107f27c11eba4970b86d70c0b7348356itit",
    },
  },
  {
    id: "en-espanol",
    title: "Mujeres del Blues en Español",
    description: "Mujeres del blues de Iberoamérica haciendo blues femenino en español.",
    cover: assetUrl("playlists/en-espanol.webp"),
    links: {
      Spotify: "https://open.spotify.com/playlist/7H9TVF8E2qzpUlkd9eCwIr",
      "YouTube Music": "https://music.youtube.com/playlist?list=PLXQvJAIjGV48",
      YouTube: "https://www.youtube.com/playlist?list=PLXQvJAIjGV48",
      "Amazon Music": "https://music.amazon.com/user-playlists/48a79e59-36ea-4936-a62a-54e189c9a8fd",
    },
  },
];

/** The buttons of a playlist card: one per service, in the same order everywhere. */
export function platformsFor(playlist: MusicPlaylist): { name: string; href: string }[] {
  return platformOrder.map((name) => ({
    name,
    href: playlist.links[name] ?? profiles[name],
  }));
}

export interface PodcastPlaylist {
  id: string;
  title: string;
  description: string;
  /** Square picture, a file inside `public/`. Without it the card shows a plain placeholder. */
  cover?: string;
  platforms: { name: string; href: string }[];
}

/**
 * Video playlists of the podcast itself. To hide this whole section of the page,
 * leave the list empty: `export const podcastPlaylists: PodcastPlaylist[] = [];`
 */
export const podcastPlaylists: PodcastPlaylist[] = [
  {
    id: "temporada-1-youtube",
    title: "Temporada 1 en YouTube",
    description: "Los 21 capítulos de la primera temporada, en orden.",
    // The flyer of the premiere episode: the host and the name of the podcast.
    cover: assetUrl("flyers/t1e01.webp"),
    platforms: [
      {
        name: "YouTube",
        href: "https://www.youtube.com/playlist?list=PLajddc99FTAsdRF6dMfdcAYdU7mCFp7SU",
      },
    ],
  },
];
