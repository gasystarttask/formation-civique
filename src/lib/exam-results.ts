"use client";

import { useSyncExternalStore } from "react";

/** Résultats des examens blancs, gardés dans le navigateur (aucun envoi au serveur). */
export type ExamResult = { best: number; last: number; attempts: number; date: string };
type Results = Readonly<Record<string, ExamResult>>;

const KEY = "formation-civique:examens";
const EVENT = "formation-civique:examens";
const EMPTY: Results = {};

let raw: string | null = null;
let cached: Results = EMPTY;

function read(): Results {
  let value: string | null = null;
  try {
    value = localStorage.getItem(KEY);
  } catch {}
  if (value !== raw) {
    raw = value;
    try {
      cached = value ? (JSON.parse(value) as Results) : EMPTY;
    } catch {
      cached = EMPTY;
    }
  }
  return cached;
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function useExamResults() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function saveExamResult(id: string, score: number) {
  const prev = read()[id];
  const next: Results = {
    ...read(),
    [id]: {
      best: Math.max(prev?.best ?? 0, score),
      last: score,
      attempts: (prev?.attempts ?? 0) + 1,
      date: new Date().toISOString(),
    },
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
