"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { File06, SearchLg, XClose } from "@untitledui/icons";
import type { SearchEntry } from "@/lib/content";
import { cx } from "./ui";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function Search({ entries, variant = "header" }: { entries: SearchEntry[]; variant?: "header" | "hero" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const haystack = useMemo(
    () => entries.map((e) => norm(`${e.title} ${e.description ?? ""} ${e.path}`)),
    [entries],
  );
  const results = useMemo(() => {
    const terms = norm(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return entries.filter((_, i) => terms.every((t) => haystack[i].includes(t))).slice(0, 30);
  }, [query, entries, haystack]);

  const open = () => {
    dialog.current?.showModal();
    input.current?.select();
  };
  const close = () => dialog.current?.close();

  // Raccourci clavier ⌘K / Ctrl+K (ne s'enregistre qu'une fois : variante header)
  useEffect(() => {
    if (variant !== "header") return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      router.push(`/fiche/${results[active].id}`);
      close();
    }
  };

  return (
    <>
      {variant === "header" ? (
        <button
          type="button"
          onClick={open}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-gray-500 ring-1 ring-gray-300 ring-inset shadow-xs hover:bg-gray-50 sm:w-64 sm:px-3"
        >
          <SearchLg className="size-5" aria-hidden />
          <span className="sr-only sm:not-sr-only sm:flex-1 sm:text-left sm:text-sm">Rechercher une fiche</span>
          <kbd className="hidden rounded border border-gray-200 px-1.5 font-sans text-xs text-gray-500 sm:inline">
            ⌘K
          </kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={open}
          className="flex w-full max-w-md items-center gap-2 rounded-lg bg-base px-3.5 py-3 text-left text-gray-500 shadow-xs ring-1 ring-gray-300 ring-inset hover:ring-gray-400"
        >
          <SearchLg className="size-5" aria-hidden />
          <span className="flex-1">Rechercher parmi {entries.length} fiches…</span>
        </button>
      )}

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && close()}
        onClose={() => setQuery("")}
        className="m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl rounded-xl bg-base p-0 shadow-xl text-gray-900 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 border-b border-gray-200 px-4">
          <SearchLg className="size-5 shrink-0 text-gray-400" aria-hidden />
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Laïcité, droit de vote, Marianne…"
            aria-label="Rechercher une fiche"
            className="h-14 flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
            autoFocus
          />
          <button type="button" onClick={close} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50">
            <XClose className="size-5" aria-hidden />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <p className="px-3 py-8 text-center text-sm text-gray-500">
              Tapez un mot-clé pour retrouver une fiche de révision.
            </p>
          )}
          {query && !results.length && (
            <p className="px-3 py-8 text-center text-sm text-gray-500">Aucune fiche ne correspond à « {query} ».</p>
          )}
          <ul>
            {results.map((r, i) => (
              <li key={r.id}>
                <Link
                  href={`/fiche/${r.id}`}
                  onClick={close}
                  onMouseEnter={() => setActive(i)}
                  className={cx("flex gap-3 rounded-lg px-3 py-2.5", i === active && "bg-gray-50")}
                >
                  <File06 className="mt-0.5 size-5 shrink-0 text-gray-400" aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-medium text-gray-900">{r.title}</span>
                    <span className="block truncate text-sm text-gray-500">{r.path}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
