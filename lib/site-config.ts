/**
 * Configuration publique de la plateforme (aucune donnee sensible).
 * Importable cote client comme cote serveur.
 */

export const siteConfig = {
  name: "OIJD",
  fullName: "Organisation Internationale de la Jeunesse Diplomatique",
  section: "Section CIV",
  fullNameWithSection:
    "Organisation Internationale de la Jeunesse Diplomatique - Section CIV",
  tagline: "Jeunesse, diplomatie et engagement pour un avenir responsable.",
  heroPhrase:
    "OIJD, une jeunesse engagee pour la diplomatie, la cooperation et le leadership responsable.",
  description:
    "L'OIJD - Section CIV federe une jeunesse engagee autour de la diplomatie, de la cooperation internationale et du leadership responsable. La plateforme valorise nos departements, nos activites et notre centre des appels et opportunites.",
  logo: "/brand/oijd-logo.png",
  logoCompact: "/brand/oijd-logo-compact.png",
  url: "https://oijd.vercel.app",

  contact: {
    email: "contact@oijd-civ.org",
    phone: "+225 27 00 00 00 00",
    address: "Abidjan, Cote d'Ivoire",
  },

  socials: [
    { name: "Facebook", href: "#", icon: "Facebook" },
    { name: "LinkedIn", href: "#", icon: "Linkedin" },
    { name: "Instagram", href: "#", icon: "Instagram" },
    { name: "YouTube", href: "#", icon: "Youtube" },
  ],

  digitalAccess: {
    name: "Digital Access - Web Access Solution",
    credit: "Conception et realisation : Digital Access - Web Access Solution",
    creditPrivate: "Plateforme concue par Digital Access - Web Access Solution",
    tagline:
      "Sites institutionnels, plateformes de gestion, portails d'appels a projets et systemes de candidatures en ligne.",
  },

  // Mot du president (page d'accueil & a propos). Remplacer par les vrais
  // nom, texte et photo (deposer la photo dans public/brand/president.jpg).
  president: {
    name: "", // ex: "Dr. Konan Yao" - laisser vide affiche uniquement le titre
    title: "President de l'OIJD - Section CIV",
    photo: "/brand/president.jpg",
    message: [
      "Chers membres, partenaires et amis de l'OIJD, notre Section Cote d'Ivoire porte une ambition claire : faire de la jeunesse un acteur de paix, de dialogue et de developpement durable.",
      "A travers nos departements, nos activites et notre centre des appels, nous offrons a chaque jeune un espace pour s'engager, se former et contribuer a une diplomatie responsable, ouverte sur le monde et ancree dans nos valeurs.",
    ],
  },
} as const;

/** Liens legaux (footer). */
export const legalNav: { label: string; href: string }[] = [
  { label: "Mentions legales", href: "/mentions-legales" },
  { label: "Confidentialite", href: "/confidentialite" },
];

/** Navigation publique a plat (utilisee par le plan de site du footer). */
export const publicNav: { label: string; href: string }[] = [
  { label: "Accueil", href: "/" },
  { label: "A propos", href: "/a-propos" },
  { label: "Organisation", href: "/organisation" },
  { label: "Departements", href: "/departements" },
  { label: "Responsables", href: "/responsables" },
  { label: "Actualites", href: "/actualites" },
  { label: "Activites", href: "/activites" },
  { label: "Appels & opportunites", href: "/appels" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Contact", href: "/contact" },
];

/** Element de menu enrichi (mega-menu / liste deroulante). */
export type NavMenuItem = {
  label: string;
  href: string;
  description: string;
  icon: string;
};

/** Entree de navigation : lien simple OU rubrique a menu deroulant. */
export type NavEntry =
  | { label: string; href: string }
  | {
      label: string;
      items: NavMenuItem[];
      featured?: {
        title: string;
        description: string;
        href: string;
        cta: string;
        icon: string;
      };
    };

/**
 * Navigation principale categorisee.
 * Header aere : rubriques regroupees, avec mega-menus animes.
 */
export const primaryNav: NavEntry[] = [
  { label: "Accueil", href: "/" },
  {
    label: "L'organisation",
    items: [
      {
        label: "A propos",
        href: "/a-propos",
        description: "Histoire, vision, mission et valeurs",
        icon: "Info",
      },
      {
        label: "Notre organisation",
        href: "/organisation",
        description: "Organigramme et gouvernance",
        icon: "Network",
      },
      {
        label: "Departements",
        href: "/departements",
        description: "Nos departements et commissions",
        icon: "Building2",
      },
      {
        label: "Responsables",
        href: "/responsables",
        description: "L'equipe qui dirige l'OIJD",
        icon: "Users",
      },
      {
        label: "Partenaires",
        href: "/partenaires",
        description: "Institutions et organisations partenaires",
        icon: "Handshake",
      },
    ],
    featured: {
      title: "Centre des appels",
      description: "Projets, candidatures, offres et opportunites ouvertes.",
      href: "/appels",
      cta: "Voir les appels",
      icon: "Megaphone",
    },
  },
  {
    label: "Actualites & activites",
    items: [
      {
        label: "Actualites",
        href: "/actualites",
        description: "Articles, communiques et publications",
        icon: "Newspaper",
      },
      {
        label: "Activites & projets",
        href: "/activites",
        description: "Evenements et initiatives de l'OIJD",
        icon: "CalendarCheck",
      },
    ],
  },
  { label: "Appels & opportunites", href: "/appels" },
  { label: "Contact", href: "/contact" },
];

/** Valeurs cles de l'OIJD (page d'accueil & a propos). */
export const coreValues: { title: string; description: string; icon: string }[] =
  [
    {
      title: "Jeunesse",
      description:
        "Faire de la jeunesse un acteur central de la diplomatie et du developpement.",
      icon: "Sparkles",
    },
    {
      title: "Diplomatie",
      description:
        "Promouvoir le dialogue, la negociation et la comprehension entre les peuples.",
      icon: "Handshake",
    },
    {
      title: "Responsabilite",
      description:
        "Agir avec ethique, transparence et sens de l'engagement citoyen.",
      icon: "ShieldCheck",
    },
    {
      title: "Cooperation",
      description:
        "Construire des partenariats durables au service de l'interet collectif.",
      icon: "Users",
    },
    {
      title: "Engagement citoyen",
      description:
        "Mobiliser les jeunes autour des grands enjeux de societe et de paix.",
      icon: "HeartHandshake",
    },
    {
      title: "Ouverture internationale",
      description:
        "Ancrer la Section CIV dans une dynamique mondiale de cooperation.",
      icon: "Globe2",
    },
  ];

/** Missions principales. */
export const missions: { title: string; description: string; icon: string }[] = [
  {
    title: "Former la releve diplomatique",
    description:
      "Renforcer les capacites des jeunes en diplomatie, leadership et relations internationales.",
    icon: "GraduationCap",
  },
  {
    title: "Promouvoir la paix et le dialogue",
    description:
      "Encourager la culture de la paix, la mediation et le vivre-ensemble.",
    icon: "Feather",
  },
  {
    title: "Accompagner les initiatives jeunes",
    description:
      "Soutenir les projets, appels et programmes portes par la jeunesse engagee.",
    icon: "Rocket",
  },
  {
    title: "Developper la cooperation",
    description:
      "Tisser des partenariats avec les institutions, ONG et organisations internationales.",
    icon: "Network",
  },
];
