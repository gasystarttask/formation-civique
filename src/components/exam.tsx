"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, RefreshCw01, XCircle } from "@untitledui/icons";
import { EXAM_RULES, themes, type Exam, type ThemeKey } from "@/data/examens";
import { saveExamResult, useExamResults } from "@/lib/exam-results";
import { Badge, buttonClass, cx } from "./ui";

const LETTERS = ["A", "B", "C", "D"];
const DURATION_MS = EXAM_RULES.minutes * 60 * 1000;

type Phase = "intro" | "running" | "done";
type Answers = (number | null)[];

const formatTime = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

const kindLabel = { connaissance: "Connaissance", situation: "Mise en situation" };

/** Meilleur score enregistré pour un examen (liste des examens). */
export function ExamBestScore({ id }: { id: string }) {
  const result = useExamResults()[id];
  if (!result) return <Badge>Pas encore passé</Badge>;
  const passed = result.best >= EXAM_RULES.passMark;
  return (
    <Badge color={passed ? "success" : "gray"}>
      Meilleur score : {result.best}/{EXAM_RULES.questions}
      {passed ? " · réussi" : ""}
    </Badge>
  );
}

/** Déroulé d'un examen blanc : consignes, questions chronométrées, correction. */
export function ExamRunner({ exam, ficheTitles }: { exam: Exam; ficheTitles: Record<string, string> }) {
  const total = exam.questions.length;
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>(() => Array(total).fill(null));
  const [index, setIndex] = useState(0);
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(0);
  const [finishedAt, setFinishedAt] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const top = useRef<HTMLDivElement>(null);

  const answered = answers.filter((a) => a !== null).length;
  const score = answers.filter((a, i) => a === exam.questions[i].answer).length;

  const start = () => {
    const t = Date.now();
    setAnswers(Array(total).fill(null));
    setIndex(0);
    setConfirming(false);
    setNow(t);
    setEndAt(t + DURATION_MS);
    setPhase("running");
  };

  const finish = (final: Answers) => {
    saveExamResult(
      exam.id,
      final.filter((a, i) => a === exam.questions[i].answer).length,
    );
    setFinishedAt(Date.now());
    setConfirming(false);
    setPhase("done");
  };

  // Chronomètre : fin automatique au bout de 45 minutes.
  useEffect(() => {
    if (phase !== "running") return;
    const timer = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt) finish(answers);
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finish ne dépend que des réponses
  }, [phase, endAt, answers]);

  // À chaque question : focus sur l'intitulé (lecteurs d'écran, clavier).
  useEffect(() => {
    if (phase === "running") heading.current?.focus({ preventScroll: true });
  }, [phase, index]);

  // Changement d'étape (pas au premier affichage) : retour en haut de l'examen.
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) top.current?.scrollIntoView({ block: "start" });
    mounted.current = true;
  }, [phase]);

  const choose = (choice: number) => {
    const next = answers.map((a, i) => (i === index ? choice : a));
    setAnswers(next);
    if (index !== total - 1) return;
    // Réponse à la dernière question : fin de l'examen et arrêt du chrono,
    // sauf s'il reste des questions sans réponse (confirmation).
    if (next.every((a) => a !== null)) finish(next);
    else setConfirming(true);
  };

  if (phase === "intro") {
    return (
      <div ref={top} className="scroll-mt-24 rounded-xl border border-gray-200 bg-base p-6 shadow-xs md:p-8">
        <h2 className="text-lg font-semibold text-gray-900">Consignes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700 marker:text-gray-400">
          <li>
            {EXAM_RULES.questions} questions à choix multiples : une seule bonne réponse parmi 4.
          </li>
          <li>
            {EXAM_RULES.knowledge} questions de connaissance et {EXAM_RULES.situations} mises en situation, sur les 5
            thématiques de la formation civique.
          </li>
          <li>{EXAM_RULES.minutes} minutes au maximum. L’examen se termine automatiquement à la fin du temps.</li>
          <li>
            Réussite à partir de {EXAM_RULES.passMark} bonnes réponses ({Math.round((EXAM_RULES.passMark / EXAM_RULES.questions) * 100)} %).
          </li>
          <li>Vous pouvez revenir sur une question tant que l’examen n’est pas terminé.</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          Entraînement non officiel : le format des questions peut varier lors de l’examen officiel.
        </p>
        <button type="button" onClick={start} className={buttonClass("primary", "mt-6")}>
          Commencer l’examen
          <ArrowRight aria-hidden />
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div ref={top} className="scroll-mt-24">
        <ExamResults
          exam={exam}
          answers={answers}
          score={score}
          duration={finishedAt - (endAt - DURATION_MS)}
          ficheTitles={ficheTitles}
          onRestart={start}
        />
      </div>
    );
  }

  const q = exam.questions[index];
  const remaining = endAt - now;
  const last = index === total - 1;

  return (
    <div ref={top} className="scroll-mt-24">
      {/* Barre d'état : progression et temps restant */}
      <div className="sticky top-16 z-10 -mx-4 border-b border-gray-200 bg-base/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-xl md:border md:px-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-700">
            {answered}/{total} réponses
          </p>
          <p
            className={cx(
              "flex items-center gap-1.5 text-sm font-semibold tabular-nums",
              remaining < 5 * 60 * 1000 ? "text-error-700" : "text-gray-700",
            )}
            role="timer"
            aria-label={`Temps restant : ${formatTime(remaining)}`}
          >
            <Clock className="size-4" aria-hidden />
            {formatTime(remaining)}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200" aria-hidden>
          <div className="h-full rounded-full bg-brand-600 transition-[width]" style={{ width: `${(answered / total) * 100}%` }} />
        </div>
      </div>

      <fieldset className="mt-6 rounded-xl border border-gray-200 bg-base p-5 shadow-xs md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="brand">
            Question {index + 1}/{total}
          </Badge>
          <Badge>{themes[q.theme]}</Badge>
          <Badge>{kindLabel[q.kind]}</Badge>
        </div>
        <legend className="sr-only">Question {index + 1}</legend>
        <h2 ref={heading} tabIndex={-1} className="mt-4 text-lg font-semibold text-gray-900 outline-none md:text-xl">
          {q.question}
        </h2>
        <div className="mt-6 grid gap-3">
          {q.choices.map((choice, i) => {
            const selected = answers[index] === i;
            return (
              <label
                key={i}
                className={cx(
                  "flex cursor-pointer items-start gap-3 rounded-xl p-4 ring-1 transition-colors ring-inset",
                  selected ? "bg-brand-50 ring-2 ring-brand-600" : "ring-gray-200 hover:bg-gray-50",
                )}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={selected}
                  onChange={() => choose(i)}
                  className="sr-only"
                />
                <span
                  className={cx(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    selected ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600",
                  )}
                  aria-hidden
                >
                  {LETTERS[i]}
                </span>
                <span className={cx("text-gray-700", selected && "font-medium text-gray-900")}>{choice}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
            className={buttonClass("secondary", "disabled:opacity-50")}
          >
            <ArrowLeft aria-hidden />
            <span className="hidden sm:inline">Précédente</span>
          </button>
          {last ? (
            <button type="button" onClick={() => setConfirming(true)} className={buttonClass("primary")}>
              Terminer l’examen
            </button>
          ) : (
            <button type="button" onClick={() => setIndex(index + 1)} className={buttonClass("primary")}>
              Suivante
              <ArrowRight aria-hidden />
            </button>
          )}
        </div>
      </fieldset>

      {/* Navigation entre les questions */}
      <nav aria-label="Questions" className="mt-6 rounded-xl border border-gray-200 bg-base p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Aller à la question</h2>
          {!last && (
            <button type="button" onClick={() => setConfirming(true)} className={buttonClass("secondary")}>
              Terminer l’examen
            </button>
          )}
        </div>
        <ol className="mt-4 grid grid-cols-8 gap-2 sm:grid-cols-10">
          {exam.questions.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index ? "step" : undefined}
                aria-label={`Question ${i + 1}${answers[i] !== null ? ", répondue" : ""}`}
                className={cx(
                  "flex h-9 w-full items-center justify-center rounded-lg text-sm font-semibold tabular-nums ring-1 ring-inset",
                  i === index
                    ? "bg-brand-600 text-white ring-brand-600"
                    : answers[i] !== null
                      ? "bg-brand-50 text-brand-700 ring-brand-200"
                      : "text-gray-600 ring-gray-200 hover:bg-gray-50",
                )}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {confirming && (
        <div
          role="alertdialog"
          aria-labelledby="confirm-title"
          className="mt-6 rounded-xl border border-warning-200 bg-warning-50 p-5"
        >
          <h2 id="confirm-title" className="flex items-center gap-2 font-semibold text-warning-700">
            <AlertCircle className="size-5" aria-hidden />
            Terminer l’examen ?
          </h2>
          <p className="mt-2 text-sm text-warning-700">
            {answered < total
              ? total - answered > 1
                ? `${total - answered} questions sans réponse : elles seront comptées fausses.`
                : "1 question sans réponse : elle sera comptée fausse."
              : "Toutes les questions ont une réponse."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => finish(answers)} className={buttonClass("primary")}>
              Voir mes résultats
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={buttonClass("secondary")}>
              Continuer l’examen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ExamResults({
  exam,
  answers,
  score,
  duration,
  ficheTitles,
  onRestart,
}: {
  exam: Exam;
  answers: Answers;
  score: number;
  duration: number;
  ficheTitles: Record<string, string>;
  onRestart: () => void;
}) {
  const [errorsOnly, setErrorsOnly] = useState(false);
  const total = exam.questions.length;
  const passed = score >= EXAM_RULES.passMark;
  const correct = (i: number) => answers[i] === exam.questions[i].answer;

  const byTheme = (Object.keys(themes) as ThemeKey[]).map((theme) => {
    const items = exam.questions.map((q, i) => ({ q, i })).filter(({ q }) => q.theme === theme);
    return { theme, total: items.length, ok: items.filter(({ i }) => correct(i)).length };
  });
  const byKind = (["connaissance", "situation"] as const).map((kind) => {
    const items = exam.questions.map((q, i) => ({ q, i })).filter(({ q }) => q.kind === kind);
    return { kind, total: items.length, ok: items.filter(({ i }) => correct(i)).length };
  });
  const errors = total - score;
  const shown = exam.questions.map((q, i) => ({ q, i })).filter(({ i }) => !errorsOnly || !correct(i));

  return (
    <div>
      <section
        className={cx(
          "rounded-xl border p-6 md:p-8",
          passed ? "border-success-200 bg-success-50" : "border-warning-200 bg-warning-50",
        )}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={cx("flex items-center gap-2 font-semibold", passed ? "text-success-700" : "text-warning-700")}>
              {passed ? <CheckCircle className="size-5" aria-hidden /> : <AlertCircle className="size-5" aria-hidden />}
              {passed ? "Examen réussi" : "Pas encore : continuez vos révisions"}
            </p>
            <p className="mt-2 text-4xl font-semibold text-gray-900 tabular-nums">
              {score}/{total}
              <span className="ml-3 text-xl font-medium text-gray-600">{Math.round((score / total) * 100)} %</span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Seuil de réussite : {EXAM_RULES.passMark}/{total} · Durée : {formatTime(duration)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onRestart} className={buttonClass("secondary")}>
              <RefreshCw01 aria-hidden />
              Recommencer
            </button>
            <Link href="/examens" className={buttonClass("primary")}>
              Autres examens
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-base p-5 shadow-xs lg:col-span-2">
          <h2 className="font-semibold text-gray-900">Résultats par thématique</h2>
          <ul className="mt-4 space-y-4">
            {byTheme.map(({ theme, total: t, ok }) => (
              <li key={theme}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-700">{themes[theme]}</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {ok}/{t}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200" aria-hidden>
                  <div
                    className={cx("h-full rounded-full", ok / t >= 0.8 ? "bg-success-500" : "bg-warning-500")}
                    style={{ width: `${(ok / t) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-base p-5 shadow-xs">
          <h2 className="font-semibold text-gray-900">Par type de question</h2>
          <dl className="mt-4 space-y-3">
            {byKind.map(({ kind, total: t, ok }) => (
              <div key={kind} className="flex items-center justify-between gap-3 text-sm">
                <dt className="text-gray-700">{kindLabel[kind]}</dt>
                <dd className="font-semibold text-gray-900 tabular-nums">
                  {ok}/{t}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Correction</h2>
          <div className="flex gap-1 rounded-lg bg-gray-50 p-1 ring-1 ring-gray-200 ring-inset" role="group" aria-label="Filtrer">
            {[
              { value: false, label: `Toutes (${total})` },
              { value: true, label: `Erreurs (${errors})` },
            ].map((f) => (
              <button
                key={f.label}
                type="button"
                aria-pressed={errorsOnly === f.value}
                onClick={() => setErrorsOnly(f.value)}
                className={cx(
                  "rounded-md px-3 py-1.5 text-sm font-semibold",
                  errorsOnly === f.value ? "bg-base text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-700",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 && <p className="mt-6 text-gray-600">Aucune erreur : bravo !</p>}
        <ol className="mt-6 space-y-4">
          {shown.map(({ q, i }) => {
            const ok = correct(i);
            return (
              <li key={i} className="rounded-xl border border-gray-200 bg-base p-5 shadow-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color={ok ? "success" : "gray"}>
                    {ok ? <CheckCircle className="size-3" aria-hidden /> : <XCircle className="size-3" aria-hidden />}
                    Question {i + 1} · {ok ? "juste" : answers[i] === null ? "sans réponse" : "fausse"}
                  </Badge>
                  <Badge>{themes[q.theme]}</Badge>
                  <Badge>{kindLabel[q.kind]}</Badge>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{q.question}</h3>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {q.choices.map((choice, c) => {
                    const isAnswer = c === q.answer;
                    const isChosen = c === answers[i];
                    return (
                      <li
                        key={c}
                        className={cx(
                          "flex items-start gap-2 rounded-lg px-3 py-2",
                          isAnswer && "bg-success-50 font-medium text-success-700",
                          isChosen && !isAnswer && "bg-error-50 text-error-700 line-through",
                          !isAnswer && !isChosen && "text-gray-600",
                        )}
                      >
                        <span className="font-semibold">{LETTERS[c]}.</span>
                        <span>{choice}</span>
                        {isAnswer && <span className="sr-only">(bonne réponse)</span>}
                        {isChosen && !isAnswer && <span className="sr-only">(votre réponse)</span>}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-sm text-gray-700">{q.explanation}</p>
                <Link
                  href={`/fiche/${q.fiche}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  Réviser : {ficheTitles[q.fiche] ?? "la fiche"}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
