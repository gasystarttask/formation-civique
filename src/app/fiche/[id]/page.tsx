import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/skeleton";
import { ArrowLeft, ArrowRight, LinkExternal01, Target04 } from "@untitledui/icons";
import { AutoMarkRead, Progress, ReadMarker, ReadToggle } from "@/components/progress";
import { Badge, Breadcrumbs, cx, FeaturedIcon, ReadingTime } from "@/components/ui";
import { allFicheIds, getContext, getFiche, getNeighbours, meta, readingMinutes } from "@/lib/content";
import { Frise } from "@/components/frise";

type Props = { params: Promise<{ id: string }> };

export const generateStaticParams = () => allFicheIds.map((id) => ({ id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fiche = getFiche((await params).id);
  return { title: fiche?.title, description: fiche?.description };
}

export default function FichePage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FicheContent params={params} />
    </Suspense>
  );
}

async function FicheContent({ params }: Props) {
  const { id } = await params;
  const fiche = getFiche(id);
  const ctx = getContext(id);
  if (!fiche || !ctx) notFound();
  const { day, section, topic, index } = ctx;
  const { prev, next } = getNeighbours(id);
  const dayHref = `/journee/${day.slug}`;
  const topicHref = `${dayHref}#${section.slug}--${topic.slug}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: day.title, href: dayHref },
          { label: section.title, href: `${dayHref}#${section.slug}` },
          { label: topic.title, href: topicHref },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <article className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="brand">{topic.title}</Badge>
            <Badge>
              Fiche {index + 1} sur {topic.fiches.length}
            </Badge>
            <ReadingTime minutes={readingMinutes(fiche)} />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">{fiche.title}</h1>
          {fiche.description && <p className="mt-3 text-lg text-gray-600">{fiche.description}</p>}
          {fiche.kind === "frise" && (
            <p className="mt-3 text-sm text-gray-500">
              Fiche récapitulative réalisée à partir des {topic.fiches.length - 1} fiches officielles de la thématique.
            </p>
          )}

          {fiche.objectives.length > 0 && (
            <section className="mt-8 flex gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <FeaturedIcon icon={Target04} size="md" />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {fiche.objectivesTitle ??
                    (fiche.objectives.length > 1 ? "Objectifs de la fiche" : "Objectif de la fiche")}
                </h2>
                <ul className="mt-2 space-y-1 text-gray-600">
                  {fiche.objectives.map((o) => (
                    <li key={o} className="flex gap-2">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {fiche.kind === "frise" ? (
            <Frise
              numbers={Object.fromEntries(topic.fiches.map((f, i) => [f.id, i + 1]))}
              end={new Date(meta.scrapedAt).getFullYear()}
            />
          ) : (
            <div className="fiche mt-10" dangerouslySetInnerHTML={{ __html: fiche.html }} />
          )}

          {fiche.resources.length > 0 && (
            <section className="mt-12 rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900">Pour aller plus loin</h2>
              <ul className="mt-3 space-y-2">
                {fiche.resources.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 text-sm font-medium text-brand-700 hover:text-brand-800"
                    >
                      <LinkExternal01 className="mt-0.5 size-4 shrink-0" aria-hidden />
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <AutoMarkRead id={fiche.id} />
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
            <ReadToggle id={fiche.id} />
            <a
              href={fiche.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {fiche.kind === "frise" ? "Voir la thématique officielle" : "Voir la fiche officielle"}
              <LinkExternal01 className="size-4" aria-hidden />
            </a>
          </div>

          <nav aria-label="Fiches précédente et suivante" className="mt-8 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <PagerLink href={`/fiche/${prev.id}`} label="Précédente" title={prev.title} dir="prev" />
            ) : (
              <span />
            )}
            {next && <PagerLink href={`/fiche/${next.id}`} label="Suivante" title={next.title} dir="next" />}
          </nav>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-gray-200 bg-base shadow-xs">
            <div className="border-b border-gray-200 p-4">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{day.title}</p>
              <Link href={topicHref} className="mt-1 block font-semibold text-gray-900 hover:text-brand-700">
                {topic.title}
              </Link>
              <div className="mt-3">
                <Progress ids={topic.fiches.map((f) => f.id)} />
              </div>
            </div>
            <ol className="max-h-[60vh] overflow-y-auto p-2">
              {topic.fiches.map((f, i) => (
                <li key={f.id}>
                  <Link
                    href={`/fiche/${f.id}`}
                    aria-current={f.id === fiche.id ? "page" : undefined}
                    className={cx(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                      f.id === fiche.id
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <ReadMarker id={f.id} number={i + 1} />
                    <span className="min-w-0">{f.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PagerLink({ href, label, title, dir }: { href: string; label: string; title: string; dir: "prev" | "next" }) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={href}
      className={cx(
        "group flex flex-col gap-1 rounded-xl border border-gray-200 p-4 shadow-xs transition hover:border-brand-300 hover:bg-brand-25",
        dir === "next" && "items-end text-right sm:col-start-2",
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 group-hover:text-brand-700">
        {dir === "prev" && <Icon className="size-4" aria-hidden />}
        {label}
        {dir === "next" && <Icon className="size-4" aria-hidden />}
      </span>
      <span className="font-semibold text-gray-900">{title}</span>
    </Link>
  );
}
