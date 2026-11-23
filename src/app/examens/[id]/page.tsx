import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ClipboardCheck } from "@untitledui/icons";
import { ExamRunner } from "@/components/exam";
import { PageSkeleton } from "@/components/skeleton";
import { Breadcrumbs, FeaturedIcon } from "@/components/ui";
import { exams, getExam } from "@/data/examens";
import { getContext, getFiche } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

export const generateStaticParams = () => exams.map((e) => ({ id: e.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getExam((await params).id)?.title };
}

export default function ExamPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ExamContent params={params} />
    </Suspense>
  );
}

async function ExamContent({ params }: Props) {
  const exam = getExam((await params).id);
  if (!exam) notFound();

  // Titres des fiches liées (uniquement celles qui ont une page)
  const ficheTitles = Object.fromEntries(
    exam.questions
      .filter((q) => getContext(q.fiche))
      .map((q) => [q.fiche, getFiche(q.fiche)?.title ?? q.fiche]),
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <Breadcrumbs items={[{ label: "Examens blancs", href: "/examens" }, { label: exam.title }]} />
      <header className="mt-6 mb-8 flex items-center gap-5">
        <FeaturedIcon icon={ClipboardCheck} size="lg" />
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{exam.title}</h1>
      </header>
      <ExamRunner exam={exam} ficheTitles={ficheTitles} />
    </main>
  );
}
