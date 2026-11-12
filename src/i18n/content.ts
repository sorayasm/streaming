import type { ProjectId } from "../data/site";

export type Language = "en" | "es";

export interface ProjectContent {
  id: ProjectId;
  title: string;
  description: string;
  /** Alternative text of the project image. */
  imageAlt: string;
  tags: string[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  period: string;
  points: string[];
}

export interface Content {
  meta: { title: string };
  skip: string;
  nav: {
    ariaLabel: string;
    menu: string;
    close: string;
    languageLabel: string;
    links: { work: string; about: string; experience: string; skills: string; contact: string };
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };
  work: {
    eyebrow: string;
    title: string;
    description: string;
    viewDemo: string;
    viewSource: string;
    opensInNewTab: string;
    status: { live: string; inProgress: string };
    projects: ProjectContent[];
  };
  about: {
    eyebrow: string;
    title: string;
    /** Alternative text of the portrait. */
    photoAlt: string;
    paragraphs: string[];
    figures: { value: string; label: string }[];
    servicesTitle: string;
    services: { title: string; description: string }[];
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    listLabel: string;
    entries: ExperienceEntry[];
    educationTitle: string;
    education: { title: string; place: string; period: string }[];
  };
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    groups: { title: string; items: string[] }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    elsewhere: string;
    form: {
      label: string;
      name: string;
      email: string;
      message: string;
      send: string;
      sending: string;
      subject: string;
      errors: {
        nameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        messageRequired: string;
      };
    };
  };
  footer: {
    description: string;
    linksLabel: string;
    external: string;
    /** `{year}` is replaced with the current year. */
    legal: string;
    links: { github: string; npm: string; linkedin: string; storybook: string };
  };
}

export const content: Record<Language, Content> = {
  en: {
    meta: { title: "Soraya Sacaan — Web developer" },
    skip: "Skip to content",
    nav: {
      ariaLabel: "Main",
      menu: "Menu",
      close: "Close menu",
      languageLabel: "Language",
      links: {
        work: "Work",
        about: "About",
        experience: "Experience",
        skills: "Skills",
        contact: "Contact",
      },
    },
    hero: {
      eyebrow: "Web developer",
      title: "Building digital experiences through code, design and data.",
      description:
        "Front-end developer and journalist with over a decade in digital products. I build accessible interfaces, design systems and data visualizations with React and TypeScript.",
      primary: "See selected work",
      secondary: "Get in touch",
    },
    work: {
      eyebrow: "Selected work",
      title: "Three projects, one design system",
      description:
        "Each project reuses the same components and themes, so the work shows both the products and the foundation under them.",
      viewDemo: "View live",
      viewSource: "Source code",
      opensInNewTab: "(opens in a new tab)",
      status: { live: "Live", inProgress: "In progress" },
      projects: [
        {
          id: "vietri",
          title: "Vietri Design System",
          description:
            "A themeable, accessible React and MUI design system: 30 components, three themes and automated WCAG 2.2 checks. Published on npm.",
          imageAlt:
            "Screenshot of the Vietri Design System documentation in Storybook: the introduction page, with the list of components on the left.",
          tags: ["React", "TypeScript", "MUI", "Storybook"],
        },
        {
          id: "streaming",
          title: "El Blues es Femenino — streaming",
          description:
            "A streaming site for El Blues es Femenino, the interview podcast I created and produce: 29 episodes in three seasons, each with its flyer, and the playlists on four music services.",
          imageAlt:
            "Home page of the El Blues es Femenino site: the podcast name over a photo of the host in the studio, with the buttons to watch the latest episode and to listen on the music platforms.",
          tags: ["React", "TypeScript", "Vietri DS"],
        },
        {
          id: "observatory",
          title: "Observatorio Mujeres del Blues",
          description:
            "The digital observatory of Mujeres del Blues, the network I founded: 176 profiles, their relationships, a timeline and an interactive network.",
          imageAlt:
            "Screenshot of the Observatorio MDB showing the relationship graph of women in the blues, with filters for country, role and decade above it.",
          tags: ["React", "Data visualization", "Vietri DS"],
        },
      ],
    },
    about: {
      eyebrow: "About",
      title: "Code, design and data",
      photoAlt: "Portrait of Soraya Sacaan",
      paragraphs: [
        "I'm Soraya Sacaan, a front-end developer and journalist with over a decade of experience in digital products. For almost five years I built web applications, design systems and reusable interface components with React, React Native and TypeScript at Globant, working with international teams.",
        "Before that I ran my own digital agency and worked on communication and social innovation projects. That background shapes how I work: I care about the people who will use an interface, and about telling clear stories with data.",
        "Outside client work I founded Mujeres del Blues in 2020, a platform and network that makes women in the blues visible, with a podcast and a festival in Chile. Its observatory and its streaming platform are the projects above.",
      ],
      figures: [
        { value: "10+", label: "Years building digital products" },
        { value: "30", label: "Components in my design system" },
        { value: "AA", label: "WCAG 2.2 target in my design system" },
      ],
      servicesTitle: "What I do",
      services: [
        {
          title: "Design systems",
          description: "Reusable, themed components with tokens, tests and documentation.",
        },
        {
          title: "Data visualization",
          description: "Interfaces that turn research and archives into stories you can explore.",
        },
        {
          title: "Accessible interfaces",
          description: "Keyboard, screen reader and contrast checks built into the workflow.",
        },
      ],
    },
    experience: {
      eyebrow: "Experience",
      title: "Where I have worked",
      description: "Technology roles and the projects I founded, newest first.",
      listLabel: "Work experience",
      entries: [
        {
          id: "exp-vox-mater",
          role: "Founder and project lead · Vox Mater",
          period: "2026 – Present",
          points: [
            "Concept and vision of a project at the intersection of cultural intelligence and technology.",
            "Design of a system to collect and standardize cultural data.",
            "Exploring technologies to organize cultural information and build new applications.",
          ],
        },
        {
          id: "exp-mujeres-del-blues",
          role: "Founder and project director · Mujeres del Blues",
          period: "2020 – Present",
          points: [
            "Created a digital platform that increases the visibility of women in the blues, and built a network of artists and collaborators from different countries.",
            "Created and produce the interview podcast El Blues es Femenino.",
            "Produce the Día del Blues festival in Chile, started in 2023.",
          ],
        },
        {
          id: "exp-freelance",
          role: "Web UI developer · Freelance (Italy)",
          period: "February 2026 – Present",
          points: ["Web development for entrepreneurs and independent initiatives."],
        },
        {
          id: "exp-globant",
          role: "Web UI developer · Globant",
          period: "April 2021 – January 2026",
          points: [
            "Built large-scale enterprise web applications with React, React Native and TypeScript.",
            "Built and maintained design systems and reusable interface components.",
            "Worked with international, multidisciplinary teams in agile environments.",
            "Modernized applications, refactored code and resolved technical debt.",
          ],
        },
        {
          id: "exp-adere",
          role: "Front-end developer · Adere.so",
          period: "October 2020 – April 2021",
          points: ["Front-end development for the company's projects, refactoring and technical debt."],
        },
        {
          id: "exp-aaxis",
          role: "Front-end developer · AAXIS",
          period: "April 2020 – September 2020",
          points: ["Web interfaces for client projects and code improvements."],
        },
        {
          id: "exp-retargeting",
          role: "Front-end developer · Retargeting",
          period: "March 2019 – March 2020",
          points: ["Web interfaces for client projects."],
        },
        {
          id: "exp-new-ideas-lab",
          role: "Founder and executive director · New Ideas Lab",
          period: "January 2013 – January 2018",
          points: [
            "Founded and ran the company, leading digital projects, web development and communication strategies.",
            "Digital marketing and social media initiatives in Chile and the United States.",
          ],
        },
      ],
      educationTitle: "Education and training",
      education: [
        {
          title: "Developing Secure Software",
          place: "The Linux Foundation",
          period: "2025",
        },
        {
          title: "Interaction Design specialization",
          place: "Interaction Design Foundation",
          period: "2020",
        },
        { title: "Front End Web Development", place: "Laboratoria", period: "2018" },
        {
          title: "Diploma in Social Innovation",
          place: "Pontificia Universidad Católica de Chile",
          period: "2016 – 2017",
        },
        {
          title: "Master's in Journalism and Digital Communication",
          place: "Universidad Mayor",
          period: "2008 – 2011",
        },
        {
          title: "Journalism and Social Communication degree",
          place: "Universidad Internacional SEK",
          period: "2001 – 2006",
        },
      ],
    },
    skills: {
      eyebrow: "Skills",
      title: "Tools I work with",
      description: "The stack behind the projects above.",
      groups: [
        {
          title: "Interface",
          items: ["React", "React Native", "TypeScript", "JavaScript", "Vite", "MUI"],
        },
        {
          title: "Design and quality",
          items: ["Design systems", "UX/UI", "Storybook", "Vitest", "axe-core", "WCAG 2.2"],
        },
        { title: "Delivery", items: ["Git and GitHub", "GitHub Actions", "npm"] },
        {
          title: "Languages",
          items: ["Spanish (native)", "English (B2)", "Italian (A2)"],
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's talk",
      description:
        "Have a project in mind, or want to talk about design systems or accessibility? Send me a message.",
      elsewhere: "You can also find me on",
      form: {
        label: "Contact form",
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send message",
        sending: "Opening your email app…",
        subject: "Message from the portfolio",
        errors: {
          nameRequired: "Please enter your name.",
          emailRequired: "Please enter your email.",
          emailInvalid: "Enter a valid email address.",
          messageRequired: "Please write a message.",
        },
      },
    },
    footer: {
      description: "Web developer and journalist. Built with Vietri DS.",
      linksLabel: "Footer links",
      external: "(opens in a new tab)",
      legal: "© {year} Soraya Sacaan. All rights reserved.",
      links: {
        github: "GitHub",
        npm: "npm",
        linkedin: "LinkedIn",
        storybook: "Design system (Storybook)",
      },
    },
  },

  es: {
    meta: { title: "Soraya Sacaan — Desarrolladora web" },
    skip: "Saltar al contenido",
    nav: {
      ariaLabel: "Principal",
      menu: "Menú",
      close: "Cerrar menú",
      languageLabel: "Idioma",
      links: {
        work: "Proyectos",
        about: "Sobre mí",
        experience: "Experiencia",
        skills: "Habilidades",
        contact: "Contacto",
      },
    },
    hero: {
      eyebrow: "Desarrolladora web",
      title: "Construyo experiencias digitales con código, diseño y datos.",
      description:
        "Desarrolladora front-end y periodista con más de una década en productos digitales. Construyo interfaces accesibles, sistemas de diseño y visualizaciones de datos con React y TypeScript.",
      primary: "Ver proyectos",
      secondary: "Contáctame",
    },
    work: {
      eyebrow: "Trabajo destacado",
      title: "Tres proyectos, un solo sistema de diseño",
      description:
        "Cada proyecto reutiliza los mismos componentes y temas, así que el trabajo muestra tanto los productos como la base que los sostiene.",
      viewDemo: "Ver en vivo",
      viewSource: "Código fuente",
      opensInNewTab: "(se abre en una pestaña nueva)",
      status: { live: "Disponible", inProgress: "En desarrollo" },
      projects: [
        {
          id: "vietri",
          title: "Vietri Design System",
          description:
            "Un sistema de diseño accesible y con temas, hecho con React y MUI: 30 componentes, tres temas y revisiones automáticas de WCAG 2.2. Publicado en npm.",
          imageAlt:
            "Captura de la documentación del sistema de diseño Vietri en Storybook: la página de introducción, con la lista de componentes a la izquierda.",
          tags: ["React", "TypeScript", "MUI", "Storybook"],
        },
        {
          id: "streaming",
          title: "El Blues es Femenino — streaming",
          description:
            "Un sitio de streaming para El Blues es Femenino, el podcast de entrevistas que creé y produzco: 29 capítulos en tres temporadas, cada uno con su flyer, y las playlists en cuatro servicios de música.",
          imageAlt:
            "Página de inicio del sitio de El Blues es Femenino: el nombre del podcast sobre una foto de la presentadora en el estudio, con los botones para ver lo más reciente y escuchar en las plataformas de música.",
          tags: ["React", "TypeScript", "Vietri DS"],
        },
        {
          id: "observatory",
          title: "Observatorio Mujeres del Blues",
          description:
            "El observatorio digital de Mujeres del Blues, la red que fundé: 176 perfiles, sus relaciones, una línea de tiempo y una red interactiva.",
          imageAlt:
            "Captura del Observatorio MDB con el grafo de relaciones de mujeres del blues, y filtros por país, rol y década encima.",
          tags: ["React", "Visualización de datos", "Vietri DS"],
        },
      ],
    },
    about: {
      eyebrow: "Sobre mí",
      title: "Código, diseño y datos",
      photoAlt: "Retrato de Soraya Sacaan",
      paragraphs: [
        "Soy Soraya Sacaan, desarrolladora front-end y periodista con más de una década de experiencia en productos digitales. Durante casi cinco años construí aplicaciones web, sistemas de diseño y componentes de interfaz reutilizables con React, React Native y TypeScript en Globant, trabajando con equipos internacionales.",
        "Antes dirigí mi propia agencia digital y trabajé en proyectos de comunicación e innovación social. Esa trayectoria marca mi forma de trabajar: me importan las personas que usarán una interfaz y contar historias claras con datos.",
        "Fuera del trabajo con clientes fundé Mujeres del Blues en 2020, una plataforma y red que da visibilidad a las mujeres en el blues, con un podcast y un festival en Chile. Su observatorio y su plataforma de streaming son los proyectos de arriba.",
      ],
      figures: [
        { value: "10+", label: "Años construyendo productos digitales" },
        { value: "30", label: "Componentes en mi sistema de diseño" },
        { value: "AA", label: "Meta WCAG 2.2 en mi sistema de diseño" },
      ],
      servicesTitle: "Qué hago",
      services: [
        {
          title: "Sistemas de diseño",
          description:
            "Componentes reutilizables y con temas, con tokens, pruebas y documentación.",
        },
        {
          title: "Visualización de datos",
          description:
            "Interfaces que convierten investigación y archivos en historias que se pueden explorar.",
        },
        {
          title: "Interfaces accesibles",
          description:
            "Revisiones de teclado, lector de pantalla y contraste integradas en el flujo de trabajo.",
        },
      ],
    },
    experience: {
      eyebrow: "Experiencia",
      title: "Dónde he trabajado",
      description: "Roles en tecnología y los proyectos que fundé, del más reciente al más antiguo.",
      listLabel: "Experiencia laboral",
      entries: [
        {
          id: "exp-vox-mater",
          role: "Fundadora y líder de proyecto · Vox Mater",
          period: "2026 – Actualidad",
          points: [
            "Concepto y visión de un proyecto en la intersección entre inteligencia cultural y tecnología.",
            "Diseño de un sistema de recopilación y estandarización de datos culturales.",
            "Exploración de tecnologías para organizar información cultural y desarrollar nuevas aplicaciones.",
          ],
        },
        {
          id: "exp-mujeres-del-blues",
          role: "Fundadora y directora de proyecto · Mujeres del Blues",
          period: "2020 – Actualidad",
          points: [
            "Creé una plataforma digital que aumenta la visibilidad de las mujeres en el blues y construí una red de artistas y colaboradoras de distintos países.",
            "Creé y produzco el podcast de entrevistas El Blues es Femenino.",
            "Produzco el festival Día del Blues en Chile, iniciado en 2023.",
          ],
        },
        {
          id: "exp-freelance",
          role: "Web UI developer · Freelance (Italia)",
          period: "Febrero 2026 – Actualidad",
          points: ["Desarrollo web para proyectos de emprendedores e iniciativas independientes."],
        },
        {
          id: "exp-globant",
          role: "Web UI developer · Globant",
          period: "Abril 2021 – Enero 2026",
          points: [
            "Desarrollé aplicaciones web empresariales de gran escala con React, React Native y TypeScript.",
            "Construí y mantuve sistemas de diseño y componentes de interfaz reutilizables.",
            "Trabajé con equipos internacionales y multidisciplinarios en entornos ágiles.",
            "Modernicé aplicaciones, refactoricé código y resolví deuda técnica.",
          ],
        },
        {
          id: "exp-adere",
          role: "Front-end developer · Adere.so",
          period: "Octubre 2020 – Abril 2021",
          points: [
            "Desarrollo frontend para los proyectos de la empresa, refactorización y resolución de deuda técnica.",
          ],
        },
        {
          id: "exp-aaxis",
          role: "Front-end developer · AAXIS",
          period: "Abril 2020 – Septiembre 2020",
          points: ["Interfaces web para proyectos de clientes y mejoras de código."],
        },
        {
          id: "exp-retargeting",
          role: "Front-end developer · Retargeting",
          period: "Marzo 2019 – Marzo 2020",
          points: ["Interfaces web para proyectos de clientes."],
        },
        {
          id: "exp-new-ideas-lab",
          role: "Fundadora y directora ejecutiva · New Ideas Lab",
          period: "Enero 2013 – Enero 2018",
          points: [
            "Fundé y dirigí la empresa, liderando proyectos digitales, desarrollo web y estrategias de comunicación.",
            "Iniciativas de marketing digital y redes sociales en Chile y Estados Unidos.",
          ],
        },
      ],
      educationTitle: "Formación",
      education: [
        {
          title: "Developing Secure Software",
          place: "The Linux Foundation",
          period: "2025",
        },
        {
          title: "Especialización en Interaction Design",
          place: "Interaction Design Foundation",
          period: "2020",
        },
        { title: "Front End Web Development", place: "Laboratoria", period: "2018" },
        {
          title: "Diplomado en Innovación Social",
          place: "Pontificia Universidad Católica de Chile",
          period: "2016 – 2017",
        },
        {
          title: "Magíster en Periodismo y Comunicación Digital",
          place: "Universidad Mayor",
          period: "2008 – 2011",
        },
        {
          title: "Periodismo y Licenciatura en Comunicación Social",
          place: "Universidad Internacional SEK",
          period: "2001 – 2006",
        },
      ],
    },
    skills: {
      eyebrow: "Habilidades",
      title: "Herramientas con las que trabajo",
      description: "El conjunto de herramientas detrás de los proyectos de arriba.",
      groups: [
        {
          title: "Interfaz",
          items: ["React", "React Native", "TypeScript", "JavaScript", "Vite", "MUI"],
        },
        {
          title: "Diseño y calidad",
          items: ["Design systems", "UX/UI", "Storybook", "Vitest", "axe-core", "WCAG 2.2"],
        },
        { title: "Entrega", items: ["Git y GitHub", "GitHub Actions", "npm"] },
        {
          title: "Idiomas",
          items: ["Español (nativo)", "Inglés (B2)", "Italiano (A2)"],
        },
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "Conversemos",
      description:
        "¿Tienes un proyecto en mente, o quieres conversar sobre sistemas de diseño o accesibilidad? Escríbeme.",
      elsewhere: "También me encuentras en",
      form: {
        label: "Formulario de contacto",
        name: "Nombre",
        email: "Correo electrónico",
        message: "Mensaje",
        send: "Enviar mensaje",
        sending: "Abriendo tu aplicación de correo…",
        subject: "Mensaje desde el portafolio",
        errors: {
          nameRequired: "Escribe tu nombre.",
          emailRequired: "Escribe tu correo electrónico.",
          emailInvalid: "Escribe un correo electrónico válido.",
          messageRequired: "Escribe un mensaje.",
        },
      },
    },
    footer: {
      description: "Desarrolladora web y periodista. Construido con Vietri DS.",
      linksLabel: "Enlaces del pie de página",
      external: "(se abre en una pestaña nueva)",
      legal: "© {year} Soraya Sacaan. Todos los derechos reservados.",
      links: {
        github: "GitHub",
        npm: "npm",
        linkedin: "LinkedIn",
        storybook: "Sistema de diseño (Storybook)",
      },
    },
  },
};
