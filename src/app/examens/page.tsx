import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "@untitledui/icons";
import { ExamBestScore } from "@/components/exam";
import { Badge, Breadcrumbs, FeaturedIcon } from "@/components/ui";
import { EXAM_RULES, exams, themes } from "@/data/examens";

export const metadata: Metadata = {
  title: "Examens blancs",
  description: "3 examens blancs de 40 questions pour vous entraîner à l’examen civique.",
};

const OFFICIAL_LIST =
  "https://formation-civique.interieur.gouv.fr/examen-civique/liste-officielle-des-questions-de-connaissance-csp/";

export default function ExamsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <Breadcrumbs items={[{ label: "Examens blancs" }]} />

      <header className="mt-6 flex items-center gap-5 border-b border-gray-200 pb-8">
        <FeaturedIcon icon={ClipboardCheck} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Examens blancs</h1>
          <p className="mt-1 text-gray-600">
            Évaluez vos révisions avant l’examen civique : {EXAM_RULES.questions} questions, {EXAM_RULES.minutes} minutes,
            réussite à {EXAM_RULES.passMark}/{EXAM_RULES.questions}.
          </p>
        </div>
      </header>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {exams.map((exam) => (
          <li key={exam.id}>
            <Link
              href={`/examens/${exam.id}`}
              className="group flex h-full flex-col rounded-xl border border-gray-200 bg-base p-6 shadow-xs transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">{exam.title}</h2>
                <ArrowRight
                  className="size-5 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                  aria-hidden
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{exam.questions.length} questions</Badge>
                <Badge>{EXAM_RULES.minutes} min</Badge>
              </div>
              <div className="mt-auto pt-6">
                <ExamBestScore id={exam.id} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Ce que couvre chaque examen</h2>
          <p className="mt-2 text-gray-600">
            {EXAM_RULES.knowledge} questions de connaissance et {EXAM_RULES.situations} mises en situation, réparties
            sur les 5 thématiques (8 questions chacune) :
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700 marker:text-gray-400">
            {Object.values(themes).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-gray-600">
          <h2 className="text-lg font-semibold text-gray-900">Sources</h2>
          <p className="mt-2">
            Les questions de connaissance reprennent la{" "}
            <a href={OFFICIAL_LIST} className="font-medium text-gray-700 underline underline-offset-2">
              liste officielle des questions (CSP)
            </a>
            . Les réponses et les mises en situation sont rédigées d’après les fiches de révision. Chaque correction
            renvoie vers la fiche à réviser.
          </p>
          <p className="mt-2">
            Entraînement non officiel. Vos résultats restent dans votre navigateur.
          </p>
        </div>
      </section>
    </main>
  );
}
