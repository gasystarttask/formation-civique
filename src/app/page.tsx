import Link from "next/link";
import { ArrowRight } from "@untitledui/icons";
import { GlobalProgress, Progress } from "@/components/progress";
import { Search } from "@/components/search";
import { Badge, FeaturedIcon } from "@/components/ui";
import { days, searchIndex } from "@/lib/content";
import { dayIcons } from "@/lib/icons";

export default function Home() {
  return (
    <main>
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
          <Badge color="brand">{searchIndex.length} fiches · {days.length} journées</Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Révisez la formation civique, journée par journée
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 md:text-xl">
            Retrouvez toutes les fiches de révision, suivez votre progression et passez d’une fiche à la suivante
            sans vous perdre.
          </p>
          <div className="mt-8">
            <Search entries={searchIndex} variant="hero" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <GlobalProgress days={days.map(({ slug, title, ficheIds }) => ({ slug, title, ficheIds }))} />
        <h2 className="mt-12 text-xl font-semibold text-gray-900">Les journées de formation</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {days.map((day, i) => {
            const topicCount = day.sections.reduce((n, s) => n + s.topics.length, 0);
            return (
              <li key={day.slug}>
                <Link
                  href={`/journee/${day.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-gray-200 bg-base p-6 shadow-xs transition hover:border-brand-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <FeaturedIcon icon={dayIcons[i]} size="lg" />
                    <ArrowRight
                      className="size-5 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">{day.title}</h3>
                  {day.sections.length ? (
                    <>
                      <p className="mt-1 text-gray-600">{day.sections.map((s) => s.title).join(" · ")}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge>{topicCount} thèmes</Badge>
                        <Badge>{day.ficheIds.length} fiches</Badge>
                      </div>
                      <div className="mt-auto pt-6">
                        <Progress ids={day.ficheIds} />
                      </div>
                    </>
                  ) : (
                    day.introSummary && (
                      <div className="mt-1 text-gray-600">
                        <p>{day.introSummary.lead}</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm marker:text-gray-400">
                          {day.introSummary.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
