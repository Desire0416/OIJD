# Plateforme institutionnelle OIJD — Section CIV

Plateforme web institutionnelle complète, évolutive et sécurisée de l'**OIJD — Organisation
Internationale de la Jeunesse Diplomatique, Section CIV** : site public, espace privé
sécurisé, départements, actualités, activités, **centre des appels et opportunités**,
dépôt de dossiers en ligne, tri rapide, **présélection intelligente** (scoring), emails
automatiques et notifications internes.

> **Conception et réalisation : Digital Access — Web Access Solution**
> (cadrage, design, développement, déploiement, formation et accompagnement).

> **Note sur le sigle :** le logo officiel et le nom complet (Organisation **I**nternationale
> de la **J**eunesse **D**iplomatique) donnent **OIJD** — sigle retenu dans toute la
> plateforme. Le cahier des charges écrivait parfois « OJID » (coquille).

---

## 1. Présentation

Le projet va au-delà d'un site vitrine : c'est un véritable système numérique institutionnel
permettant de présenter l'organisation, publier ses actualités, valoriser ses activités, gérer
ses départements, publier des appels (projets, candidatures, offres, concours, stages,
volontariats, programmes…), recevoir les dossiers en ligne, les trier rapidement et accompagner
la décision par une présélection intelligente — **la décision finale restant toujours humaine**.

## 2. Rôle de Digital Access — Web Access Solution

Digital Access est la structure conceptrice et réalisatrice (maître d'œuvre technique). Sa
contribution est visible de façon discrète mais claire : pied de page public, page dédiée
`/conception-realisation`, pied de l'espace privé, page de connexion, et ligne technique des
emails. L'identité institutionnelle reste celle de l'OIJD.

## 3. Stack technique

| Composant      | Choix                                                        |
| -------------- | ------------------------------------------------------------ |
| Framework      | **Next.js 15** (App Router) + React 19 + TypeScript (strict) |
| Base de données| **PostgreSQL (Neon)** — pooler runtime + `directUrl` migrations |
| ORM            | **Prisma**                                                   |
| Design         | **Tailwind CSS** (charte OIJD) + **Framer Motion**           |
| Icônes         | lucide-react                                                 |
| Validation     | **Zod** (systématique côté serveur)                          |
| Authentification | Système custom : **bcrypt** + session **JWT** (cookie HTTPOnly), RBAC |
| Emails         | Abstraction `lib/email.ts` (provider `log` en dev, SMTP/Resend en prod) |
| Fichiers       | Stockage local sécurisé (hors dossier public), abstraction S3-ready |

### Charte graphique (issue du logo)

Vert institutionnel `#00860B`, vert profond `#24752D`, orange diplomatique `#FC5D01`, orange
flamme `#FB8204`, gris clair `#EBECEB`, bleu-gris `#719D96`, violet Digital Access `#6F2DBD`
(réservé aux mentions Digital Access). Titres **Montserrat**, textes **Inter**. Animations
sobres, respectant `prefers-reduced-motion`.

## 4. Installation

```bash
npm install                 # dépendances + prisma generate (postinstall)
npm run db:push             # crée le schéma SQLite (prisma/dev.db)
npm run db:seed             # données de démonstration (voir §10)
npm run dev                 # http://localhost:3000
```

> Node 18.18+ requis (testé sur Node 24). `legacy-peer-deps` peut être utile selon l'environnement.

## 5. Variables d'environnement

Voir `.env` (dev) et `.env.example`. Principales clés :

```env
DATABASE_URL="file:./dev.db"     # SQLite (dev) — PostgreSQL en prod
APP_URL="http://localhost:3000"
AUTH_SECRET="..."                # À CHANGER en production (chaîne aléatoire longue)
SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
EMAIL_PROVIDER="log"             # log | smtp | resend
STORAGE_PROVIDER="local"         # local | s3
MAX_UPLOAD_MB="10"
ENABLE_SMART_SCORING="true"
SMART_SCORING_THRESHOLD="30"     # seuil d'affichage des dossiers recommandés
```

## 6. Commandes

```bash
npm run dev        # serveur de développement
npm run build      # build de production (prisma generate + next build)
npm run start      # serveur de production
npm run lint       # ESLint
npm run db:push    # synchronise le schéma Prisma (SQLite)
npm run db:seed    # (re)charge les données de démonstration
npm run db:studio  # explorateur de base Prisma Studio
```

## 7. Comptes de démonstration

| Rôle          | Email                  | Mot de passe       |
| ------------- | ---------------------- | ------------------ |
| Super admin   | `admin@oijd-civ.org`   | `Admin@OIJD2026`   |

D'autres comptes (responsable communication, RH, appels, départements…) sont créés par le seed.
**Changez tous les mots de passe en production.**

## 8. Rôles & permissions (RBAC)

`SUPER_ADMIN`, `ADMIN_GENERAL`, `PRESIDENT`, `DEPARTMENT_HEAD`, `COMMUNICATION_MANAGER`,
`HR_MANAGER`, `CALLS_MANAGER`, `EDITOR`, `VALIDATOR`, `INTERNAL_READER`, `TECH_SUPPORT`.

Les capacités sont centralisées dans [`lib/permissions.ts`](lib/permissions.ts). Les responsables
de département (et lecteurs internes) sont restreints au périmètre de leur département.

## 9. Modules

**Espace public** : Accueil, À propos, Organisation, Responsables, Départements (+ détail),
Actualités (+ détail), Activités (+ détail), **Centre des appels** (+ filtres + détail +
soumission), Partenaires, Contact, page Digital Access.

**Espace privé** (`/dashboard`) : Tableau de bord, Dossiers (tri + présélection), fiche
d'analyse, Appels (CRUD), Actualités (CRUD), Activités (CRUD), Départements, Partenaires,
Utilisateurs & rôles, Documents, Emails (modèles + journal), Notifications, Statistiques,
Journal d'audit, Paramètres.

## 10. Processus de soumission d'un dossier

1. Le visiteur ouvre un appel publié et consulte les détails.
2. Il remplit le **formulaire dynamique** (adapté au type : candidature, projet, offre, concours)
   et téléverse les pièces (PDF/DOC/DOCX/PNG/JPG, ≤ `MAX_UPLOAD_MB`).
3. À la soumission : enregistrement du dossier + documents, **calcul du score de compatibilité**
   ([`lib/scoring.ts`](lib/scoring.ts)), statut initial, **email de confirmation** au candidat,
   **notification interne** au service concerné, journalisation.
4. Côté interne : tri/filtre, **dossiers recommandés** dès `SMART_SCORING_THRESHOLD` dossiers,
   fiche d'analyse (score, critères remplis/manquants, notes internes, historique), changement
   de statut avec email automatique optionnel. **La décision finale est toujours validée par un
   utilisateur habilité — aucun rejet automatique.**

## 11. Sécurité

- Mots de passe hachés (bcrypt), session JWT en cookie **HTTPOnly**, routes `/dashboard`
  protégées par middleware + double contrôle de capacité côté serveur.
- Validation **Zod** systématique côté serveur, honeypot anti-spam sur les formulaires publics.
- Documents stockés **hors du dossier public**, servis via route protégée
  (`/api/uploads/[id]`) avec contrôle d'accès et journalisation des téléchargements.
- **Journal d'audit** des actions sensibles ; confidentialité des dossiers par périmètre.

## 12. Déploiement (Vercel + Neon + Vercel Blob)

La base **PostgreSQL (Neon)** et le stockage **Vercel Blob** sont déjà câblés.

1. **Importer le dépôt GitHub sur Vercel** (New Project → Import). Framework détecté :
   Next.js. Build command par défaut (`npm run build` = `prisma generate && next build`).
2. **Variables d'environnement Vercel** (Settings → Environment Variables) :

   | Variable | Valeur |
   | --- | --- |
   | `DATABASE_URL` | URL Neon **poolée** (`...-pooler...?sslmode=require&pgbouncer=true`) |
   | `DIRECT_URL` | URL Neon **directe** (`...?sslmode=require`) |
   | `AUTH_SECRET` | chaîne aléatoire longue |
   | `APP_URL` | `https://<projet>.vercel.app` |
   | `STORAGE_PROVIDER` | `vercel-blob` |
   | `EMAIL_PROVIDER` | `log` (ou `smtp`/`resend` + clés) |
   | `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | identifiants admin |

3. **Connecter Vercel Blob** : Storage → Create/Connect Blob Store → lier au projet.
   `BLOB_READ_WRITE_TOKEN` est injecté automatiquement (uploads opérationnels).
4. **Base de données** : le schéma est déjà appliqué (`prisma db push`) et seedé sur Neon.
   Pour resynchroniser après une évolution du schéma : `npx prisma db push` (avec `DIRECT_URL`).
5. Déployer. Configurer ensuite domaine et sauvegardes Neon.

> Mots de passe de démonstration à changer en production (cf. §7).

## 13. Maintenance & évolutions

Mises à jour de sécurité, sauvegardes, surveillance des formulaires/emails, corrections.
Architecture prête pour : espace membre, cotisations en ligne, e-learning, newsletters, PWA,
extension multi-sections / multi-pays, tableau de bord stratégique avancé.

---

*Plateforme conçue et réalisée par **Digital Access — Web Access Solution** pour l'OIJD —
Section CIV.*
