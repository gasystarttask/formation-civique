import data from "@/data/content.json";

export type Resource = { label: string; href: string };

export type Fiche = {
  id: string;
  title: string;
  description?: string;
  source: string;
  /** Titre de l'encadré tel que la source ("Objectif de la fiche" / "Objectifs de la fiche") */
  objectivesTitle?: string;
  objectives: string[];
  resources: Resource[];
  html: string;
};

type RawNode = {
  title: string;
  description?: string;
  ficheId?: string;
  children?: RawNode[];
};

export type FicheRef = { id: string; title: string; description?: string };
export type Topic = { slug: string; title: string; description?: string; fiches: FicheRef[] };
export type Section = { slug: string; title: string; description?: string; topics: Topic[] };
export type Day = {
  slug: string;
  number: number;
  title: string;
  /** Journée sans fiches (texte simple) */
  intro?: Fiche;
  /** Résumé de l'intro (premier paragraphe + première liste), en texte brut */
  introSummary?: { lead: string; items: string[] };
  sections: Section[];
  ficheIds: string[];
};

/** Position d'une fiche dans le parcours (première occurrence). */
export type FicheContext = { day: Day; section: Section; topic: Topic; index: number };

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const fiches = data.fiches as Record<string, Fiche>;

/** HTML -> texte brut (entités courantes décodées). */
const toText = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const toRef = (n: RawNode): FicheRef => ({
  id: n.ficheId!,
  title: fiches[n.ficheId!].title,
  description: n.description,
});

export const days: Day[] = (data.days as (RawNode & { slug: string })[]).map((d, i) => {
  if (d.ficheId) {
    const intro = fiches[d.ficheId];
    const introSummary = {
      lead: toText(intro.html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? ""),
      items: [...(intro.html.match(/<ul>([\s\S]*?)<\/ul>/)?.[1] ?? "").matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) =>
        toText(m[1]),
      ),
    };
    return { slug: d.slug, number: i + 1, title: d.title, intro, introSummary, sections: [], ficheIds: [] };
  }
  const sections: Section[] = (d.children ?? []).map((s) => ({
    slug: slugify(s.title),
    title: s.title,
    description: s.description,
    topics: (s.children ?? []).map((t) => ({
      slug: slugify(t.title),
      title: t.title,
      description: t.description,
      // Un sous-thème peut directement être une fiche
      fiches: t.ficheId ? [toRef(t)] : (t.children ?? []).filter((f) => f.ficheId).map(toRef),
    })),
  }));
  const ficheIds = sections.flatMap((s) => s.topics.flatMap((t) => t.fiches.map((f) => f.id)));
  return { slug: d.slug, number: i + 1, title: d.title, sections, ficheIds };
});

/** Parcours linéaire de toutes les fiches, dédoublonné. */
const order: FicheContext[] = [];
const contextById = new Map<string, FicheContext>();
for (const day of days)
  for (const section of day.sections)
    for (const topic of section.topics)
      topic.fiches.forEach((f, index) => {
        if (contextById.has(f.id)) return;
        const ctx = { day, section, topic, index };
        contextById.set(f.id, ctx);
        order.push(ctx);
      });

export const getDay = (slug: string) => days.find((d) => d.slug === slug);
export const getFiche = (id: string): Fiche | undefined => fiches[id];
export const getContext = (id: string) => contextById.get(id);
export const allFicheIds = order.map((c) => c.topic.fiches[c.index].id);

export function getNeighbours(id: string) {
  const i = allFicheIds.indexOf(id);
  const ref = (j: number) => {
    const c = order[j];
    return c ? c.topic.fiches[c.index] : undefined;
  };
  return { prev: ref(i - 1), next: ref(i + 1) };
}

export type SearchEntry = { id: string; title: string; description?: string; path: string };

export const searchIndex: SearchEntry[] = order.map((c) => {
  const f = c.topic.fiches[c.index];
  return {
    id: f.id,
    title: f.title,
    description: f.description,
    path: `Journée ${c.day.number} · ${c.topic.title}`,
  };
});

export const meta = { source: data.source, scrapedAt: data.scrapedAt };
