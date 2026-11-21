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

## Licence

- Code : [MIT](LICENSE).
- Contenu des fiches (`src/data/content.json`) : © ministère de l'Intérieur, [Licence Ouverte etalab-2.0](https://www.etalab.gouv.fr/licence-ouverte-open-licence/). La licence MIT ne s'applique pas à ce contenu.
