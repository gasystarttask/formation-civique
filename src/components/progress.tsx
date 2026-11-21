"use client";

import { useEffect, useRef } from "react";
import { Check, CheckCircle } from "@untitledui/icons";
import { setRead, useReadFiches } from "@/lib/progress";
import { buttonClass, cx } from "./ui";

/** Pastille numérotée qui devient une coche quand la fiche est lue. */
export function ReadMarker({ id, number }: { id: string; number: number }) {
  const read = useReadFiches().has(id);
  return (
    <span
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        read ? "bg-success-500 text-white" : "bg-gray-100 text-gray-600",
      )}
    >
      {read ? <Check className="size-3.5" aria-label="Lue" /> : number}
    </span>
  );
}

export function ReadToggle({ id }: { id: string }) {
  const read = useReadFiches().has(id);
  return (
    <button
      type="button"
      aria-pressed={read}
      onClick={() => setRead(id, !read)}
      className={buttonClass(
        "secondary",
        read ? "bg-success-50! text-success-700! ring-success-200! hover:bg-success-100! dark:text-success-700!" : undefined,
      )}
    >
      <CheckCircle aria-hidden />
      {read ? "Fiche lue" : "Marquer comme lue"}
    </button>
  );
}

/** Barre de progression Untitled UI ("x / y fiches lues"). */
export function Progress({ ids, label = true }: { ids: string[]; label?: boolean }) {
  const readSet = useReadFiches();
  const done = ids.filter((id) => readSet.has(id)).length;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Progression"
      >
        <div className="h-full rounded-full bg-brand-600 transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      {label && (
        <span className="text-sm font-medium whitespace-nowrap text-gray-700">
          {done}/{ids.length}
        </span>
      )}
    </div>
  );
}

/**
 * Marque automatiquement la fiche comme lue quand le lecteur atteint la fin du contenu.
 * Ne se déclenche qu'une fois par visite : un « non lue » manuel reste respecté.
 */
export function AutoMarkRead({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRead(id, true);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);
  return <div ref={ref} aria-hidden />;
}

/**
 * Progression globale : une barre segmentée par journée
 * (largeur proportionnelle au nombre de fiches de chaque journée).
 */
export function GlobalProgress({ days }: { days: { slug: string; title: string; ficheIds: string[] }[] }) {
  const readSet = useReadFiches();
  const stats = days
    .filter((d) => d.ficheIds.length > 0)
    .map((d) => {
      const done = d.ficheIds.filter((id) => readSet.has(id)).length;
      return { ...d, done, total: d.ficheIds.length };
    });
  const done = stats.reduce((n, d) => n + d.done, 0);
  const total = stats.reduce((n, d) => n + d.total, 0);
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section
      aria-labelledby="global-progress"
      className="rounded-xl border border-gray-200 bg-base p-5 shadow-xs md:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="global-progress" className="text-sm font-medium text-gray-600">
            Progression globale
          </h2>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{pct} %</p>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{done}</span> fiches lues sur {total}
        </p>
      </div>

      <div
        className="mt-4 flex h-3 gap-1"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Progression globale"
      >
        {stats.map((d) => (
          <div
            key={d.slug}
            className="h-full overflow-hidden rounded-full bg-gray-200"
            style={{ flexGrow: d.total, flexBasis: 0 }}
            title={`${d.title} : ${d.done}/${d.total}`}
          >
            <div
              className={cx("h-full rounded-full transition-[width]", d.done === d.total ? "bg-success-500" : "bg-brand-600")}
              style={{ width: `${(d.done / d.total) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <ul className="mt-3 flex">
        {stats.map((d) => (
          <li key={d.slug} className="min-w-0 text-xs text-gray-500" style={{ flexGrow: d.total, flexBasis: 0 }}>
            <span className="font-medium text-gray-700">
              <span className="sm:hidden">{d.title.replace("Journée ", "J")}</span>
              <span className="hidden sm:inline">{d.title}</span>
            </span>{" "}
            <span className="whitespace-nowrap">
              {d.done}/{d.total}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Version compacte pour l'en-tête : fine barre segmentée par journée, collée en bas du header. */
export function HeaderProgress({ days }: { days: { slug: string; title: string; ficheIds: string[] }[] }) {
  const readSet = useReadFiches();
  const stats = days
    .filter((d) => d.ficheIds.length > 0)
    .map((d) => ({ ...d, done: d.ficheIds.filter((id) => readSet.has(id)).length, total: d.ficheIds.length }));
  const done = stats.reduce((n, d) => n + d.done, 0);
  const total = stats.reduce((n, d) => n + d.total, 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const summary = `Progression globale : ${pct} % (${done}/${total} fiches) — ${stats
    .map((d) => `${d.title} ${d.done}/${d.total}`)
    .join(", ")}`;

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex h-1 translate-y-full gap-0.5 bg-gray-100"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={summary}
      title={summary}
    >
      {stats.map((d) => (
        <div key={d.slug} className="h-full bg-gray-200" style={{ flexGrow: d.total, flexBasis: 0 }}>
          <div
            className={cx("h-full transition-[width]", d.done === d.total ? "bg-success-500" : "bg-brand-600")}
            style={{ width: `${(d.done / d.total) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

/** Pastille "x %" de l'en-tête. */
export function HeaderProgressBadge({ ids }: { ids: string[] }) {
  const readSet = useReadFiches();
  const done = ids.filter((id) => readSet.has(id)).length;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
  return (
    <span
      title={`${done} fiches lues sur ${ids.length}`}
      className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-brand-700 ring-1 ring-brand-200 ring-inset md:inline-flex"
    >
      <CheckCircle className="size-3.5" aria-hidden />
      {pct} % lu
    </span>
  );
}
