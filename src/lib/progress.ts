"use client";

import { useSyncExternalStore } from "react";

const KEY = "formation-civique:lues";
const EVENT = "formation-civique:progress";
const EMPTY: ReadonlySet<string> = new Set();

let raw: string | null = null;
let cached: ReadonlySet<string> = EMPTY;

function read(): ReadonlySet<string> {
  let value: string | null = null;
  try {
    value = localStorage.getItem(KEY);
  } catch {}
  if (value !== raw) {
    raw = value;
    try {
      cached = new Set(value ? (JSON.parse(value) as string[]) : []);
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

/** Ensemble des fiches marquées comme lues (stocké localement dans le navigateur). */
export function useReadFiches() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function setRead(id: string, value: boolean) {
  const next = new Set(read());
  if (value) next.add(id);
  else next.delete(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
