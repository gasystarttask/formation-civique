/** Partagé client / serveur : valeurs possibles d'un avis de fin de thématique. */
export const RATINGS = ["triste", "mitige", "content"] as const;
export type Rating = (typeof RATINGS)[number];

export const isRating = (v: unknown): v is Rating => RATINGS.includes(v as Rating);

/** Identifiant stable d'une thématique : "journee-1/section/topic". */
export const topicKey = (day: string, section: string, topic: string) => `${day}/${section}/${topic}`;
