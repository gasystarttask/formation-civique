/**
 * Fiche récapitulative « Frise chronologique » de la thématique
 * « Les régimes politiques depuis 1789 » (Journée 2).
 *
 * Ce n'est PAS une fiche officielle : elle est rédigée à partir des 15 fiches
 * officielles de la thématique. Chaque date et chaque fait provient de la fiche
 * indiquée par `ficheId` (aucune information extérieure n'est ajoutée).
 */

export type RegimeKind = "monarchie" | "republique" | "empire" | "transition" | "autoritaire";

export const regimeKinds: Record<RegimeKind, string> = {
  monarchie: "Monarchie",
  transition: "Révolution / transition",
  republique: "République",
  empire: "Consulat / Empire",
  autoritaire: "Régime autoritaire",
};

export type FriseEvent = { date: string; text: string };

export type FrisePeriod = {
  /** Ancre dans la page */
  slug: string;
  dates: string;
  title: string;
  kind: RegimeKind;
  /** Fiche officielle d'où proviennent les informations */
  ficheId: string;
  events: FriseEvent[];
  people?: string;
  legacy?: string;
};

/** Bandeau proportionnel depuis 1789 (périodes de la fiche « Les régimes politiques »). */
export type FriseSegment = { from: number; to: number | null; label: string; kind: RegimeKind; slug: string };

export const friseSegments: FriseSegment[] = [
  { from: 1789, to: 1791, label: "Révolution française", kind: "transition", slug: "1789-1792" },
  { from: 1791, to: 1792, label: "Monarchie constitutionnelle", kind: "monarchie", slug: "1789-1792" },
  { from: 1792, to: 1799, label: "Ière République", kind: "republique", slug: "1792-1804" },
  { from: 1799, to: 1804, label: "Consulat", kind: "empire", slug: "1799-1804" },
  { from: 1804, to: 1814, label: "1er Empire", kind: "empire", slug: "1804-1815" },
  { from: 1814, to: 1830, label: "Restauration", kind: "monarchie", slug: "1815-1848" },
  { from: 1830, to: 1848, label: "Monarchie de Juillet", kind: "monarchie", slug: "1815-1848" },
  { from: 1848, to: 1851, label: "IIème République", kind: "republique", slug: "1848-1851" },
  { from: 1852, to: 1870, label: "2nd Empire", kind: "empire", slug: "1852-1870" },
  { from: 1870, to: 1940, label: "IIIème République", kind: "republique", slug: "1870-1940" },
  { from: 1940, to: 1944, label: "Régime de Vichy", kind: "autoritaire", slug: "1940-1944" },
  { from: 1944, to: 1946, label: "Gouvernement provisoire", kind: "transition", slug: "1944-1946" },
  { from: 1946, to: 1958, label: "IVème République", kind: "republique", slug: "1946-1958" },
  { from: 1958, to: null, label: "Vème République", kind: "republique", slug: "1958" },
];

export const frisePeriods: FrisePeriod[] = [
  {
    slug: "ve-xvie-siecle",
    dates: "Vème – XVIème siècle",
    title: "Des Mérovingiens à l’Ancien Régime",
    kind: "monarchie",
    ficheId: "des-merovingiens-a-l-ancien-regime",
    events: [
      { date: "52 av. J.-C.", text: "Conquise par Jules César, la Gaule devient une province romaine jusqu’au Vème siècle." },
      { date: "481-751", text: "Dynastie mérovingienne : Clovis, roi des Francs, la fonde et se convertit au christianisme." },
      { date: "751-987", text: "Dynastie carolingienne : Charlemagne est couronné empereur en 800." },
      { date: "987", text: "Hugues Capet est sacré roi et fonde la dynastie des Capétiens (987-1789)." },
      { date: "1337", text: "Début de la guerre de Cent Ans, qui contribue à éveiller un sentiment d’unité nationale." },
      { date: "XVIème siècle", text: "Renaissance : la France devient un État centralisé et puissant." },
    ],
    people: "Clovis, Charlemagne, Hugues Capet",
    legacy: "Début de la construction territoriale ; organisation en fiefs, à l’origine du système administratif actuel.",
  },
  {
    slug: "ancien-regime",
    dates: "Fin du XVIème siècle – 1789",
    title: "L’Ancien Régime",
    kind: "monarchie",
    ficheId: "l-ancien-regime-jusqu-en-1789",
    events: [
      { date: "Jusqu’en 1789", text: "Monarchie absolue de droit divin : le roi a tous les pouvoirs." },
      { date: "Société", text: "Trois ordres : clergé, noblesse et tiers état (90 % de la population, sans privilège)." },
    ],
    people: "Louis XIV, le Roi-Soleil",
    legacy: "La centralisation du pouvoir.",
  },
  {
    slug: "1789-1792",
    dates: "1789 – 1792",
    title: "La fin de la monarchie absolue",
    kind: "transition",
    ficheId: "la-fin-de-la-monarchie-absolue-et-le-debut-de-la-iere-republique-1789-1792",
    events: [
      { date: "17 juin 1789", text: "Le tiers état proclame l’Assemblée nationale : fin de la monarchie absolue." },
      { date: "1789", text: "Adoption de la Déclaration des droits de l’homme et du citoyen." },
      { date: "1791", text: "Monarchie constitutionnelle : les pouvoirs du roi sont limités." },
      { date: "10 août 1792", text: "Le roi Louis XVI est renversé." },
    ],
    people: "Le marquis de La Fayette",
    legacy: "Fin des privilèges et de la société d’ordres ; premier droit de vote (hommes de plus de 25 ans payant un impôt).",
  },
  {
    slug: "1792-1804",
    dates: "1792 – 1804",
    title: "La Ière République",
    kind: "republique",
    ficheId: "la-premiere-republique-1792-1804",
    events: [
      { date: "22 septembre 1792", text: "Proclamation de la Ière République." },
      { date: "1793", text: "Exécution de Louis XVI, pendant la Terreur." },
      { date: "18 mai 1804", text: "La Ière République disparaît : Napoléon est proclamé empereur." },
    ],
    people: "Maximilien Robespierre",
    legacy: "Création des départements ; séparation progressive de l’Église et de l’État, qui annonce la laïcité.",
  },
  {
    slug: "1799-1804",
    dates: "1799 – 1804",
    title: "Le Consulat",
    kind: "empire",
    ficheId: "le-consulat-1799-1804",
    events: [
      { date: "13 décembre 1799", text: "Le Consulat est établi après le coup d’État de Napoléon Bonaparte, Premier Consul." },
      { date: "1800", text: "Création du préfet, qui dirige chaque département." },
      { date: "18 mai 1804", text: "Fin du Consulat : Napoléon proclame le Premier Empire." },
    ],
    people: "Napoléon Bonaparte, Premier Consul",
    legacy: "Une administration centralisée, dont le système actuel est l’héritier.",
  },
  {
    slug: "1804-1815",
    dates: "1804 – 1815",
    title: "Le 1er Empire",
    kind: "empire",
    ficheId: "le-1er-empire-1804-1815",
    events: [
      { date: "1802", text: "Napoléon rétablit l’esclavage." },
      { date: "18 mai 1804", text: "Napoléon est nommé empereur." },
      { date: "1804", text: "Le Code civil garantit l’égalité devant la loi." },
      { date: "1812", text: "Défaite en Russie." },
      { date: "1814", text: "L’empereur abdique une première fois." },
      { date: "1815", text: "Abolition de la traite des noirs." },
      { date: "7 juillet 1815", text: "Abdication définitive après la bataille de Waterloo." },
    ],
    people: "Napoléon 1er",
    legacy: "Le Code civil, le lycée et le baccalauréat.",
  },
  {
    slug: "1815-1848",
    dates: "1815 – 1848",
    title: "La Restauration et la Monarchie de Juillet",
    kind: "monarchie",
    ficheId: "la-restauration-et-la-monarchie-de-juillet-1815-1848",
    events: [
      { date: "1814", text: "Charte constitutionnelle de Louis XVIII." },
      { date: "7 juillet 1815", text: "Retour de la monarchie : la Restauration (1815-1830)." },
      { date: "2 août 1830", text: "Après une révolution à Paris, Charles X abdique : fin de la Restauration." },
      { date: "9 août 1830", text: "Louis-Philippe devient roi des Français : Monarchie de Juillet." },
      { date: "24 février 1848", text: "Une nouvelle révolution met fin au régime." },
    ],
    people: "Louis XVIII, Louis-Philippe",
    legacy: "Un Parlement à deux chambres : début de la séparation des pouvoirs et de la démocratie représentative.",
  },
  {
    slug: "1848-1851",
    dates: "1848 – 1851",
    title: "La IIème République",
    kind: "republique",
    ficheId: "la-deuxieme-republique-1848-1851",
    events: [
      { date: "24 février 1848", text: "Proclamation de la IIème République." },
      { date: "27 avril 1848", text: "Abolition définitive de l’esclavage (décret rédigé par Victor Schœlcher)." },
      { date: "1848", text: "Suffrage universel masculin (hommes d’au moins 21 ans) ; Louis-Napoléon Bonaparte est élu président." },
      { date: "2 décembre 1851", text: "Coup d’État de Louis-Napoléon : fin de la IIème République." },
    ],
    people: "Louis-Napoléon Bonaparte",
    legacy: "Le suffrage universel masculin ; suppression de la peine de mort pour les délits politiques.",
  },
  {
    slug: "1852-1870",
    dates: "1852 – 1870",
    title: "Le 2nd Empire",
    kind: "empire",
    ficheId: "le-2nd-empire-1852-1870",
    events: [
      { date: "2 décembre 1852", text: "Louis-Napoléon Bonaparte devient empereur sous le nom de Napoléon III." },
      { date: "Années 1860", text: "Le régime se libéralise." },
      { date: "1864", text: "Le droit de grève est partiellement autorisé." },
      { date: "4 septembre 1870", text: "Fin du Second Empire, après la défaite contre la Prusse." },
    ],
    people: "Napoléon III",
    legacy: "Renforcement progressif des droits du Parlement.",
  },
  {
    slug: "1870-1940",
    dates: "1870 – 1940",
    title: "La IIIème République",
    kind: "republique",
    ficheId: "la-troisieme-republique-1870-1940",
    events: [
      { date: "4 septembre 1870", text: "Léon Gambetta proclame la IIIème République." },
      { date: "1871", text: "Insurrection de la Commune de Paris." },
      { date: "1875", text: "Les lois constitutionnelles installent durablement la République." },
      { date: "1881 – 1882", text: "Lois Jules Ferry : école publique gratuite, puis laïque et obligatoire." },
      { date: "5 avril 1884", text: "Les citoyens masculins élisent leur conseil municipal." },
      { date: "1905", text: "Loi de séparation des Églises et de l’État, qui fonde la laïcité." },
      { date: "10 juillet 1940", text: "Fin de la IIIème République : le régime de Vichy s’installe." },
    ],
    people: "16 présidents de la République",
    legacy: "Une démocratie parlementaire stable : un président, deux chambres, un Gouvernement responsable.",
  },
  {
    slug: "1940-1944",
    dates: "1940 – 1944",
    title: "Le régime de Vichy",
    kind: "autoritaire",
    ficheId: "le-regime-de-vichy-1940-1944",
    events: [
      { date: "10 juillet 1940", text: "Régime dirigé par le maréchal Pétain : la République est abolie, le régime est autoritaire et collaborationniste." },
      { date: "1940 – 1944", text: "Libertés supprimées ; persécution des opposants et des minorités, en particulier des Juifs." },
      { date: "22 août 1944", text: "Fin du régime avec la Libération." },
    ],
    people: "Le maréchal Philippe Pétain",
    legacy: "Aucun apport positif : une rupture avec les valeurs démocratiques et républicaines.",
  },
  {
    slug: "1944-1946",
    dates: "1944 – 1946",
    title: "Le Gouvernement provisoire de la République française",
    kind: "transition",
    ficheId: "le-gouvernement-provisoire-de-la-republique-francaise-1944-1946",
    events: [
      { date: "21 avril 1944", text: "Le droit de vote est accordé aux femmes." },
      { date: "25 août 1944", text: "Le GPRF est mis en place pour rétablir la République." },
      { date: "1944 – 1946", text: "Reconstruction, nationalisations, préparation de la sécurité sociale." },
      { date: "27 octobre 1946", text: "Fin du GPRF : début de la IVème République." },
    ],
    people: "Le général Charles de Gaulle",
    legacy: "Restauration de la légitimité républicaine et continuité de l’État.",
  },
  {
    slug: "1946-1958",
    dates: "1946 – 1958",
    title: "La IVème République",
    kind: "republique",
    ficheId: "la-quatrieme-republique-1946-1958",
    events: [
      { date: "27 octobre 1946", text: "Nouvelle Constitution : elle garantit pour la première fois l’égalité entre les femmes et les hommes." },
      { date: "1946 – 1958", text: "Instabilité gouvernementale ; développement de la sécurité sociale." },
      { date: "4 octobre 1958", text: "Le régime s’effondre, en pleine guerre d’Algérie." },
    ],
    people: "Vincent Auriol, René Coty",
    legacy: "Les bases de l’État-providence : sécurité sociale et services publics.",
  },
  {
    slug: "1958",
    dates: "Depuis 1958",
    title: "La Vème République",
    kind: "republique",
    ficheId: "la-cinquieme-republique",
    events: [
      { date: "Septembre 1958", text: "La nouvelle Constitution est adoptée par référendum." },
      { date: "4 octobre 1958", text: "Instauration de la Vème République." },
      { date: "1959 – 1969", text: "Charles de Gaulle, premier président de la Vème République." },
      { date: "1974", text: "Droit de vote dès 18 ans (contre 21 ans auparavant)." },
    ],
    people: "Charles de Gaulle, Georges Pompidou, François Mitterrand…",
    legacy: "Un exécutif fort, la stabilité gouvernementale et le Conseil constitutionnel.",
  },
];

export const FRISE_ID = "frise-chronologique-des-regimes-politiques";

/** Texte brut de la frise (recherche, durée de lecture). */
export const friseText = frisePeriods
  .flatMap((p) => [p.dates, p.title, ...p.events.map((e) => `${e.date} ${e.text}`), p.people ?? "", p.legacy ?? ""])
  .join(" ");
