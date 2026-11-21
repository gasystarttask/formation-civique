import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/skeleton";
import { ArrowRight, ChevronRight, LinkExternal01 } from "@untitledui/icons";
import { Progress, ReadMarker } from "@/components/progress";
import { Badge, Breadcrumbs, ButtonLink, FeaturedIcon } from "@/components/ui";
import { days, getDay } from "@/lib/content";
import { dayIcons } from "@/lib/icons";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => days.map((d) => ({ slug: d.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const day = getDay((await params).slug);
  return { title: day?.title };
}

export default function DayPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DayContent params={params} />
    </Suspense>
  );
}

async function DayContent({ params }: Props) {
  const day = getDay((await params).slug);
  if (!day) notFound();
  const next = days[day.number];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <Breadcrumbs items={[{ label: day.title }]} />

      <header className="mt-6 flex flex-col gap-6 border-b border-gray-200 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-5">
          <FeaturedIcon icon={dayIcons[day.number - 1]} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{day.title}</h1>
            {day.sections.length > 0 && (
              <p className="mt-1 text-gray-600">
                {day.sections.length} grandes thématiques · {day.ficheIds.length} fiches
              </p>
            )}
          </div>
        </div>
        {day.ficheIds.length > 0 && (
          <div className="w-full md:w-72">
            <p className="mb-2 text-sm font-medium text-gray-700">Votre progression</p>
            <Progress ids={day.ficheIds} />
          </div>
        )}
      </header>

      {day.intro && (
        <>
          <article className="fiche mt-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: day.intro.html }} />
          <a
            href={day.intro.source}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Voir la page officielle
            <LinkExternal01 className="size-4" aria-hidden />
          </a>
        </>
      )}

      {day.sections.length > 1 && (
        <nav aria-label="Thématiques" className="mt-8 flex flex-wrap gap-2">
          {day.sections.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-200 ring-inset hover:bg-gray-50 hover:text-gray-800"
            >
              {s.title}
            </a>
          ))}
        </nav>
      )}

      {day.sections.map((section) => (
        <section key={section.slug} id={section.slug} className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
          {section.description && !section.description.endsWith("[…]") && <p className="mt-1 text-gray-600">{section.description}</p>}

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            {section.topics.map((topic) => (
              <article
                key={topic.slug}
                id={`${section.slug}--${topic.slug}`}
                className="flex flex-col rounded-xl border border-gray-200 bg-base shadow-xs"
              >
                <header className="border-b border-gray-200 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                    <Badge>{topic.fiches.length} fiches</Badge>
                  </div>
                  <div className="mt-3">
                    <Progress ids={topic.fiches.map((f) => f.id)} label={false} />
                  </div>
                </header>
                <ol className="divide-y divide-gray-100 p-2">
                  {topic.fiches.map((f, i) => (
                    <li key={f.id}>
                      <Link
                        href={`/fiche/${f.id}`}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50"
                      >
                        <ReadMarker id={f.id} number={i + 1} />
                        <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {f.title}
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-gray-300 group-hover:text-gray-500" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>
      ))}

      {next && (
        <div className="mt-16 flex justify-end border-t border-gray-200 pt-8">
          <ButtonLink href={`/journee/${next.slug}`} color="primary">
            {next.title}
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
      )}
    </main>
  );
}
