import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { Redis } from "@upstash/redis";
import { days } from "@/lib/content";
import { isRating, RATINGS, topicKey, type Rating } from "@/lib/feedback";

/**
 * Avis de fin de thématique, stockés dans Upstash Redis (intégration Vercel Marketplace).
 *
 * Conçu pour rester dans l'offre gratuite Upstash (500 000 commandes / mois, 256 Mo) :
 * - 2 commandes Redis par avis (pipeline : l'avis + le compteur du mois) ;
 * - plafond mensuel (FEEDBACK_MONTHLY_LIMIT, 150 000 avis = 300 000 commandes par défaut) :
 *   au-delà, chaque instance cesse d'écrire jusqu'au mois suivant ;
 * - limitation par IP en mémoire (aucune commande Redis) ;
 * - lecture des totaux : 1 commande, mise en cache 1 h ;
 * - données : un seul hash de quelques centaines de champs (quelques Ko).
 *
 * Variables : UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * (ou KV_REST_API_URL / KV_REST_API_TOKEN, créées par l'intégration Vercel).
 * Sans ces variables (dev local), les avis sont gardés en mémoire.
 */

const HASH = "feedback";
const MONTHLY_LIMIT = Number(process.env.FEEDBACK_MONTHLY_LIMIT) || 150_000;

/** Par IP et par instance : nombre d'avis max sur la fenêtre (≈ nombre de thématiques). */
const IP_LIMIT = 40;
const IP_WINDOW_MS = 60 * 60 * 1000;

const topics = new Map(
  days.flatMap((d) =>
    d.sections.flatMap((s) => s.topics.map((t) => [topicKey(d.slug, s.slug, t.slug), t.title] as const)),
  ),
);

const configured = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
);
const redis = configured ? Redis.fromEnv({ enableTelemetry: false }) : null;

/**
 * Mois pour lequel cette instance sait déjà que le plafond est atteint :
 * plus aucune commande Redis n'est envoyée jusqu'au mois suivant.
 */
let fullMonth: string | null = null;

/** Repli en mémoire pour le développement local. */
const memory = new Map<string, number>();

/** Limitation par IP, en mémoire (gratuit, approximatif sur plusieurs instances). */
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 10_000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + IP_WINDOW_MS });
    return false;
  }
  return ++h.count > IP_LIMIT;
}

const month = () => `_quota:${new Date().toISOString().slice(0, 7)}`;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(ip)) return Response.json({ error: "Trop d'avis envoyés" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }
  const { topic, rating } = (body ?? {}) as { topic?: unknown; rating?: unknown };
  if (typeof topic !== "string" || !topics.has(topic) || !isRating(rating)) {
    return Response.json({ error: "Thématique ou avis invalide" }, { status: 400 });
  }

  const field = `${topic}|${rating}`;
  let stored: boolean;
  try {
    if (redis) {
      if (fullMonth === month()) {
        stored = false;
      } else {
        // 2 commandes : l'avis + le compteur du mois (qui sert de garde-fou)
        const [, used] = await redis.pipeline().hincrby(HASH, field, 1).hincrby(HASH, month(), 1).exec<[number, number]>();
        stored = true;
        if (used >= MONTHLY_LIMIT) fullMonth = month();
      }
    } else {
      const used = memory.get(month()) ?? 0;
      stored = used < MONTHLY_LIMIT;
      if (stored) {
        memory.set(field, (memory.get(field) ?? 0) + 1);
        memory.set(month(), used + 1);
      }
    }
  } catch (e) {
    console.error("[feedback] enregistrement impossible", e);
    return Response.json({ error: "Enregistrement impossible" }, { status: 503 });
  }
  // Plafond atteint : on remercie quand même le lecteur, l'avis n'est pas conservé.
  return Response.json({ ok: true, stored }, { status: stored ? 201 : 202 });
}

/** Totaux bruts : 1 commande Redis, mise en cache 1 h. */
async function readAll(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("hours");
  if (!redis) return Object.fromEntries(memory);
  return (await redis.hgetall<Record<string, number>>(HASH)) ?? {};
}

/** Totaux par thématique (comptes anonymes, mis à jour au plus toutes les heures). */
export async function GET() {
  await connection(); // jamais prérendu au build
  const all = redis ? await readAll() : Object.fromEntries(memory);

  const results = [...topics]
    .map(([key, title]) => {
      const counts = Object.fromEntries(RATINGS.map((r) => [r, Number(all[`${key}|${r}`] ?? 0)])) as Record<
        Rating,
        number
      >;
      return { topic: key, title, ...counts, total: counts.triste + counts.mitige + counts.content };
    })
    .filter((r) => r.total > 0);

  return Response.json({
    storage: redis ? "upstash" : "memory",
    quota: { month: month().slice(7), used: Number(all[month()] ?? 0), limit: MONTHLY_LIMIT },
    results,
  });
}
