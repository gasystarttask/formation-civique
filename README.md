# Formation civique — fiches de révision

App Next.js (App Router, TypeScript, Tailwind CSS v4) qui reprend les
[fiches par journée](https://formation-civique.interieur.gouv.fr/fiches-par-journ%C3%A9e/)
de la formation civique (licence etalab-2.0) avec une navigation simplifiée,
dans le style du design system Untitled UI.

## Fonctionnalités

- Parcours Journée → thématique → thème → fiche, fil d'Ariane.
- Fiche : objectifs, contenu, « Pour aller plus loin », fiche précédente/suivante, sommaire du thème.
- Recherche instantanée (⌘K / Ctrl+K), insensible aux accents.
- Suivi de progression (« Marquer comme lue »), stocké dans le navigateur.
- Thème clair, sombre ou système (choix mémorisé, sans flash au chargement).
- Pages entièrement générées à la compilation (227 fiches + 4 journées + accueil).

## Commandes

```bash
npm install
npm run dev       # http://localhost:3000
npm run scrape    # re-télécharge le contenu -> src/data/content.json (cache : .cache/)
npm run build
```

Pour forcer un nouveau téléchargement, supprimez `.cache/` avant `npm run scrape`.

## Structure

- `scripts/scrape.mjs` : extraction et nettoyage du HTML du site officiel.
- `src/lib/content.ts` : modèle de données et index de recherche.
- `src/components/` : composants UI (Badge, FeaturedIcon, Breadcrumbs, boutons, recherche, progression).
- `src/app/globals.css` : tokens Untitled UI (couleurs, ombres) et style du contenu des fiches.

## Avis de fin de thématique

À la fin de la dernière fiche d'une thématique, un modal demande un avis anonyme
(pas satisfait / mitigé / satisfait). Il ne s'affiche qu'une fois par thématique.

- `POST /api/feedback` `{ "topic": "journee-1/section/thematique", "rating": "triste" | "mitige" | "content" }`
- `GET /api/feedback` : totaux par thématique.

Stockage : [Upstash Redis](https://upstash.com/), un seul hash `feedback`
(champs `thématique|avis` et `_quota:AAAA-MM`).

Pensé pour l'offre gratuite Upstash (500 000 commandes / mois, 256 Mo) :

- 2 commandes par avis (pipeline) ; lecture des totaux : 1 commande, en cache 1 h ;
- plafond `FEEDBACK_MONTHLY_LIMIT` (150 000 avis = 300 000 commandes par défaut) :
  au-delà, les avis sont ignorés (réponse 202) jusqu'au mois suivant ;
- 40 avis max par IP et par heure (en mémoire, sans commande Redis) ;
- un avis par thématique et par navigateur ; données : quelques Ko.
Sur Vercel : **Storage → Marketplace → Upstash Redis → Connect Project** ; les variables
`KV_REST_API_URL` / `KV_REST_API_TOKEN` sont créées automatiquement. En local, copiez
`.env.example` en `.env.local` ; sans variables, les avis sont gardés en mémoire.

## Déploiement (Vercel + GitHub Actions)

`.github/workflows/deploy.yml` : push sur `main` -> production
(https://formation-civique.rrahajason.space), pull request -> preview.
Le déploiement Git automatique de Vercel est désactivé (`vercel.json`) pour éviter les doublons.

Mise en place (une fois) :

1. `npx vercel link` (crée `.vercel/project.json` avec `orgId` et `projectId`).
2. Créer un token : https://vercel.com/account/tokens
3. Secrets GitHub : `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
4. Domaine : Vercel -> projet -> Settings -> Domains -> `formation-civique.rrahajason.space`,
   puis chez le registrar DNS de `rrahajason.space` : enregistrement `CNAME formation-civique`
   vers la valeur indiquée par Vercel.
5. Variables Upstash : voir « Avis de fin de thématique ».

## Licence

- Code : [MIT](LICENSE).
- Contenu des fiches (`src/data/content.json`) : © ministère de l'Intérieur, [Licence Ouverte etalab-2.0](https://www.etalab.gouv.fr/licence-ouverte-open-licence/). La licence MIT ne s'applique pas à ce contenu.
