/** Every text of the interface, in Spanish. The podcast content itself lives in `data/`. */
export const content = {
  siteName: "El Blues es Femenino",
  tagline: "Todo sobre las Mujeres del Blues en Chile",
  skip: "Saltar al contenido",
  nav: {
    ariaLabel: "Principal",
    menu: "Menú",
    close: "Cerrar menú",
    home: "Inicio",
    playlists: "Playlists",
    about: "Sobre el podcast",
  },
  hero: {
    eyebrow: "Podcast de Mujeres del Blues",
    description:
      "Todo sobre las mujeres que han marcado la historia del blues en Chile, desde una mirada crítica y feminista: entrevistas, cápsulas y columnas.",
    latest: "Ver lo más reciente",
    listen: "Escuchar en tus plataformas",
  },
  rail: {
    previous: "Desplazar a la izquierda",
    next: "Desplazar a la derecha",
  },
  episode: {
    back: "Volver al inicio",
    season: (number: number) => `Temporada ${number}`,
    previous: "Anterior",
    next: "Siguiente",
    moreFromSeason: "Más de esta temporada",
    nowPlaying: "Reproduciendo",
    play: (title: string) => `Reproducir video: ${title}`,
    playlistLabel: (seasonTitle: string) => `Episodios de la ${seasonTitle.toLowerCase()}`,
  },
  playlists: {
    title: "Playlists",
    description:
      "Las playlists de Mujeres del Blues, para seguirlas en la plataforma que prefieras.",
    listenOn: "Escuchar en",
    musicTitle: "Playlists de música",
    podcastTitle: "El podcast en YouTube",
  },
  about: {
    title: "Sobre el podcast",
    intro:
      "“El Blues es Femenino” nació como un podcast en Goodstock, con el propósito de visibilizar a las mujeres que han marcado la historia del blues en Chile, desde una mirada crítica y feminista. Luego evolucionó a un minipodcast en YouTube, con cápsulas breves que acercan estas historias a nuevas audiencias.",
    border:
      "A finales de 2025, el proyecto cruzó fronteras con una columna en HideAway Blues —Bahía Blanca Blues, transmitido por Taboo Radio (Argentina)—, llevando la voz de las mujeres del blues chileno a otros territorios y tejiendo redes entre escenas latinoamericanas.",
    whyTitle: "¿Por qué el blues es femenino?",
    why:
      "En nuestro programa exploramos el blues desde una perspectiva feminista. Revisamos su evolución desde los primeros acordes del blues clásico femenino hasta la vibrante escena actual de mujeres del blues en Chile.",
    seasonsTitle: "Las temporadas",
    seeEpisodes: "Ver capítulos",
    credits:
      "Una iniciativa de Mujeres del Blues, conducida por Soraya Sacaan.",
  },
  notFound: {
    title: "No encontramos esa página",
    description: "El enlace puede estar mal escrito o el capítulo ya no existe.",
    back: "Volver al inicio",
  },
  footer: {
    description: "Una iniciativa de Mujeres del Blues, conducida por Soraya Sacaan.",
    linksLabel: "Enlaces del pie de página",
    external: "(se abre en una pestaña nueva)",
    legal: "© {year} Mujeres del Blues. Todos los derechos reservados.",
    links: {
      motherSite: "Mujeres del Blues",
      youtube: "YouTube",
      instagram: "Instagram",
    },
  },
};
