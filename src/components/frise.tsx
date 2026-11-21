import Link from "next/link";
import { ArrowRight } from "@untitledui/icons";
import { friseSegments, frisePeriods, regimeKinds, type RegimeKind } from "@/data/frise-regimes";
import { ReadMarker } from "./progress";
import { cx } from "./ui";

/** Couleurs par type de régime (tokens Untitled UI). */
const kindStyles: Record<RegimeKind, { dot: string; bar: string; badge: string }> = {
  monarchie: {
    dot: "bg-warning-500 ring-warning-100",
    bar: "bg-warning-500",
    badge: "bg-warning-50 text-warning-700 ring-warning-200",
  },
  transition: {
    dot: "bg-gray-400 ring-gray-200",
    bar: "bg-gray-400",
    badge: "bg-gray-50 text-gray-700 ring-gray-200",
  },
  republique: {
    dot: "bg-brand-600 ring-brand-100",
    bar: "bg-brand-600",
    badge: "bg-brand-50 text-brand-700 ring-brand-200",
  },
  empire: {
    dot: "bg-purple-500 ring-purple-100",
    bar: "bg-purple-500",
    badge: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  autoritaire: {
    dot: "bg-error-500 ring-error-100",
    bar: "bg-error-500",
    badge: "bg-error-50 text-error-700 ring-error-200",
  },
};

/** Frise chronologique : bandeau proportionnel depuis 1789 puis détail période par période. */
export function Frise({ numbers, end }: { numbers: Record<string, number>; end: number }) {
  const start = friseSegments[0].from;
  // Repères d'années (les "minor" sont masqués sur mobile pour éviter les chevauchements)
  const ticks = [1789, 1815, 1848, 1870, 1914, 1940, 1958, 2000];
  const minor = new Set([1815, 1914, 1940]);

  return (
    <div className="mt-10">
      {/* Bandeau proportionnel */}
      <section aria-labelledby="frise-apercu" className="rounded-xl border border-gray-200 bg-base p-5 shadow-xs">
        <h2 id="frise-apercu" className="font-semibold text-gray-900">
          De 1789 à aujourd’hui
        </h2>
        <p className="mt-1 text-sm text-gray-600">Durée réelle de chaque régime. Cliquez pour voir le détail.</p>

        <div className="mt-4 flex h-8 gap-px overflow-hidden rounded-md">
          {friseSegments.map((s) => {
            const to = s.to ?? end;
            const label = `${s.label} (${s.from}–${s.to ?? "aujourd’hui"})`;
            return (
              <a
                key={s.label}
                href={`#${s.slug}`}
                title={label}
                aria-label={label}
                className={cx("min-w-1 transition-opacity hover:opacity-75", kindStyles[s.kind].bar)}
                style={{ flexGrow: to - s.from, flexBasis: 0 }}
              />
            );
          })}
        </div>
        <div className="relative mt-1 h-4 text-xs text-gray-500" aria-hidden>
          {ticks.map((y) => (
            <span
              key={y}
              className={cx("absolute -translate-x-1/2 first:translate-x-0", minor.has(y) && "hidden sm:inline")}
              style={{ left: `${((y - start) / (end - start)) * 100}%` }}
            >
              {y}
            </span>
          ))}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
          {(Object.keys(regimeKinds) as RegimeKind[]).map((k) => (
            <li key={k} className="flex items-center gap-2">
              <span className={cx("size-2.5 rounded-full", kindStyles[k].bar)} aria-hidden />
              {regimeKinds[k]}
            </li>
          ))}
        </ul>
      </section>

      {/* Détail chronologique */}
      <ol className="mt-10">
        {frisePeriods.map((p, i) => {
          const style = kindStyles[p.kind];
          const last = i === frisePeriods.length - 1;
          return (
            <li key={p.slug} id={p.slug} className="relative flex gap-4 pb-10 last:pb-0">
              {/* Rail vertical */}
              {!last && <span className="absolute top-4 bottom-0 left-[7px] w-0.5 bg-gray-200" aria-hidden />}
              <span className={cx("relative mt-1.5 size-4 shrink-0 rounded-full ring-4", style.dot)} aria-hidden />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{p.dates}</span>
                  <span
                    className={cx(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      style.badge,
                    )}
                  >
                    {regimeKinds[p.kind]}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{p.title}</h3>

                <ul className="mt-3 space-y-2">
                  {p.events.map((e) => (
                    <li key={e.date + e.text} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                      <span className="shrink-0 text-sm font-semibold text-brand-700 sm:w-36">{e.date}</span>
                      <span className="text-gray-600">{e.text}</span>
                    </li>
                  ))}
                </ul>

                {(p.people || p.legacy) && (
                  <dl className="mt-4 space-y-1 rounded-lg bg-gray-50 p-3 text-sm">
                    {p.people && (
                      <div>
                        <dt className="inline font-semibold text-gray-700">Personnages clés : </dt>
                        <dd className="inline text-gray-600">{p.people}</dd>
                      </div>
                    )}
                    {p.legacy && (
                      <div>
                        <dt className="inline font-semibold text-gray-700">Héritage : </dt>
                        <dd className="inline text-gray-600">{p.legacy}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <Link
                  href={`/fiche/${p.ficheId}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  <ReadMarker id={p.ficheId} number={numbers[p.ficheId]} />
                  Revoir l’étape {numbers[p.ficheId]}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
