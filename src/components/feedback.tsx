"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, FaceNeutral, FaceSad, FaceSmile, XClose } from "@untitledui/icons";
import type { Rating } from "@/lib/feedback";
import { cx } from "./ui";

const KEY = "formation-civique:feedback";

/** Thématiques pour lesquelles le modal a déjà été affiché (répondu ou fermé). */
function asked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
function markAsked(topic: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set([...asked(), topic])]));
  } catch {}
}

const choices: { value: Rating; label: string; icon: typeof FaceSad; tone: string }[] = [
  { value: "triste", label: "Pas satisfait", icon: FaceSad, tone: "bg-error-50 text-error-700 ring-error-200 hover:bg-error-100" },
  { value: "mitige", label: "Mitigé", icon: FaceNeutral, tone: "bg-yellow-50 text-yellow-700 ring-yellow-200 hover:bg-yellow-100" },
  { value: "content", label: "Satisfait", icon: FaceSmile, tone: "bg-success-50 text-success-700 ring-success-200 hover:bg-success-100" },
];

type State = "idle" | "sending" | "done" | "error";

/**
 * Modal d'avis affiché une seule fois, quand le lecteur atteint la fin
 * de la dernière fiche d'une thématique.
 */
export function TopicFeedback({ topic, title }: { topic: string; title: string }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const el = sentinel.current;
    if (!el || asked().includes(topic)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      markAsked(topic);
      dialog.current?.showModal();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [topic]);

  const close = () => dialog.current?.close();

  const send = async (rating: Rating) => {
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, rating }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      setTimeout(close, 1500);
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <div ref={sentinel} aria-hidden />
      <dialog
        ref={dialog}
        aria-labelledby="feedback-title"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-base p-0 text-gray-900 shadow-xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-6">
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
          >
            <XClose className="size-5" aria-hidden />
            <span className="sr-only">Fermer</span>
          </button>

          {state === "done" ? (
            <div className="flex flex-col items-center py-4 text-center" role="status">
              <span className="flex size-12 items-center justify-center rounded-full bg-success-100 text-success-700 ring-8 ring-success-50">
                <CheckCircle className="size-6" aria-hidden />
              </span>
              <p className="mt-4 text-lg font-semibold text-gray-900">Merci pour votre avis !</p>
            </div>
          ) : (
            <>
              <p className="pr-8 text-sm font-medium text-brand-700">Thématique terminée</p>
              <h2 id="feedback-title" className="mt-1 pr-8 text-lg font-semibold text-gray-900">
                Comment avez-vous trouvé « {title} » ?
              </h2>
              <p className="mt-1 text-sm text-gray-600">Votre avis est anonyme et nous aide à améliorer les fiches.</p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {choices.map(({ value, label, icon: Icon, tone }) => (
                  <button
                    key={value}
                    type="button"
                    disabled={state === "sending"}
                    onClick={() => send(value)}
                    className={cx(
                      "flex flex-col items-center gap-2 rounded-xl px-2 py-4 text-sm font-semibold ring-1 ring-inset transition-colors disabled:opacity-50",
                      tone,
                    )}
                  >
                    <Icon className="size-8" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>

              {state === "error" && (
                <p className="mt-4 text-sm text-error-700" role="alert">
                  L’envoi a échoué. Réessayez dans un instant.
                </p>
              )}
              <button
                type="button"
                onClick={close}
                className="mt-4 w-full rounded-lg py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                Plus tard
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
