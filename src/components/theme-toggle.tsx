"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Monitor01, Moon01, Sun } from "@untitledui/icons";
import { THEME_KEY as KEY } from "@/lib/theme-script";
import { cx } from "./ui";

type Theme = "light" | "dark" | "system";

const EVENT = "formation-civique:theme";

function readTheme(): Theme {
  try {
    const t = localStorage.getItem(KEY);
    if (t === "light" || t === "dark") return t;
  } catch {}
  return "system";
}

function apply(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon01 },
  { value: "system", label: "Système", icon: Monitor01 },
];

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);

  // Applique le thème choisi et suit les changements du système en mode "system"
  useEffect(() => {
    apply(theme);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const select = (value: Theme) => {
    try {
      if (value === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, value);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <div
      role="radiogroup"
      aria-label="Thème d’affichage"
      className="flex items-center gap-0.5 rounded-lg bg-gray-50 p-0.5 ring-1 ring-gray-200 ring-inset"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => select(value)}
            className={cx(
              "rounded-md p-1.5 transition-colors",
              active ? "bg-base text-gray-700 shadow-sm ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
