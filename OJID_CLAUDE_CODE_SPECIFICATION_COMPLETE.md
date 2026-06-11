# Cahier de conception complet pour Claude Code
# Plateforme institutionnelle de l'OJID - Section CIV

**Projet :** Création de la plateforme institutionnelle complète de l'OJID  
**Organisation bénéficiaire :** OJID - Organisation Internationale de la Jeunesse Diplomatique, Section CIV  
**Structure conceptrice et réalisatrice :** **Digital Access - Web Access Solution**  
**Nature du projet :** Plateforme web institutionnelle complète, évolutive, sécurisée et responsive  
**Objectif :** Construire un site institutionnel moderne avec espace public, espaces privés, départements, responsables, actualités, activités, centre des appels, candidatures en ligne, documents, emails automatiques, tri rapide et présélection intelligente.

---

## 0. Message à Claude Code

Tu es Claude Code. Tu dois construire une application web complète pour l'OJID en respectant strictement ce cahier de conception. Tu dois prendre en compte tous les éléments fonctionnels, graphiques, techniques, organisationnels et sécuritaires décrits ci-dessous. La plateforme doit être professionnelle, moderne, institutionnelle, fluide, responsive et dotée de jolies animations légères, sans excès.

Tu dois travailler par étapes, livrer un code maintenable, éviter les solutions bricolées, vérifier régulièrement le build, et ne jamais supprimer des données ou fichiers existants sans instruction explicite.

Le site doit mettre en avant l'OJID comme organisation bénéficiaire, tout en indiquant clairement que la conception, la réalisation numérique, le déploiement, la formation et l'accompagnement sont assurés par **Digital Access - Web Access Solution**.

---

## 1. Principes non négociables

1. Construire une plateforme complète, pas un simple site vitrine.
2. Prévoir un **espace public** et un **espace privé sécurisé**.
3. Prévoir des **départements** et des **responsables** avec espaces dédiés.
4. Prévoir un **centre des appels, projets, candidatures et opportunités**, proche dans l'esprit des plateformes institutionnelles comme celle de l'AUF.
5. Gérer les **appels à projets**, **appels à candidatures**, **appels d'offres**, **concours**, **prix**, **stages**, **volontariats**, **missions**, **programmes**, **appels à experts**, **consultants** et **prestataires**.
6. Permettre aux visiteurs de soumettre des dossiers en ligne avec documents.
7. Centraliser les CV, lettres de motivation, offres techniques, offres financières, documents de projets, diplômes, attestations et pièces administratives.
8. Prévoir un **tri rapide** des dossiers.
9. Prévoir une **présélection intelligente** avec score de compatibilité, explication claire et décision humaine obligatoire.
10. Prévoir les emails automatiques et notifications internes.
11. Respecter la charte graphique issue du logo OJID.
12. Indiquer clairement la contribution de **Digital Access - Web Access Solution**.
13. Créer des animations modernes, douces, rapides et non exagérées.
14. Prévoir la sécurité, la confidentialité, l'audit des actions, les rôles et permissions.
15. Prévoir une architecture évolutive pouvant accueillir plus tard l'espace membre, l'e-learning, les cotisations, les newsletters, la PWA ou l'extension multi-sections/multi-pays.

---

## 2. Positionnement de Digital Access - Web Access Solution

La plateforme institutionnelle de l'OJID doit être conçue et réalisée par **Digital Access - Web Access Solution**.

Digital Access doit être présenté comme :

- la structure digitale conceptrice ;
- le maître d'oeuvre technique ;
- le responsable du cadrage, design, développement, tests, déploiement, formation et accompagnement ;
- la structure qui transforme les besoins de l'OJID en solution web professionnelle, crédible, sécurisée et exploitable sur le terrain.

### 2.1 Emplacements où Digital Access doit apparaître

1. **Footer public discret mais visible** :  
   `Conception et réalisation : Digital Access - Web Access Solution`
2. **Page dédiée optionnelle `/conception-realisation`** : présentation courte de Digital Access et de son rôle dans le projet.
3. **Footer de l'espace privé** :  
   `Plateforme conçue par Digital Access - Web Access Solution`
4. **Page de connexion** : mention discrète en bas de page.
5. **Emails automatiques** : ne pas surcharger l'email, mais prévoir éventuellement une ligne technique discrète en pied : `Plateforme numérique conçue par Digital Access - Web Access Solution`.

### 2.2 Limite de mise en avant

Le site doit rester d'abord une plateforme officielle de l'OJID. Digital Access doit être valorisé avec sérieux, mais sans voler l'identité institutionnelle de l'OJID.

---

## 3. Stack technique recommandée

Utiliser une architecture moderne, maintenable et évolutive.

### 3.1 Stack principale

- **Framework :** Next.js avec App Router et TypeScript.
- **Base de données :** PostgreSQL.
- **ORM :** Prisma.
- **Design :** Tailwind CSS.
- **Animations :** Framer Motion ou animations CSS/Tailwind maîtrisées.
- **Validation :** Zod.
- **Authentification :** système par email/mot de passe avec rôles et permissions. Auth.js/NextAuth possible, ou système custom sécurisé avec cookies HTTPOnly.
- **Hash mot de passe :** bcrypt ou argon2.
- **Emails :** Resend ou SMTP professionnel.
- **Fichiers :** stockage cloud sécurisé compatible S3, UploadThing, Cloudinary privé, ou stockage local en développement.
- **Déploiement :** Vercel ou serveur dédié.
- **Qualité :** ESLint, TypeScript strict, build sans erreur.

### 3.2 Variables d'environnement attendues

```env
DATABASE_URL="postgresql://..."
APP_URL="http://localhost:3000"
APP_NAME="OJID"
APP_FULL_NAME="Organisation Internationale de la Jeunesse Diplomatique - Section CIV"
DIGITAL_ACCESS_NAME="Digital Access - Web Access Solution"
AUTH_SECRET="change_me"
EMAIL_FROM="OJID <noreply@domain.com>"
RESEND_API_KEY=""
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
STORAGE_PROVIDER="local"
S3_ENDPOINT=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_BUCKET=""
MAX_UPLOAD_MB="10"
ENABLE_SMART_SCORING="true"
```

---

## 4. Charte graphique obligatoire

La charte doit être construite à partir du logo officiel de l'OJID : globe, flamme, ruban vert/blanc/orange, ancrage ivoirien et ouverture internationale.

### 4.1 Couleurs OJID

Créer les variables CSS suivantes :

```css
:root {
  --ojid-green: #00860B;
  --ojid-green-dark: #24752D;
  --ojid-orange: #FC5D01;
  --ojid-orange-flame: #FB8204;
  --ojid-white: #FFFFFF;
  --ojid-gray: #EBECEB;
  --ojid-bluegray: #719D96;
  --digital-purple: #6F2DBD;
  --ink: #121212;
  --muted: #667085;
  --background: #FFFFFF;
}
```

### 4.2 Usage des couleurs

- Vert institutionnel : titres importants, menus actifs, boutons secondaires, icônes institutionnelles.
- Vert profond : footer, sidebar dashboard, zones de pilotage.
- Orange diplomatique : boutons principaux, CTA, appels ouverts, badges importants, notifications prioritaires.
- Orange flamme : hover, accents, bannières, éléments liés aux activités et à la jeunesse.
- Blanc : fond principal, cartes, formulaires, espaces de lecture.
- Gris clair : fonds secondaires, cartes administratives, tableaux, formulaires.
- Bleu-gris : bordures, séparateurs, éléments liés à l'international.
- Violet Digital Access : réservé aux mentions de Digital Access, à la page de réalisation, ou aux documents de démonstration. Ne pas l'utiliser comme couleur principale du site OJID.

### 4.3 Typographie

- Titres : Montserrat ou Poppins.
- Textes : Inter, Lato ou Open Sans.
- Boutons : semi-gras, texte court.
- Articles : bonne hiérarchie, interlignes confortables, paragraphes aérés.

### 4.4 Style global

Le design doit transmettre :

- institution ;
- jeunesse ;
- diplomatie ;
- responsabilité ;
- sérieux ;
- clarté ;
- modernité ;
- ouverture internationale.

Le fond blanc doit dominer. Les touches vertes et orange doivent guider l'attention sans surcharger l'interface.

---

## 5. Animations et expérience utilisateur

La plateforme doit avoir de jolies animations, mais elles doivent rester sobres.

### 5.1 Animations recommandées

- Apparition douce des sections au scroll : `fade-up` léger.
- Cartes d'actualités et appels : hover avec légère élévation, ombre douce, translation de 2 à 4 px.
- Boutons : transition couleur + légère translation ou scale très léger.
- Menus : ouverture fluide, durée courte.
- Statistiques : compteur animé discret.
- Dashboard : apparition progressive des cards et tableaux.
- Formulaires multi-étapes : transition slide/fade entre étapes.
- Upload de fichiers : état hover, progress bar, validation visuelle.
- Modales : fade + scale 0.98 vers 1.
- Skeleton loaders pour listes, tableaux et détails.

### 5.2 Ce qu'il faut éviter

- Pas d'animations trop lentes.
- Pas de parallax lourd.
- Pas de textes qui bougent en permanence.
- Pas d'effets 3D inutiles.
- Pas de carrousel agressif.
- Pas d'animations qui nuisent à la lecture institutionnelle.

### 5.3 Accessibilité des animations

Respecter `prefers-reduced-motion`. Si l'utilisateur a réduit les animations, désactiver les animations complexes.

---

## 6. Architecture générale de l'application

La plateforme doit être divisée en environnements.

### 6.1 Espace public

Objectif : informer, valoriser, publier et recevoir les soumissions.

Modules :

- Accueil.
- À propos.
- Notre organisation.
- Départements.
- Responsables.
- Actualités.
- Activités et projets.
- Centre des appels et opportunités.
- Partenaires.
- Contact.
- Page conception/réalisation Digital Access.

### 6.2 Espace privé

Objectif : administrer, gérer, traiter, analyser, valider et suivre.

Modules :

- Tableau de bord.
- Utilisateurs et rôles.
- Départements.
- Responsables.
- Actualités.
- Activités.
- Appels.
- Dossiers.
- Documents.
- Emails.
- Notifications.
- Statistiques.
- Audit log.
- Paramètres.

### 6.3 Moteur de notification

Informer automatiquement :

- les candidats ;
- les porteurs de projet ;
- les prestataires ;
- les responsables internes ;
- les administrateurs.

### 6.4 Base documentaire

Stocker et sécuriser :

- CV ;
- lettres de motivation ;
- offres techniques ;
- offres financières ;
- documents de projets ;
- diplômes ;
- attestations ;
- pièces d'identité ;
- rapports ;
- photos ;
- documents administratifs ;
- documents institutionnels.

### 6.5 Moteur d'analyse

Aider au tri rapide et à la présélection intelligente :

- scoring ;
- filtres ;
- critères ;
- profils recommandés ;
- projets recommandés ;
- explication du score ;
- décision humaine obligatoire.

---

## 7. Arborescence recommandée

```txt
app/
  (public)/
    page.tsx
    a-propos/page.tsx
    organisation/page.tsx
    departements/page.tsx
    departements/[slug]/page.tsx
    responsables/page.tsx
    actualites/page.tsx
    actualites/[slug]/page.tsx
    activites/page.tsx
    activites/[slug]/page.tsx
    appels/page.tsx
    appels/[slug]/page.tsx
    appels/[slug]/soumettre/page.tsx
    partenaires/page.tsx
    contact/page.tsx
    conception-realisation/page.tsx
  (auth)/
    login/page.tsx
    mot-de-passe-oublie/page.tsx
    reinitialiser-mot-de-passe/page.tsx
  dashboard/
    page.tsx
    utilisateurs/page.tsx
    utilisateurs/[id]/page.tsx
    departements/page.tsx
    departements/[id]/page.tsx
    responsables/page.tsx
    actualites/page.tsx
    actualites/new/page.tsx
    actualites/[id]/edit/page.tsx
    activites/page.tsx
    activites/new/page.tsx
    activites/[id]/edit/page.tsx
    appels/page.tsx
    appels/new/page.tsx
    appels/[id]/page.tsx
    appels/[id]/edit/page.tsx
    appels/[id]/dossiers/page.tsx
    dossiers/page.tsx
    dossiers/[id]/page.tsx
    documents/page.tsx
    emails/page.tsx
    notifications/page.tsx
    statistiques/page.tsx
    audit/page.tsx
    parametres/page.tsx
  api/
    auth/
    uploads/
    contact/
    appels/
    dossiers/
    emails/
components/
  public/
  dashboard/
  forms/
  cards/
  tables/
  layout/
  ui/
lib/
  auth/
  prisma.ts
  permissions.ts
  scoring.ts
  email.ts
  storage.ts
  validators.ts
  audit.ts
  utils.ts
prisma/
  schema.prisma
  seed.ts
public/
  brand/
    ojid-logo.png
    ojid-logo-compact.png
    digital-access-logo.png
```

---

## 8. Pages publiques à construire

### 8.1 Page d'accueil `/`

La page d'accueil doit donner immédiatement une image institutionnelle forte.

Sections obligatoires :

1. Header avec logo OJID, navigation et CTA `Voir les appels`.
2. Hero institutionnel avec phrase d'accroche :
   - `Jeunesse, diplomatie et engagement pour un avenir responsable.`
   - ou formulation personnalisable dans l'administration.
3. Présentation courte de l'OJID et de la Section CIV.
4. Missions principales.
5. Valeurs clés : jeunesse, diplomatie, responsabilité, coopération, engagement citoyen, ouverture internationale.
6. Dernières actualités.
7. Activités récentes.
8. Appels ouverts mis en avant : appels à projets, candidatures, offres et opportunités.
9. Chiffres clés : membres, activités, projets, partenaires, pays/zones d'action.
10. Partenaires ou logos institutionnels, si disponibles.
11. Bloc CTA : `Soumettre un dossier`, `Lire les actualités`, `Contacter l'OJID`.
12. Footer avec mention Digital Access.

### 8.2 Page À propos `/a-propos`

Contenu :

- historique de l'organisation ;
- vision ;
- mission ;
- valeurs ;
- domaines d'intervention ;
- mot du président ou de la direction ;
- documents institutionnels publics ;
- engagements et principes d'action.

### 8.3 Page Notre organisation `/organisation`

Contenu :

- organigramme général ;
- instances dirigeantes ;
- départements et commissions ;
- responsables principaux ;
- représentations ou antennes si applicables ;
- fiches de présentation des membres clés.

### 8.4 Pages des départements `/departements` et `/departements/[slug]`

Chaque département doit avoir une page publique avec :

- nom du département ;
- mission ;
- attributions ;
- responsable ;
- activités ;
- actualités liées ;
- documents publics ;
- projets en cours ;
- contacts institutionnels si nécessaire.

Départements à prévoir dans le seed :

1. Communication.
2. Administration.
3. Ressources humaines.
4. Finances.
5. Relations extérieures.
6. Projets et programmes.
7. Formation et renforcement des capacités.
8. Juridique.
9. Protocole.
10. Suivi-évaluation.
11. Partenariat et coopération.
12. Logistique.
13. Mobilisation et vie associative.
14. Relations institutionnelles.

### 8.5 Actualités `/actualites` et `/actualites/[slug]`

Fonctions :

- fil d'actualité sous forme de cartes modernes ;
- image principale ;
- catégorie ;
- date ;
- résumé ;
- bouton `Lire la suite` ;
- page détaillée avec contenu complet, images, documents liés, auteur ou département, actualités similaires ;
- possibilité d'associer une actualité à un département ;
- possibilité de mettre une actualité en avant.

### 8.6 Activités et projets `/activites` et `/activites/[slug]`

Fonctions :

- liste des activités ;
- fiches détaillées : titre, description, lieu, date, objectifs, résultats, galerie photos, documents, partenaires, département responsable ;
- statuts : prévue, en cours, réalisée, reportée, annulée, archivée ;
- mise en avant des activités majeures sur la page d'accueil.

### 8.7 Centre des appels `/appels`

Ce module est stratégique.

Nom recommandé : **Centre des appels et opportunités de l'OJID**.

La page doit afficher :

- une bannière claire ;
- un moteur de recherche ;
- des filtres ;
- des cartes d'appels ;
- les appels ouverts en priorité ;
- les statuts visibles ;
- CTA `Voir les détails`, `Postuler`, `Soumettre un projet`, `Déposer une offre` selon le type.

Types d'appels à gérer :

- Appels à projets.
- Appels à candidatures.
- Appels d'offres.
- Appels à manifestation d'intérêt.
- Appels à participation.
- Concours.
- Prix et distinctions.
- Recrutements.
- Stages.
- Volontariats.
- Missions ponctuelles.
- Programmes de formation.
- Programmes jeunesse.
- Programmes de leadership.
- Opportunités de partenariat.
- Appels à experts.
- Appels à consultants.
- Appels à prestataires.

Filtres publics :

- type d'appel ;
- statut ;
- département ;
- domaine ;
- date limite ;
- pays ;
- ville ;
- public cible ;
- niveau d'étude ;
- mot-clé.

### 8.8 Page détaillée d'un appel `/appels/[slug]`

La page doit afficher :

- titre complet ;
- type d'appel ;
- contexte ;
- objectifs ;
- département responsable ;
- public cible ;
- conditions d'éligibilité ;
- critères de sélection ;
- pièces à fournir ;
- documents à télécharger ;
- date d'ouverture ;
- date limite ;
- calendrier du processus ;
- modalités de soumission ;
- contacts utiles ;
- FAQ ;
- statut actuel ;
- bouton d'action adapté : `Postuler`, `Soumettre un projet`, `Déposer une offre`.

Si l'appel est clôturé, afficher un message clair et désactiver la soumission.

### 8.9 Page de soumission `/appels/[slug]/soumettre`

Formulaire dynamique selon le type d'appel.

Voir section 11 pour les champs.

### 8.10 Partenaires `/partenaires`

Contenu :

- logos ;
- noms ;
- descriptions ;
- types de collaboration ;
- projets associés ;
- liens officiels.

### 8.11 Contact `/contact`

Contenu :

- formulaire de contact anti-spam ;
- email ;
- téléphone ;
- adresse ;
- carte ;
- réseaux sociaux ;
- contacts par département si nécessaire ;
- notification interne vers le service concerné.

### 8.12 Page conception/réalisation `/conception-realisation`

Page dédiée à Digital Access :

- logo Digital Access ;
- texte : `Cette plateforme a été conçue et réalisée par Digital Access - Web Access Solution.` ;
- domaines de compétence : sites institutionnels, plateformes de gestion, portails d'appels à projets, systèmes de candidatures en ligne, tableaux de bord, solutions numériques adaptées ;
- rôle dans le projet : cadrage, design, développement, déploiement, formation et accompagnement.

---

## 9. Espace privé et tableau de bord

### 9.1 Authentification

L'accès privé se fait par email et mot de passe.

Obligatoire :

- mot de passe chiffré ;
- session sécurisée ;
- déconnexion ;
- réinitialisation de mot de passe ;
- protection des routes privées ;
- RBAC par rôle ;
- option 2FA pour les rôles sensibles dans une phase avancée.

### 9.2 Rôles

Créer les rôles suivants :

| Rôle | Droits principaux |
|---|---|
| SUPER_ADMIN | Accès complet, configuration générale, utilisateurs, rôles, sécurité, supervision. |
| ADMIN_GENERAL | Gestion des contenus, appels, dossiers, départements, statistiques. |
| PRESIDENT | Vision globale, validation, indicateurs, supervision des décisions. |
| DEPARTMENT_HEAD | Gestion du département, contenus associés, dossiers liés, observations. |
| COMMUNICATION_MANAGER | Actualités, communiqués, médias, galeries, publications, mise en avant. |
| HR_MANAGER | Candidatures, recrutements, stages, volontariats, suivi des profils. |
| CALLS_MANAGER | Création des appels, suivi des dossiers, statuts et réponses. |
| EDITOR | Création de contenus en brouillon ou soumission pour validation. |
| VALIDATOR | Validation ou rejet de contenus et décisions autorisées. |
| INTERNAL_READER | Consultation limitée des informations autorisées. |
| TECH_SUPPORT | Support technique limité pour Digital Access, selon validation. |

### 9.3 Tableau de bord général `/dashboard`

Afficher :

- nombre d'actualités publiées ;
- nombre d'activités enregistrées ;
- nombre d'appels ouverts ;
- nombre d'appels clôturés ;
- nombre d'appels en analyse ;
- nombre total de dossiers reçus ;
- dossiers complets ;
- dossiers incomplets ;
- dossiers présélectionnés ;
- dossiers retenus ;
- dossiers non retenus ;
- alertes importantes ;
- appels arrivant à échéance ;
- dossiers en attente ;
- publications à valider ;
- statistiques de consultation et d'engagement.

### 9.4 Espaces départementaux

Chaque département doit disposer d'un espace interne.

Fonctions :

- modifier la présentation publique du département ;
- publier ou proposer des actualités ;
- créer ou proposer des activités ;
- consulter les dossiers liés au département ;
- ajouter des observations internes ;
- télécharger les documents autorisés ;
- transmettre un dossier à un autre responsable ;
- produire des rapports simples d'activité ;
- consulter l'historique.

### 9.5 Espaces personnels des responsables

Chaque responsable doit voir :

- son profil ;
- son rôle ;
- son département ;
- ses tâches assignées ;
- ses dossiers à examiner ;
- ses publications en attente ;
- ses notifications internes ;
- l'historique de ses actions.

---

## 10. Centre des appels, projets, candidatures et opportunités

### 10.1 Création d'un appel

Dans le dashboard, les utilisateurs autorisés doivent pouvoir créer un appel avec :

- titre ;
- slug ;
- type ;
- département concerné ;
- contexte ;
- objectifs ;
- public cible ;
- conditions d'éligibilité ;
- critères de sélection ;
- pièces obligatoires ;
- documents à télécharger ;
- date d'ouverture ;
- date limite ;
- calendrier ;
- modalités de soumission ;
- contacts utiles ;
- FAQ ;
- formulaire associé ;
- critères de scoring ;
- statut.

### 10.2 États d'un appel

| État | Description |
|---|---|
| DRAFT | L'appel est préparé en interne mais non publié. |
| SCHEDULED | L'appel est prêt et sera publié automatiquement. |
| PUBLISHED | L'appel est public et accepte les dossiers. |
| CLOSED | La date limite est atteinte ou l'appel est fermé manuellement. |
| UNDER_REVIEW | Les responsables examinent les dossiers reçus. |
| RESULTS_PUBLISHED | Les résultats sont publics. |
| SUSPENDED | L'appel est suspendu temporairement. |
| ARCHIVED | L'appel reste consultable mais inactif. |

### 10.3 Résultats

Pour certains appels, l'administration doit pouvoir publier :

- liste des candidats retenus ;
- liste des projets retenus ;
- liste des prestataires sélectionnés ;
- communiqué officiel ;
- document PDF téléchargeable ;
- article d'actualité associé.

---

## 11. Formulaires dynamiques de soumission

Le formulaire doit s'adapter au type d'appel. Il ne faut pas imposer un formulaire unique.

### 11.1 Appel à candidature

Champs :

- nom ;
- prénom ;
- email ;
- téléphone ;
- pays ;
- ville ;
- niveau d'étude ;
- domaine de formation ;
- expérience ;
- compétences principales ;
- disponibilité ;
- motivation ;
- domaine d'intérêt ;
- CV ;
- lettre de motivation ;
- diplômes ou attestations ;
- message de motivation ou réponses à des questions spécifiques.

### 11.2 Appel à projets

Champs :

- nom du porteur de projet ou de l'organisation ;
- coordonnées du responsable ;
- titre du projet ;
- résumé ;
- domaine ;
- objectifs ;
- public cible ;
- résultats attendus ;
- durée ;
- zone d'intervention ;
- budget prévisionnel ;
- document de projet ;
- budget détaillé ;
- pièces administratives ;
- lettre d'engagement.

### 11.3 Appel d'offres

Champs :

- nom de l'entreprise ou du prestataire ;
- représentant légal ;
- coordonnées ;
- domaine d'activité ;
- références ;
- expériences pertinentes ;
- offre technique ;
- offre financière ;
- documents administratifs ;
- attestations ou pièces exigées.

### 11.4 Concours, prix et distinctions

Champs :

- identité du candidat ou de l'équipe ;
- catégorie de participation ;
- description de l'initiative ou de la production ;
- documents justificatifs ;
- images ;
- vidéos ou liens de présentation ;
- autorisation de publication si nécessaire.

### 11.5 Réception du dossier

Après soumission :

1. enregistrer le dossier ;
2. associer le dossier à l'appel ;
3. stocker les documents ;
4. attribuer un statut initial ;
5. envoyer un email de confirmation ;
6. notifier le responsable interne ;
7. conserver l'historique.

Statuts initiaux possibles :

- RECEIVED ;
- PENDING_VERIFICATION ;
- INCOMPLETE ;
- UNDER_REVIEW.

---

## 12. Tri rapide, scoring et présélection intelligente

### 12.1 Déclenchement

Lorsque le nombre de dossiers pour un même appel atteint 30 ou plus, afficher une section spéciale :

`Dossiers recommandés pour examen prioritaire`

ou, pour un recrutement :

`Profils recommandés pour examen prioritaire`

### 12.2 Tri rapide

Les responsables doivent pouvoir trier par :

- date de soumission ;
- appel ;
- département ;
- type de dossier ;
- statut ;
- dossier complet/incomplet ;
- pays ;
- ville ;
- domaine ;
- niveau d'étude ;
- expérience ;
- compétence ;
- score de compatibilité ;
- profils recommandés ;
- projets recommandés ;
- dossiers présélectionnés ;
- retenus ;
- non retenus.

Prévoir aussi export CSV/XLSX pour les comités d'analyse.

### 12.3 Score de compatibilité

| Score | Interprétation |
|---|---|
| 90 - 100 % | Dossier très pertinent ou profil très compatible. |
| 75 - 89 % | Dossier fortement intéressant à examiner rapidement. |
| 60 - 74 % | Dossier à examiner avec attention. |
| 40 - 59 % | Dossier partiellement compatible. |
| < 40 % | Dossier faiblement compatible, à vérifier manuellement si nécessaire. |

### 12.4 Critères par type d'appel

| Type d'appel | Critères analysés |
|---|---|
| Appel à candidature | Formation, expérience, compétences, CV, lettre de motivation, disponibilité, complétude du dossier. |
| Appel à projets | Pertinence, cohérence avec la thématique, objectifs, faisabilité, budget, impact, public cible, documents fournis. |
| Appel d'offres | Conformité administrative, offre technique, offre financière, références, adéquation de la proposition. |
| Concours ou prix | Catégorie, originalité, impact, pièces justificatives, conformité aux critères. |

### 12.5 Algorithme de scoring première version

Créer un moteur interne dans `lib/scoring.ts`.

Le score peut être calculé sur 100 points :

- complétude du dossier : 25 points ;
- correspondance avec les critères obligatoires : 30 points ;
- mots-clés et compétences attendues : 20 points ;
- expérience ou références : 15 points ;
- qualité/cohérence des réponses textuelles : 10 points.

Chaque appel doit pouvoir définir ses critères et leurs poids. Si aucun critère personnalisé n'est défini, utiliser la grille par défaut.

Le scoring doit générer :

- `score` ;
- `scoreLabel` ;
- `scoreDetails` en JSON ;
- `matchedCriteria` ;
- `missingCriteria` ;
- `recommendationSummary`.

### 12.6 Décision humaine obligatoire

La présélection intelligente ne doit jamais rejeter automatiquement un candidat, un projet ou un prestataire. Elle est seulement un outil d'aide à l'analyse.

La décision finale doit être validée par un utilisateur habilité.

---

## 13. Fiche d'analyse d'un dossier

Chaque dossier doit avoir une page interne `/dashboard/dossiers/[id]` affichant :

- identité du candidat, porteur de projet ou prestataire ;
- appel concerné ;
- type de soumission ;
- date de soumission ;
- documents transmis ;
- données du formulaire ;
- score de compatibilité ;
- résumé automatique ;
- critères remplis ;
- critères non remplis ;
- commentaires internes ;
- statut actuel ;
- historique de traitement ;
- décision finale ;
- email associé ;
- actions : demander complément, présélectionner, retenir, rejeter, archiver.

### 13.1 Statuts des dossiers

- RECEIVED
- PENDING_VERIFICATION
- INCOMPLETE
- COMPLEMENT_REQUESTED
- UNDER_REVIEW
- RECOMMENDED
- PRESELECTED
- INTERVIEW
- RETAINED
- REJECTED
- FINAL_VALIDATED
- ARCHIVED

Chaque changement de statut doit :

- enregistrer un audit log ;
- mettre à jour l'historique du dossier ;
- permettre l'envoi d'un email automatique ou manuel.

---

## 14. Emails automatiques et notifications

### 14.1 Modèles d'emails

Créer un module de modèles d'emails personnalisables.

Modèles :

1. Confirmation de réception d'un dossier.
2. Demande de complément.
3. Notification de dossier incomplet.
4. Notification de présélection.
5. Invitation à un entretien.
6. Invitation à une présentation de projet.
7. Notification de non-retenue.
8. Notification de sélection finale.
9. Notification de publication des résultats.
10. Message de remerciement.

### 14.2 Variables disponibles

```txt
{{candidateName}}
{{submissionTitle}}
{{callTitle}}
{{callType}}
{{departmentName}}
{{status}}
{{nextStep}}
{{deadline}}
{{organizationName}}
{{contactEmail}}
{{platformUrl}}
```

### 14.3 Notifications internes

Notifier les responsables quand :

- nouveau dossier reçu ;
- appel arrivé à échéance ;
- dossier incomplet détecté ;
- profil recommandé ;
- projet recommandé ;
- candidature en attente ;
- publication en attente de validation ;
- document ajouté ;
- statut modifié.

---

## 15. Gestion des contenus

### 15.1 Actualités

Fonctions :

- créer article ;
- image principale ;
- contenu riche ;
- catégorie ;
- département associé ;
- brouillon ;
- soumission validation ;
- publication ;
- modification ;
- archivage ;
- suppression ;
- mise en avant ;
- mots-clés ;
- galerie photo ;
- documents associés.

### 15.2 Activités et projets

Fonctions :

- créer fiche activité ;
- titre ;
- lieu ;
- date ;
- objectifs ;
- résultats ;
- département responsable ;
- statuts : PLANNED, ONGOING, COMPLETED, POSTPONED, CANCELLED, ARCHIVED ;
- galerie photos ;
- documents ;
- partenaires ;
- lien avec une actualité ou un projet global.

### 15.3 Documents

Fonctions :

- téléverser ;
- classer ;
- sécuriser ;
- associer à une candidature, un appel, un département, une actualité ou une activité ;
- gérer confidentialité ;
- limiter accès selon rôle ;
- journaliser téléchargements sensibles.

---

## 16. Sécurité, confidentialité et conformité

### 16.1 Sécurité des accès

- mots de passe chiffrés ;
- rôles et permissions ;
- sessions sécurisées ;
- déconnexion ;
- réinitialisation par email ;
- protection routes privées ;
- audit log ;
- rate limit sur formulaires sensibles ;
- protection contre soumissions spam ;
- validation Zod côté serveur ;
- nettoyage des entrées utilisateur ;
- gestion d'erreurs sans fuite d'informations.

### 16.2 Sécurité des documents

- types autorisés : PDF, DOC, DOCX, PNG, JPG, JPEG, éventuellement ZIP si explicitement autorisé ;
- taille limitée via `MAX_UPLOAD_MB` ;
- stockage hors du dossier public direct ;
- accès via routes sécurisées ;
- liens signés si stockage cloud ;
- journalisation des téléchargements ;
- suppression/archivage selon règles OJID.

### 16.3 Confidentialité

- les candidats ne doivent pas voir les dossiers d'autres candidats ;
- les responsables ne doivent voir que les dossiers de leur périmètre sauf autorisation supérieure ;
- les données personnelles ne doivent jamais être affichées publiquement ;
- les actions de consultation, modification et décision doivent être retraçables.

### 16.4 Performance et accessibilité

- responsive ordinateur, tablette, mobile ;
- chargement rapide des images ;
- contraste suffisant ;
- formulaires lisibles ;
- navigation claire ;
- compatible connexions internet moyennes ;
- SEO de base ;
- métadonnées pour partage social ;
- images optimisées avec `next/image`.

---

## 17. Modèle de données Prisma recommandé

Créer une base solide. Adapter si nécessaire, mais couvrir toutes les entités.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  SUPER_ADMIN
  ADMIN_GENERAL
  PRESIDENT
  DEPARTMENT_HEAD
  COMMUNICATION_MANAGER
  HR_MANAGER
  CALLS_MANAGER
  EDITOR
  VALIDATOR
  INTERNAL_READER
  TECH_SUPPORT
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum PublishStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  ARCHIVED
  REJECTED
}

enum OpportunityType {
  PROJECT_CALL
  CANDIDACY_CALL
  TENDER
  EXPRESSION_OF_INTEREST
  PARTICIPATION_CALL
  CONTEST
  AWARD
  RECRUITMENT
  INTERNSHIP
  VOLUNTEERING
  MISSION
  TRAINING
  YOUTH_PROGRAM
  LEADERSHIP_PROGRAM
  PARTNERSHIP
  EXPERT_CALL
  CONSULTANT_CALL
  PROVIDER_CALL
}

enum OpportunityStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  CLOSED
  UNDER_REVIEW
  RESULTS_PUBLISHED
  SUSPENDED
  ARCHIVED
}

enum SubmissionStatus {
  RECEIVED
  PENDING_VERIFICATION
  INCOMPLETE
  COMPLEMENT_REQUESTED
  UNDER_REVIEW
  RECOMMENDED
  PRESELECTED
  INTERVIEW
  RETAINED
  REJECTED
  FINAL_VALIDATED
  ARCHIVED
}

enum ActivityStatus {
  PLANNED
  ONGOING
  COMPLETED
  POSTPONED
  CANCELLED
  ARCHIVED
}

enum DocumentVisibility {
  PUBLIC
  INTERNAL
  CONFIDENTIAL
  PRIVATE
}

model User {
  id              String       @id @default(cuid())
  name            String
  email           String       @unique
  passwordHash    String
  role            Role         @default(INTERNAL_READER)
  status          UserStatus   @default(ACTIVE)
  departmentId    String?
  department      Department?  @relation(fields: [departmentId], references: [id])
  avatarUrl       String?
  phone           String?
  title           String?
  bio             String?
  resetToken      String?
  resetTokenExp   DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  authoredNews    News[]
  auditLogs       AuditLog[]
  notifications   Notification[]
  internalNotes   InternalNote[]
}

model Department {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  shortDescription String?
  description     String?
  mission         String?
  responsibilities String?
  publicEmail     String?
  isActive        Boolean     @default(true)
  headId          String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  users           User[]
  news            News[]
  activities      Activity[]
  opportunities   Opportunity[]
  documents       Document[]
}

model News {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  excerpt         String?
  content         String
  coverImage      String?
  category        String?
  keywords        String[]
  status          PublishStatus @default(DRAFT)
  featured        Boolean       @default(false)
  departmentId    String?
  department      Department?   @relation(fields: [departmentId], references: [id])
  authorId        String?
  author          User?         @relation(fields: [authorId], references: [id])
  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  documents       Document[]
}

model Activity {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  excerpt         String?
  description     String
  location        String?
  startDate       DateTime?
  endDate         DateTime?
  objectives      String?
  results         String?
  status          ActivityStatus @default(PLANNED)
  coverImage      String?
  gallery         String[]
  featured        Boolean       @default(false)
  departmentId    String?
  department      Department?   @relation(fields: [departmentId], references: [id])
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  documents       Document[]
}

model Partner {
  id              String     @id @default(cuid())
  name            String
  slug            String     @unique
  description     String?
  logoUrl         String?
  websiteUrl      String?
  partnershipType String?
  isActive        Boolean    @default(true)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Opportunity {
  id              String              @id @default(cuid())
  title           String
  slug            String              @unique
  type            OpportunityType
  status          OpportunityStatus   @default(DRAFT)
  summary         String?
  context         String?
  objectives      String?
  targetAudience  String?
  eligibility     String?
  selectionCriteria String?
  requiredDocuments String[]
  downloadableDocs String[]
  openingDate     DateTime?
  deadline        DateTime?
  processCalendar String?
  submissionGuidelines String?
  contactInfo     String?
  faq             Json?
  country         String?
  city            String?
  domain          String?
  educationLevel  String?
  featured        Boolean             @default(false)
  departmentId    String?
  department      Department?         @relation(fields: [departmentId], references: [id])
  formSchema      Json?
  scoringCriteria Json?
  resultsContent  String?
  resultsPublishedAt DateTime?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  submissions     Submission[]
  documents       Document[]
}

model Submission {
  id              String            @id @default(cuid())
  opportunityId   String
  opportunity     Opportunity       @relation(fields: [opportunityId], references: [id])
  status          SubmissionStatus  @default(RECEIVED)
  submitterType   String            @default("INDIVIDUAL")
  firstName       String?
  lastName        String?
  organizationName String?
  email           String
  phone           String?
  country         String?
  city            String?
  title           String?
  formData        Json
  score           Int?
  scoreLabel      String?
  scoreDetails    Json?
  matchedCriteria Json?
  missingCriteria Json?
  recommendationSummary String?
  finalDecision   String?
  decidedAt       DateTime?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  documents       Document[]
  notes           InternalNote[]
  emailLogs       EmailLog[]
  statusHistory   SubmissionStatusHistory[]
}

model Document {
  id              String             @id @default(cuid())
  name            String
  originalName    String
  mimeType        String
  sizeBytes       Int
  storageKey      String
  url             String?
  type            String?
  visibility      DocumentVisibility @default(CONFIDENTIAL)
  departmentId    String?
  department      Department?        @relation(fields: [departmentId], references: [id])
  newsId          String?
  news            News?              @relation(fields: [newsId], references: [id])
  activityId      String?
  activity        Activity?          @relation(fields: [activityId], references: [id])
  opportunityId   String?
  opportunity     Opportunity?       @relation(fields: [opportunityId], references: [id])
  submissionId    String?
  submission      Submission?        @relation(fields: [submissionId], references: [id])
  uploadedById    String?
  createdAt       DateTime           @default(now())
}

model InternalNote {
  id              String      @id @default(cuid())
  content         String
  submissionId    String
  submission      Submission  @relation(fields: [submissionId], references: [id])
  authorId        String
  author          User        @relation(fields: [authorId], references: [id])
  createdAt       DateTime    @default(now())
}

model SubmissionStatusHistory {
  id              String            @id @default(cuid())
  submissionId    String
  submission      Submission        @relation(fields: [submissionId], references: [id])
  oldStatus       SubmissionStatus?
  newStatus       SubmissionStatus
  changedById     String?
  comment         String?
  createdAt       DateTime          @default(now())
}

model EmailTemplate {
  id              String      @id @default(cuid())
  key             String      @unique
  name            String
  subject         String
  bodyHtml        String
  bodyText        String?
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model EmailLog {
  id              String      @id @default(cuid())
  submissionId    String?
  submission      Submission? @relation(fields: [submissionId], references: [id])
  to              String
  subject         String
  templateKey     String?
  status          String
  error           String?
  sentAt          DateTime?
  createdAt       DateTime    @default(now())
}

model Notification {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  type            String
  title           String
  message         String
  readAt          DateTime?
  link            String?
  createdAt       DateTime    @default(now())
}

model ContactMessage {
  id              String      @id @default(cuid())
  name            String
  email           String
  phone           String?
  subject         String
  message         String
  departmentId    String?
  status          String      @default("NEW")
  createdAt       DateTime    @default(now())
}

model AuditLog {
  id              String      @id @default(cuid())
  userId          String?
  user            User?       @relation(fields: [userId], references: [id])
  action          String
  entityType      String
  entityId        String?
  oldValue        Json?
  newValue        Json?
  ipAddress       String?
  userAgent       String?
  createdAt       DateTime    @default(now())
}

model SiteSetting {
  id              String      @id @default(cuid())
  key             String      @unique
  value           Json
  updatedAt       DateTime    @updatedAt
}
```

---

## 18. Permissions détaillées

Créer `lib/permissions.ts`.

### 18.1 Super administrateur

Tout voir, tout créer, tout modifier, tout supprimer, gérer les paramètres, utilisateurs, rôles, sécurité.

### 18.2 Administrateur général

Gérer les contenus, appels, dossiers, départements, statistiques, documents et validations.

### 18.3 Président / Direction

Lire la vision globale, suivre les indicateurs, valider les décisions, consulter les dossiers stratégiques.

### 18.4 Responsable de département

Gérer uniquement son département, ses contenus, ses dossiers et ses documents.

### 18.5 Responsable communication

Gérer actualités, communiqués, médias, galeries, mise en avant et publications.

### 18.6 Responsable RH

Gérer appels à candidatures, recrutements, stages, volontariats et dossiers RH.

### 18.7 Responsable appels

Créer et suivre les appels, consulter les dossiers, changer les statuts, envoyer les réponses.

### 18.8 Rédacteur

Créer contenus en brouillon, soumettre validation.

### 18.9 Validateur

Valider/rejeter les contenus et certaines décisions autorisées.

### 18.10 Lecteur interne

Consulter uniquement les informations autorisées.

---

## 19. Composants UI à créer

### 19.1 Public

- `PublicHeader`
- `PublicFooter`
- `HeroSection`
- `MissionCards`
- `ValueBadge`
- `StatsGrid`
- `NewsCard`
- `ActivityCard`
- `OpportunityCard`
- `DepartmentCard`
- `PartnerLogoGrid`
- `ContactForm`
- `DigitalAccessCredit`

### 19.2 Dashboard

- `DashboardShell`
- `Sidebar`
- `Topbar`
- `StatCard`
- `DataTable`
- `StatusBadge`
- `RoleBadge`
- `ScoreBadge`
- `ScoreMeter`
- `NotificationBell`
- `FileUploadDropzone`
- `SubmissionTimeline`
- `InternalNotesPanel`
- `EmailPreviewModal`
- `FiltersBar`
- `EmptyState`
- `ConfirmDialog`

### 19.3 Formulaires

- `DynamicSubmissionForm`
- `OpportunityFormBuilder`
- `OpportunityCriteriaBuilder`
- `DocumentRequirementsEditor`
- `FormStep`
- `UploadField`
- `ValidationError`

---

## 20. Contenu seed obligatoire

Créer `prisma/seed.ts` avec :

### 20.1 Utilisateur initial

- Super admin Digital Access ou admin initial.
- Email à configurer via `.env` ou valeur de dev.
- Mot de passe de dev à changer en production.

### 20.2 Départements initiaux

Inclure les départements listés dans la section 8.4.

### 20.3 Pages et contenus initiaux

Créer :

- 3 actualités de démonstration ;
- 3 activités de démonstration ;
- 3 appels de démonstration :
  1. Appel à projets jeunesse et diplomatie.
  2. Appel à candidature pour volontaires OJID.
  3. Appel d'offres pour prestation de communication.
- 4 partenaires de démonstration ;
- modèles d'emails initiaux.

---

## 21. Parcours utilisateurs

### 21.1 Visiteur

1. Arrive sur la page d'accueil.
2. Découvre l'OJID.
3. Consulte les départements.
4. Lit les actualités et activités.
5. Consulte les appels ouverts.
6. Clique sur un appel.
7. Lit les détails.
8. Soumet un dossier ou contacte l'organisation.

### 21.2 Candidat / porteur de projet / prestataire

1. Consulte un appel.
2. Vérifie les conditions.
3. Remplit le formulaire dynamique.
4. Téléverse les documents.
5. Soumet le dossier.
6. Reçoit email de confirmation.
7. Peut recevoir demande de complément, présélection, invitation, rejet ou sélection finale.

### 21.3 Responsable de département

1. Se connecte.
2. Arrive sur un dashboard adapté.
3. Consulte les dossiers de son département.
4. Trie et filtre.
5. Analyse les fiches.
6. Ajoute observations.
7. Change statuts selon permissions.
8. Suit historique.

### 21.4 Administrateur

1. Gère utilisateurs, rôles, départements.
2. Crée et publie contenus.
3. Crée appels.
4. Consulte tous les dossiers.
5. Supervise emails et statistiques.
6. Contrôle sécurité et paramètres.

### 21.5 Responsable communication

1. Crée articles et communiqués.
2. Ajoute médias et galeries.
3. Soumet ou publie selon rôle.
4. Met en avant actualités/activités.

---

## 22. Phases de développement recommandées

### Phase 1 - Initialisation

- Créer projet Next.js TypeScript.
- Installer Tailwind, Prisma, Zod, bcrypt/argon2, email, upload, animations.
- Configurer variables CSS OJID.
- Créer layout public et dashboard.
- Ajouter logos OJID et Digital Access dans `public/brand`.

### Phase 2 - Base de données et auth

- Créer Prisma schema.
- Migration.
- Seed.
- Auth email/mot de passe.
- RBAC.
- Protection routes dashboard.

### Phase 3 - Site public

- Accueil.
- À propos.
- Organisation.
- Départements.
- Actualités.
- Activités.
- Partenaires.
- Contact.
- Page Digital Access.
- Footer avec crédit Digital Access.

### Phase 4 - Centre des appels

- Liste publique des appels.
- Page détail.
- Filtres.
- Création/édition dashboard.
- Statuts.
- Documents téléchargeables.

### Phase 5 - Soumission de dossiers

- Formulaires dynamiques.
- Upload fichiers.
- Enregistrement dossier.
- Emails confirmation.
- Notifications internes.

### Phase 6 - Traitement interne

- Liste des dossiers.
- Filtres et tri rapide.
- Fiche d'analyse.
- Statuts.
- Notes internes.
- Historique.
- Export.

### Phase 7 - Scoring et présélection

- Moteur scoring.
- ScoreMeter.
- Critères remplis/non remplis.
- Section dossiers recommandés dès 30 dossiers.
- Décision humaine obligatoire.

### Phase 8 - Emails, documents, statistiques

- Modèles emails.
- Logs emails.
- Documents sécurisés.
- Statistiques par appel.
- Dashboard global.

### Phase 9 - Tests, performance et finition

- Build.
- Tests fonctionnels.
- Tests responsive.
- Tests sécurité.
- Vérification accessibilité.
- Animations légères.
- Suppression textes placeholder non souhaités.

### Phase 10 - Déploiement

- Vercel ou serveur dédié.
- Domaine.
- Variables production.
- Email production.
- Stockage production.
- Sauvegardes.
- Documentation.

---

## 23. Critères d'acceptation

Le projet est acceptable si :

1. `npm run build` passe sans erreur.
2. La page d'accueil est professionnelle, responsive et animée subtilement.
3. Le footer indique Digital Access - Web Access Solution.
4. Les pages publiques principales existent.
5. Les départements existent et ont leurs pages.
6. Le centre des appels permet de filtrer, lire et soumettre.
7. Les formulaires dynamiques fonctionnent selon le type d'appel.
8. Les documents peuvent être téléversés et associés à un dossier.
9. Le candidat reçoit un email de confirmation.
10. Le responsable reçoit une notification interne.
11. Le dashboard affiche statistiques et dossiers.
12. Les rôles limitent correctement l'accès.
13. Le tri rapide fonctionne.
14. Le scoring produit un score et une explication.
15. Le système n'élimine jamais automatiquement un dossier.
16. Les actions sensibles sont journalisées.
17. Les fichiers sensibles ne sont pas accessibles publiquement.
18. Le design respecte les couleurs OJID.
19. Les animations respectent `prefers-reduced-motion`.
20. La plateforme est lisible sur mobile.

---

## 24. Commandes attendues

À adapter selon le gestionnaire de paquets.

```bash
npm install
npm run dev
npm run lint
npm run build
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

Avant de considérer une étape terminée, lancer :

```bash
npm run build
```

Si le build échoue, corriger avant de poursuivre.

---

## 25. Recommandations de qualité pour Claude Code

1. Ne pas générer tout en un seul fichier.
2. Créer des composants réutilisables.
3. Utiliser TypeScript strict.
4. Valider toutes les entrées serveur avec Zod.
5. Ne jamais faire confiance aux données du client.
6. Centraliser les permissions.
7. Centraliser les couleurs dans Tailwind/CSS variables.
8. Écrire des fonctions propres dans `lib`.
9. Garder le dashboard simple et très lisible.
10. Privilégier la clarté à la complexité.
11. Ne pas surcharger les animations.
12. Prévoir les états vides, erreurs, chargement et succès.
13. Prévoir une documentation `README.md` à la fin.

---

## 26. README final à produire

À la fin du développement, générer un README contenant :

- présentation du projet ;
- rôle de Digital Access ;
- stack technique ;
- installation ;
- variables d'environnement ;
- commandes ;
- rôles ;
- modules ;
- processus de soumission ;
- sécurité ;
- déploiement ;
- maintenance.

---

## 27. Évolutions futures à préparer

L'architecture doit permettre plus tard :

- espace membre pour jeunes adhérents ;
- module de cotisation ou adhésion en ligne ;
- espace e-learning pour formations diplomatiques ou citoyennes ;
- génération automatique de rapports d'activité ;
- newsletter ;
- PWA ;
- application mobile ;
- extension multi-sections/multi-pays ;
- tableau de bord stratégique avancé.

Ne pas tout développer maintenant sauf demande explicite, mais ne pas bloquer ces évolutions par une architecture trop rigide.

---

## 28. Priorités fonctionnelles

| Module | Priorité | Observation |
|---|---:|---|
| Site public institutionnel | 1 | Base de visibilité et crédibilité. |
| Actualités et activités | 1 | Valorisation continue des actions. |
| Départements et responsables | 1 | Structuration institutionnelle claire. |
| Centre des appels | 1 | Module stratégique pour appels à projets, candidatures et offres. |
| Dépôt de dossiers | 1 | Réception centralisée des pièces et formulaires. |
| Emails automatiques | 1 | Professionnalisation de la relation avec les candidats. |
| Tri rapide | 2 | Très utile dès que le volume augmente. |
| Présélection intelligente | 2 | Aide à l'analyse, sans décision automatique. |
| Statistiques avancées | 2 | Pilotage des appels, contenus et performances. |
| Espace membre / e-learning | Évolution | À envisager plus tard. |

---

## 29. Phrase d'identité proposée

Utiliser temporairement cette phrase dans le hero si aucun contenu officiel n'est encore fourni :

> OJID, une jeunesse engagée pour la diplomatie, la coopération et le leadership responsable.

---

## 30. Conclusion opérationnelle

Construire une plateforme complète, moderne et professionnelle qui démontre à la fois le sérieux institutionnel de l'OJID et la capacité technique de Digital Access - Web Access Solution.

Le résultat doit pouvoir servir :

- à l'OJID pour communiquer et gérer ses activités ;
- aux responsables pour piloter les départements et les dossiers ;
- aux candidats pour postuler facilement ;
- à Digital Access comme référence terrain et vitrine de compétence pour obtenir de nouveaux marchés.
