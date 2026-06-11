/**
 * Seed de demonstration - Plateforme OIJD Section CIV.
 * Cree : utilisateurs/roles, 14 departements, actualites, activites, partenaires,
 * appels (avec formulaires dynamiques & criteres de scoring), modeles d'emails,
 * et un jeu de dossiers (>30 pour declencher la presynthese "dossiers recommandes").
 */
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { slugify, generateReference } from "@/lib/utils";
import { toJson } from "@/lib/json";
import { computeScore } from "@/lib/scoring";

const DEV_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@OIJD2026";
const STAFF_PASSWORD = "Oijd@2026";

function daysFromNow(d: number): Date {
  return new Date(Date.now() + d * 24 * 60 * 60 * 1000);
}

const DEPARTMENTS: {
  name: string;
  icon: string;
  short: string;
  mission: string;
  responsibilities: string[];
}[] = [
  {
    name: "Communication",
    icon: "Megaphone",
    short: "Visibilite, communiques, medias et publications de l'OIJD.",
    mission:
      "Assurer la visibilite de l'organisation et la diffusion de l'information institutionnelle.",
    responsibilities: [
      "Actualites, communiques et relations presse",
      "Gestion des reseaux sociaux et des medias",
      "Production de contenus et galeries",
    ],
  },
  {
    name: "Administration",
    icon: "Building2",
    short: "Coordination administrative et procedures internes.",
    mission: "Garantir le bon fonctionnement administratif de l'organisation.",
    responsibilities: [
      "Gestion administrative et documents internes",
      "Coordination des departements",
      "Procedures et archivage",
    ],
  },
  {
    name: "Ressources humaines",
    icon: "Users",
    short: "Recrutements, stages, volontariats et suivi des profils.",
    mission: "Mobiliser et accompagner les talents au service de l'OIJD.",
    responsibilities: [
      "Recrutements, stages et volontariats",
      "Gestion et suivi des profils",
      "Appels a candidatures",
    ],
  },
  {
    name: "Finances",
    icon: "BarChart3",
    short: "Gestion budgetaire, transparence et suivi financier.",
    mission: "Assurer une gestion financiere rigoureuse et transparente.",
    responsibilities: [
      "Budget et suivi financier",
      "Transparence et reporting",
      "Appui aux projets",
    ],
  },
  {
    name: "Relations exterieures",
    icon: "Globe2",
    short: "Diplomatie, cooperation et representations.",
    mission: "Developper la cooperation et les relations internationales.",
    responsibilities: [
      "Cooperation et diplomatie",
      "Partenariats internationaux",
      "Representations et missions",
    ],
  },
  {
    name: "Projets et programmes",
    icon: "FolderKanban",
    short: "Projets, programmes jeunesse et appels a projets.",
    mission: "Concevoir et piloter les projets et programmes de l'organisation.",
    responsibilities: [
      "Conception et suivi des projets",
      "Programmes jeunesse",
      "Appels a projets et initiatives",
    ],
  },
  {
    name: "Formation et renforcement des capacites",
    icon: "GraduationCap",
    short: "Formations, leadership et renforcement des capacites.",
    mission: "Renforcer les competences de la jeunesse diplomatique.",
    responsibilities: [
      "Programmes de formation",
      "Renforcement des capacites",
      "Leadership et negociation",
    ],
  },
  {
    name: "Juridique",
    icon: "ScrollText",
    short: "Cadre institutionnel, conformite et procedures.",
    mission: "Securiser le cadre juridique et la conformite de l'organisation.",
    responsibilities: [
      "Conformite et cadre institutionnel",
      "Notes juridiques",
      "Procedures et reglements",
    ],
  },
  {
    name: "Protocole",
    icon: "Flag",
    short: "Evenements officiels, ceremonies et missions.",
    mission: "Organiser et encadrer les evenements officiels.",
    responsibilities: [
      "Ceremonies et evenements officiels",
      "Protocole et missions",
      "Relations institutionnelles",
    ],
  },
  {
    name: "Suivi-evaluation",
    icon: "TrendingUp",
    short: "Indicateurs, rapports et suivi des projets.",
    mission: "Mesurer la performance et l'impact des actions.",
    responsibilities: [
      "Indicateurs et tableaux de bord",
      "Rapports d'activite",
      "Suivi des projets",
    ],
  },
  {
    name: "Partenariat et cooperation",
    icon: "Handshake",
    short: "Partenariats, conventions et opportunites de collaboration.",
    mission: "Construire des partenariats durables et strategiques.",
    responsibilities: [
      "Partenariats et conventions",
      "Cooperation institutionnelle",
      "Mobilisation de ressources",
    ],
  },
  {
    name: "Logistique",
    icon: "Truck",
    short: "Moyens, organisation materielle et appui operationnel.",
    mission: "Assurer l'appui logistique des activites et evenements.",
    responsibilities: [
      "Organisation materielle",
      "Gestion des moyens",
      "Appui operationnel",
    ],
  },
  {
    name: "Mobilisation et vie associative",
    icon: "HeartHandshake",
    short: "Engagement des membres et animation de la vie associative.",
    mission: "Animer la vie associative et mobiliser la jeunesse.",
    responsibilities: [
      "Mobilisation des membres",
      "Animation associative",
      "Sensibilisation citoyenne",
    ],
  },
  {
    name: "Relations institutionnelles",
    icon: "Building",
    short: "Relations avec les institutions et les autorites.",
    mission: "Entretenir des relations institutionnelles de qualite.",
    responsibilities: [
      "Relations avec les institutions",
      "Plaidoyer institutionnel",
      "Representation",
    ],
  },
];

const PROJECT_FORM = {
  fields: [
    { name: "projectTitle", label: "Titre du projet", type: "text", required: true },
    { name: "domain", label: "Domaine", type: "text" },
    { name: "summary", label: "Resume du projet", type: "textarea", required: true },
    { name: "objectives", label: "Objectifs", type: "textarea", required: true },
    { name: "targetAudience", label: "Public cible", type: "text" },
    { name: "expectedResults", label: "Resultats attendus", type: "textarea" },
    { name: "duration", label: "Duree", type: "text" },
    { name: "interventionZone", label: "Zone d'intervention", type: "text" },
    {
      name: "budget",
      label: "Budget previsionnel (FCFA)",
      type: "text",
      required: true,
    },
  ],
};

const CANDIDACY_FORM = {
  fields: [
    {
      name: "educationLevel",
      label: "Niveau d'etude",
      type: "select",
      required: true,
      options: ["Baccalaureat", "Licence", "Master", "Doctorat", "Autre"],
    },
    { name: "trainingField", label: "Domaine de formation", type: "text" },
    { name: "experience", label: "Experience", type: "textarea", required: true },
    { name: "experienceYears", label: "Annees d'experience", type: "number" },
    {
      name: "skills",
      label: "Competences principales",
      type: "textarea",
      required: true,
    },
    { name: "availability", label: "Disponibilite", type: "text" },
    { name: "interestDomain", label: "Domaine d'interet", type: "text" },
    { name: "motivation", label: "Motivation", type: "textarea", required: true },
  ],
};

const TENDER_FORM = {
  fields: [
    {
      name: "companyName",
      label: "Nom de l'entreprise / prestataire",
      type: "text",
      required: true,
    },
    { name: "legalRep", label: "Representant legal", type: "text" },
    { name: "activityDomain", label: "Domaine d'activite", type: "text" },
    { name: "references", label: "References", type: "textarea", required: true },
    { name: "relevantExperience", label: "Experiences pertinentes", type: "textarea" },
    { name: "technicalOffer", label: "Offre technique", type: "textarea", required: true },
    {
      name: "financialOffer",
      label: "Offre financiere (FCFA)",
      type: "text",
      required: true,
    },
  ],
};

async function main() {
  console.log("> Seed OIJD - demarrage");

  // --- Departements ---
  const deptByName: Record<string, string> = {};
  for (let i = 0; i < DEPARTMENTS.length; i++) {
    const d = DEPARTMENTS[i];
    const slug = slugify(d.name);
    const dept = await prisma.department.upsert({
      where: { slug },
      update: {
        name: d.name,
        icon: d.icon,
        shortDescription: d.short,
        mission: d.mission,
        responsibilities: toJson(d.responsibilities),
        order: i,
        isActive: true,
      },
      create: {
        name: d.name,
        slug,
        icon: d.icon,
        shortDescription: d.short,
        description: `Le departement ${d.name} de l'OIJD - Section CIV contribue activement a la mission de l'organisation. ${d.mission}`,
        mission: d.mission,
        responsibilities: toJson(d.responsibilities),
        publicEmail: `${slug}@oijd-civ.org`,
        order: i,
        isActive: true,
      },
    });
    deptByName[d.name] = dept.id;
  }

  // --- Utilisateurs ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@oijd-civ.org";
  const adminName = process.env.SEED_ADMIN_NAME || "Administrateur OIJD";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "SUPER_ADMIN", status: "ACTIVE" },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: await hashPassword(DEV_PASSWORD),
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      title: "Administrateur de la plateforme",
    },
  });

  const staffHash = await hashPassword(STAFF_PASSWORD);
  const staff: {
    name: string;
    email: string;
    role: string;
    dept?: string;
    title: string;
  }[] = [
    {
      name: "Aya Konan",
      email: "president@oijd-civ.org",
      role: "PRESIDENT",
      title: "Presidente",
    },
    {
      name: "Koffi N'Guessan",
      email: "communication@oijd-civ.org",
      role: "COMMUNICATION_MANAGER",
      dept: "Communication",
      title: "Responsable communication",
    },
    {
      name: "Mariam Toure",
      email: "rh@oijd-civ.org",
      role: "HR_MANAGER",
      dept: "Ressources humaines",
      title: "Responsable RH",
    },
    {
      name: "Yao Brou",
      email: "appels@oijd-civ.org",
      role: "CALLS_MANAGER",
      dept: "Projets et programmes",
      title: "Responsable des appels",
    },
    {
      name: "Awa Diabate",
      email: "projets@oijd-civ.org",
      role: "DEPARTMENT_HEAD",
      dept: "Projets et programmes",
      title: "Responsable du departement Projets et programmes",
    },
  ];

  const userByEmail: Record<string, string> = { [adminEmail]: admin.id };
  for (const s of staff) {
    const u = await prisma.user.upsert({
      where: { email: s.email },
      update: { role: s.role, status: "ACTIVE", departmentId: s.dept ? deptByName[s.dept] : null },
      create: {
        name: s.name,
        email: s.email,
        passwordHash: staffHash,
        role: s.role,
        status: "ACTIVE",
        title: s.title,
        departmentId: s.dept ? deptByName[s.dept] : null,
      },
    });
    userByEmail[s.email] = u.id;
  }

  // Responsables de departements
  await prisma.department.update({
    where: { slug: slugify("Communication") },
    data: { headId: userByEmail["communication@oijd-civ.org"] },
  });
  await prisma.department.update({
    where: { slug: slugify("Ressources humaines") },
    data: { headId: userByEmail["rh@oijd-civ.org"] },
  });
  await prisma.department.update({
    where: { slug: slugify("Projets et programmes") },
    data: { headId: userByEmail["projets@oijd-civ.org"] },
  });

  // --- Actualites ---
  const newsData = [
    {
      title: "Lancement officiel de la plateforme numerique de l'OIJD - Section CIV",
      category: "Institutionnel",
      dept: "Communication",
      excerpt:
        "L'OIJD se dote d'une plateforme institutionnelle moderne pour valoriser ses actions et structurer la gestion de ses appels.",
      content:
        "L'Organisation Internationale de la Jeunesse Diplomatique - Section CIV franchit une etape majeure avec le lancement de sa plateforme institutionnelle.\n\nCet espace numerique officiel centralise les actualites, les activites, les departements et le centre des appels et opportunites. Il permet desormais aux jeunes, partenaires et porteurs de projets de soumettre leurs dossiers en ligne en toute simplicite.\n\nLa plateforme a ete concue et realisee par Digital Access - Web Access Solution, dans une demarche de professionnalisation et de transparence.",
    },
    {
      title: "Forum de la jeunesse diplomatique : retour sur une edition reussie",
      category: "Evenement",
      dept: "Projets et programmes",
      excerpt:
        "Plus de 200 jeunes reunis autour de la diplomatie, du leadership et de la culture de la paix.",
      content:
        "Le Forum national de la jeunesse diplomatique a reuni plus de 200 participants venus de toute la Cote d'Ivoire.\n\nAu programme : panels, ateliers de negociation, simulations diplomatiques et rencontres avec des personnalites du monde institutionnel. Les echanges ont mis en lumiere le role central de la jeunesse dans la construction de la paix et de la cooperation.\n\nL'OIJD remercie l'ensemble des partenaires et des benevoles qui ont contribue au succes de cette edition.",
    },
    {
      title: "Appel a projets jeunesse : les candidatures sont ouvertes",
      category: "Appels",
      dept: "Projets et programmes",
      excerpt:
        "Portez un projet en faveur de la diplomatie, de la paix et de la cooperation : deposez votre dossier en ligne.",
      content:
        "Dans le cadre de ses programmes, l'OIJD - Section CIV lance un appel a projets destine a la jeunesse engagee.\n\nLes initiatives portant sur la diplomatie, la cooperation, la paix et le leadership responsable sont vivement encouragees. Les dossiers se deposent directement depuis le centre des appels de la plateforme.\n\nConsultez les conditions d'eligibilite et soumettez votre projet avant la date limite indiquee.",
    },
  ];
  for (const n of newsData) {
    const slug = slugify(n.title);
    await prisma.news.upsert({
      where: { slug },
      update: { status: "PUBLISHED" },
      create: {
        title: n.title,
        slug,
        excerpt: n.excerpt,
        content: n.content,
        category: n.category,
        keywords: toJson(["OIJD", "jeunesse", "diplomatie"]),
        status: "PUBLISHED",
        featured: true,
        departmentId: deptByName[n.dept],
        authorId: userByEmail["communication@oijd-civ.org"],
        publishedAt: daysFromNow(-Math.floor(Math.random() * 20) - 1),
      },
    });
  }

  // --- Activites ---
  const activitiesData = [
    {
      title: "Forum national de la jeunesse diplomatique 2026",
      status: "COMPLETED",
      location: "Abidjan, Cote d'Ivoire",
      dept: "Projets et programmes",
      start: -40,
      end: -38,
      featured: true,
      description:
        "Un rassemblement national autour de la diplomatie, du leadership et de la culture de la paix, avec panels, ateliers et simulations diplomatiques.",
      objectives:
        "- Renforcer l'engagement diplomatique des jeunes\n- Favoriser les echanges et le reseautage\n- Promouvoir la culture de la paix",
      results:
        "Plus de 200 participants, 8 ateliers, 3 simulations diplomatiques et de nombreuses initiatives lancees.",
    },
    {
      title: "Atelier de formation au leadership et a la negociation",
      status: "ONGOING",
      location: "Yamoussoukro, Cote d'Ivoire",
      dept: "Formation et renforcement des capacites",
      start: -2,
      end: 3,
      featured: false,
      description:
        "Un cycle de formation pratique destine a renforcer les competences en leadership, prise de parole et negociation.",
      objectives:
        "- Developper les competences de leadership\n- Maitriser les techniques de negociation\n- Renforcer la confiance en soi",
      results: "",
    },
    {
      title: "Caravane de sensibilisation a la culture de la paix",
      status: "PLANNED",
      location: "San-Pedro, Cote d'Ivoire",
      dept: "Mobilisation et vie associative",
      start: 25,
      end: 27,
      featured: false,
      description:
        "Une caravane citoyenne pour sensibiliser la jeunesse a la paix, au dialogue et au vivre-ensemble.",
      objectives:
        "- Sensibiliser a la culture de la paix\n- Mobiliser la jeunesse locale\n- Encourager le dialogue intercommunautaire",
      results: "",
    },
  ];
  for (const a of activitiesData) {
    const slug = slugify(a.title);
    await prisma.activity.upsert({
      where: { slug },
      update: { status: a.status },
      create: {
        title: a.title,
        slug,
        excerpt: a.description.slice(0, 140),
        description: a.description,
        location: a.location,
        startDate: daysFromNow(a.start),
        endDate: daysFromNow(a.end),
        objectives: a.objectives,
        results: a.results || null,
        status: a.status,
        featured: a.featured,
        gallery: toJson([]),
        partners: toJson([]),
        departmentId: deptByName[a.dept],
        authorId: userByEmail["communication@oijd-civ.org"],
      },
    });
  }

  // --- Partenaires ---
  const partners = [
    {
      name: "Ministere de la Jeunesse",
      type: "Institution publique",
      desc: "Partenaire institutionnel de reference pour les politiques jeunesse.",
    },
    {
      name: "PNUD",
      type: "Organisation internationale",
      desc: "Appui au developpement, a la gouvernance et a l'engagement citoyen.",
    },
    {
      name: "Union Africaine - Jeunesse",
      type: "Organisation continentale",
      desc: "Promotion de la participation des jeunes a l'echelle africaine.",
    },
    {
      name: "ONG Paix & Developpement",
      type: "Societe civile",
      desc: "Actions de terrain pour la paix, le dialogue et le developpement local.",
    },
  ];
  for (let i = 0; i < partners.length; i++) {
    const p = partners[i];
    const slug = slugify(p.name);
    await prisma.partner.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        description: p.desc,
        partnershipType: p.type,
        websiteUrl: "#",
        order: i,
        isActive: true,
      },
    });
  }

  // --- Appels / opportunites ---
  const opportunities: any[] = [
    {
      title: "Appel a projets jeunesse, diplomatie et cooperation",
      type: "PROJECT_CALL",
      status: "PUBLISHED",
      featured: true,
      dept: "Projets et programmes",
      deadline: 35,
      opening: -5,
      domain: "Diplomatie & paix",
      summary:
        "Soutien aux projets portes par la jeunesse en faveur de la diplomatie, de la paix et de la cooperation.",
      context:
        "L'OIJD - Section CIV accompagne les initiatives concretes qui renforcent l'engagement diplomatique de la jeunesse.",
      objectives:
        "- Soutenir des projets a fort impact\n- Promouvoir la diplomatie et la paix\n- Encourager le leadership des jeunes",
      eligibility:
        "Ouvert aux jeunes de 18 a 35 ans et aux organisations de jeunesse legalement constituees.",
      selectionCriteria:
        "Pertinence, faisabilite, impact, coherence avec la thematique et qualite du budget.",
      requiredDocuments: [
        "Document de projet",
        "Budget detaille",
        "Lettre d'engagement",
        "Piece d'identite du porteur",
      ],
      form: PROJECT_FORM,
      scoring: {
        keywords: ["diplomatie", "jeunesse", "paix", "cooperation", "leadership", "impact"],
        requiredFields: ["projectTitle", "summary", "objectives", "budget"],
      },
    },
    {
      title: "Appel a candidatures : volontaires OIJD 2026",
      type: "VOLUNTEERING",
      status: "PUBLISHED",
      featured: true,
      dept: "Ressources humaines",
      deadline: 25,
      opening: -8,
      domain: "Engagement & volontariat",
      summary:
        "Rejoignez les volontaires de l'OIJD et engagez-vous au service de la jeunesse diplomatique.",
      context:
        "Le programme de volontariat mobilise des jeunes engages pour appuyer les activites et programmes de l'organisation.",
      objectives:
        "- Mobiliser des volontaires engages\n- Renforcer les equipes de terrain\n- Developper les competences des jeunes",
      eligibility:
        "Ouvert aux jeunes de 18 a 30 ans, disponibles et motives par l'engagement citoyen.",
      selectionCriteria:
        "Motivation, competences, experience, disponibilite et completude du dossier.",
      requiredDocuments: ["CV", "Lettre de motivation", "Copie de la piece d'identite"],
      form: CANDIDACY_FORM,
      scoring: {
        keywords: ["diplomatie", "leadership", "communication", "paix", "benevolat", "engagement"],
        requiredFields: ["educationLevel", "experience", "motivation", "skills"],
      },
      manySubmissions: true,
    },
    {
      title: "Appel d'offres : prestation de communication et production de contenus",
      type: "TENDER",
      status: "PUBLISHED",
      featured: false,
      dept: "Communication",
      deadline: 18,
      opening: -3,
      domain: "Communication",
      summary:
        "Selection d'un prestataire pour la communication digitale et la production de contenus de l'OIJD.",
      context:
        "L'OIJD souhaite renforcer sa communication a travers une prestation professionnelle.",
      objectives:
        "- Produire des contenus de qualite\n- Animer les supports digitaux\n- Renforcer la visibilite",
      eligibility:
        "Ouvert aux entreprises et prestataires justifiant de references pertinentes.",
      selectionCriteria:
        "Conformite administrative, qualite de l'offre technique, competitivite de l'offre financiere et references.",
      requiredDocuments: [
        "Offre technique",
        "Offre financiere",
        "Attestations administratives",
        "References",
      ],
      form: TENDER_FORM,
      scoring: {
        keywords: ["communication", "design", "video", "reseaux sociaux", "contenu"],
        requiredFields: ["companyName", "references", "technicalOffer", "financialOffer"],
      },
    },
    {
      title: "Programme de formation au leadership diplomatique",
      type: "TRAINING",
      status: "PUBLISHED",
      featured: true,
      dept: "Formation et renforcement des capacites",
      deadline: 40,
      opening: -1,
      domain: "Formation",
      summary:
        "Un programme intensif pour former la releve diplomatique : leadership, negociation et relations internationales.",
      context:
        "Le renforcement des capacites est au coeur de la mission de l'OIJD.",
      objectives:
        "- Former aux fondamentaux de la diplomatie\n- Developper le leadership\n- Maitriser la negociation",
      eligibility: "Ouvert aux jeunes de 18 a 35 ans motives par la diplomatie.",
      selectionCriteria: "Motivation, parcours, engagement et completude du dossier.",
      requiredDocuments: ["CV", "Lettre de motivation"],
      form: CANDIDACY_FORM,
      scoring: {
        keywords: ["diplomatie", "leadership", "negociation", "international"],
        requiredFields: ["educationLevel", "motivation"],
      },
    },
    {
      title: "Concours du jeune diplomate de l'annee",
      type: "CONTEST",
      status: "RESULTS_PUBLISHED",
      featured: false,
      dept: "Communication",
      deadline: -10,
      opening: -45,
      domain: "Distinction",
      summary:
        "Un concours pour distinguer les jeunes qui s'illustrent par leur engagement diplomatique.",
      context: "Valoriser les parcours et initiatives exemplaires de la jeunesse.",
      objectives: "- Valoriser l'engagement\n- Inspirer la jeunesse",
      eligibility: "Ouvert aux jeunes de 18 a 35 ans.",
      selectionCriteria: "Originalite, impact, exemplarite et conformite aux criteres.",
      requiredDocuments: ["Dossier de candidature", "Justificatifs"],
      form: { fields: [
        { name: "category", label: "Categorie", type: "text", required: true },
        { name: "description", label: "Description de l'initiative", type: "textarea", required: true },
        { name: "links", label: "Liens de presentation", type: "text" },
      ] },
      scoring: { keywords: ["engagement", "impact", "diplomatie"], requiredFields: ["category", "description"] },
      resultsContent:
        "Les laureats du Concours du jeune diplomate de l'annee ont ete devoiles lors d'une ceremonie officielle. Felicitations a l'ensemble des participants pour la qualite de leurs initiatives.",
    },
  ];

  for (const o of opportunities) {
    const slug = slugify(o.title);
    const opp = await prisma.opportunity.upsert({
      where: { slug },
      update: { status: o.status },
      create: {
        title: o.title,
        slug,
        type: o.type,
        status: o.status,
        summary: o.summary,
        context: o.context,
        objectives: o.objectives,
        targetAudience: o.eligibility,
        eligibility: o.eligibility,
        selectionCriteria: o.selectionCriteria,
        requiredDocuments: toJson(o.requiredDocuments),
        downloadableDocs: toJson([]),
        openingDate: daysFromNow(o.opening),
        deadline: daysFromNow(o.deadline),
        processCalendar:
          "Ouverture, reception des dossiers, analyse par le comite, publication des resultats.",
        submissionGuidelines:
          "Renseignez le formulaire en ligne et joignez les pieces demandees aux formats PDF, DOC, DOCX, PNG ou JPG.",
        contactInfo: "appels@oijd-civ.org",
        domain: o.domain,
        country: "Cote d'Ivoire",
        featured: o.featured,
        departmentId: deptByName[o.dept],
        formSchema: toJson(o.form),
        scoringCriteria: toJson(o.scoring),
        faq: toJson([
          {
            q: "Comment soumettre mon dossier ?",
            a: "Cliquez sur le bouton d'action de l'appel et completez le formulaire en ligne.",
          },
          {
            q: "Quels formats de fichiers sont acceptes ?",
            a: "PDF, DOC, DOCX, PNG et JPG (taille maximale indiquee sur le formulaire).",
          },
        ]),
        resultsContent: o.resultsContent ?? null,
        resultsPublishedAt: o.status === "RESULTS_PUBLISHED" ? daysFromNow(-5) : null,
      },
    });

    // Dossiers de demonstration
    const existing = await prisma.submission.count({
      where: { opportunityId: opp.id },
    });
    if (existing === 0) {
      const n = o.manySubmissions ? 32 : o.type === "CONTEST" ? 0 : 4;
      await createDemoSubmissions(opp, o, n);
    }
  }

  // --- Modeles d'emails ---
  await seedEmailTemplates();

  // --- Parametres ---
  await prisma.siteSetting.upsert({
    where: { key: "publicStats" },
    update: {},
    create: { key: "publicStats", value: toJson({ members: 320, countries: 12 }) },
  });

  console.log("> Seed termine.");
  console.log(`  Admin    : ${adminEmail} / ${DEV_PASSWORD}`);
  console.log(`  Equipe   : president@ / communication@ / rh@ / appels@ / projets@ oijd-civ.org`);
  console.log(`  Mot de passe equipe : ${STAFF_PASSWORD}`);
}

const FIRST_NAMES = [
  "Awa", "Koffi", "Mariam", "Yao", "Aya", "Brou", "Fatou", "Jean", "Sarah", "Ibrahim",
  "Grace", "Kouame", "Nadia", "Serge", "Aminata", "Eric", "Chantal", "Moussa", "Laure", "Cedric",
];
const LAST_NAMES = [
  "Konan", "N'Guessan", "Toure", "Brou", "Diabate", "Kouassi", "Ouattara", "Bamba", "Koffi", "Yao",
  "Coulibaly", "Aka", "Traore", "Gnagne", "Kone", "Assi", "Tanoh", "Diallo", "Ehoussou", "Beda",
];
const SKILLS_POOL = [
  "leadership, communication et diplomatie",
  "negociation, paix et mediation",
  "communication digitale et reseaux sociaux",
  "gestion de projet et coordination",
  "benevolat, engagement et travail d'equipe",
  "plaidoyer et relations internationales",
];

async function createDemoSubmissions(opp: any, def: any, count: number) {
  for (let i = 0; i < count; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const eduOptions = ["Baccalaureat", "Licence", "Master", "Doctorat"];
    const edu = eduOptions[i % eduOptions.length];
    const years = (i % 6) + (i % 3);
    const longMotivation = i % 3 !== 0;
    const skills = SKILLS_POOL[i % SKILLS_POOL.length];
    const formData: Record<string, any> = {
      educationLevel: edu,
      trainingField: "Sciences politiques et relations internationales",
      experience:
        i % 4 === 0
          ? "Quelques experiences associatives."
          : "Plusieurs annees d'engagement associatif et participation a des projets de jeunesse, de paix et de cooperation.",
      experienceYears: String(years),
      skills,
      availability: "Immediate",
      interestDomain: "Diplomatie et cooperation",
      motivation: longMotivation
        ? "Je souhaite m'engager pleinement aupres de l'OIJD car la diplomatie, la paix et le leadership des jeunes me passionnent. Mon parcours et mes competences me permettront de contribuer concretement aux activites et programmes de l'organisation."
        : "Tres motive(e) a rejoindre l'OIJD.",
    };
    const docs = i % 5 === 0 ? ["CV"] : ["CV", "Lettre de motivation"];
    const scoreInput = {
      type: opp.type,
      scoringCriteria: def.scoring,
      requiredDocuments: def.requiredDocuments,
      formData,
      documents: docs.map((d) => ({ type: d, name: `${d}.pdf` })),
    };
    const result = computeScore(scoreInput);

    let status = "RECEIVED";
    if (i % 7 === 0) status = "UNDER_REVIEW";
    if (i % 11 === 0) status = "PRESELECTED";
    if (i % 5 === 0 && !result.complete) status = "INCOMPLETE";

    const sub = await prisma.submission.create({
      data: {
        reference: generateReference(),
        opportunityId: opp.id,
        status,
        submitterType: "INDIVIDUAL",
        firstName: fn,
        lastName: ln,
        email: `${fn}.${ln}`.toLowerCase().replace(/[^a-z.]/g, "") + `${i}@example.com`,
        phone: "+225 0700000000",
        country: "Cote d'Ivoire",
        city: i % 2 === 0 ? "Abidjan" : "Yamoussoukro",
        title: `${fn} ${ln}`,
        formData: toJson(formData),
        complete: result.complete,
        score: result.score,
        scoreLabel: result.scoreLabel,
        scoreDetails: toJson(result.scoreDetails),
        matchedCriteria: toJson(result.matchedCriteria),
        missingCriteria: toJson(result.missingCriteria),
        recommendationSummary: result.recommendationSummary,
      },
    });

    for (const d of docs) {
      await prisma.document.create({
        data: {
          name: `${d}-${sub.reference}.pdf`,
          originalName: `${d}.pdf`,
          mimeType: "application/pdf",
          sizeBytes: 120000 + i * 1000,
          storageKey: `demo/${sub.id}-${slugify(d)}.pdf`,
          type: d === "CV" ? "CV" : "LETTER",
          visibility: "CONFIDENTIAL",
          submissionId: sub.id,
          opportunityId: opp.id,
        },
      });
    }

    await prisma.submissionStatusHistory.create({
      data: {
        submissionId: sub.id,
        oldStatus: null,
        newStatus: "RECEIVED",
        comment: "Dossier recu via la plateforme.",
      },
    });
  }
}

async function seedEmailTemplates() {
  const templates: { key: string; name: string; subject: string; body: string }[] = [
    {
      key: "submission_received",
      name: "Confirmation de reception",
      subject: "Confirmation de reception de votre dossier - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Nous confirmons la bonne reception de votre dossier <strong>{{submissionTitle}}</strong> pour l'appel <strong>{{callTitle}}</strong>.</p><p>Reference : <strong>{{reference}}</strong></p><p>Votre dossier sera examine par nos equipes. Vous serez informe(e) des suites donnees.</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "complement_requested",
      name: "Demande de complement",
      subject: "Complement requis pour votre dossier - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Apres examen de votre dossier <strong>{{reference}}</strong>, nous vous invitons a fournir des elements complementaires.</p><p>{{nextStep}}</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "incomplete",
      name: "Dossier incomplet",
      subject: "Votre dossier est incomplet - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Votre dossier <strong>{{reference}}</strong> est actuellement incomplet. Merci de completer les pieces manquantes.</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "preselected",
      name: "Notification de preselection",
      subject: "Bonne nouvelle : votre dossier est preselectionne - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Nous avons le plaisir de vous informer que votre dossier <strong>{{reference}}</strong> a ete <strong>preselectionne</strong>.</p><p>{{nextStep}}</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "interview",
      name: "Invitation a un entretien",
      subject: "Invitation a un entretien - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Dans le cadre de l'appel <strong>{{callTitle}}</strong>, nous vous invitons a un entretien.</p><p>{{nextStep}}</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "rejected",
      name: "Notification de non-retenue",
      subject: "Suite donnee a votre dossier - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Apres un examen attentif, nous regrettons de ne pas pouvoir donner une suite favorable a votre dossier <strong>{{reference}}</strong>.</p><p>Nous vous remercions pour votre engagement et vous encourageons a postuler a nos prochaines opportunites.</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "final_selection",
      name: "Notification de selection finale",
      subject: "Felicitations : vous etes retenu(e) - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Felicitations ! Votre dossier <strong>{{reference}}</strong> a ete <strong>retenu</strong> pour l'appel <strong>{{callTitle}}</strong>.</p><p>{{nextStep}}</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "results_published",
      name: "Publication des resultats",
      subject: "Resultats publies - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Les resultats de l'appel <strong>{{callTitle}}</strong> sont desormais disponibles sur la plateforme.</p><p>{{platformUrl}}</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "thank_you",
      name: "Message de remerciement",
      subject: "Merci pour votre participation - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Merci d'avoir participe a l'appel <strong>{{callTitle}}</strong>. Votre engagement compte pour l'OIJD.</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
    {
      key: "project_presentation",
      name: "Invitation a presenter un projet",
      subject: "Invitation a presenter votre projet - {{callTitle}}",
      body: "<p>Bonjour {{candidateName}},</p><p>Nous vous invitons a presenter votre projet <strong>{{submissionTitle}}</strong> devant le comite.</p><p>{{nextStep}}</p><p>Cordialement,<br/>{{organizationName}}</p>",
    },
  ];
  for (const t of templates) {
    await prisma.emailTemplate.upsert({
      where: { key: t.key },
      update: { subject: t.subject, bodyHtml: t.body, name: t.name, isActive: true },
      create: {
        key: t.key,
        name: t.name,
        subject: t.subject,
        bodyHtml: t.body,
        isActive: true,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
