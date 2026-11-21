"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Hero avec un drapeau français ondulant (SVG) en arrière-plan.
 *
 * La bande bleue s'adapte au contenu : elle prend la largeur du titre et du
 * sous-titre. Les bandes blanche et rouge occupent la place restante, comme un
 * drapeau vu en perspective depuis la hampe (la bande la plus proche paraît
 * plus large).
 *
 * Calques : fond bleu < bandes blanche/rouge < plis et éclairage < contenu.
 *
 * Performance (aucun travail sur le fil principal pendant l'animation) :
 * - rendu serveur statique, vent lancé après `load` + temps mort : rien pendant le LCP ;
 * - les bords ondulés sont dessinés une fois ; c'est le SVG entier qui défile
 *   verticalement (onde qui remonte le long des bords) ;
 * - les plis défilent horizontalement ;
 * - ces deux mouvements sont de simples `transform` CSS (compositeur GPU, ni layout ni paint) ;
 * - pause hors écran, onglet caché ou « réduire les animations ».
 */

const BLUE = "#000091"; // Bleu France
const WHITE = "#ffffff";
const RED = "#e1000f"; // Rouge Marianne

const W = 1000;
/** Hauteur du SVG en px (= unités du viewBox) : couvre le hero + une période de défilement. */
const H = 1400;
/** Période verticale de l'onde, en px. Doit correspondre à `@keyframes flag-wave` dans globals.css. */
const WAVE = 350;
/** Part de la bande blanche dans la zone blanc + rouge. */
const WHITE_SHARE = 0.54;

/** Bord vertical ondulé (de haut en bas), périodique sur WAVE px. */
function edge(x: number, amplitude: number, phase: number) {
  const steps = (H / WAVE) * 24; // 24 points par période : bord lisse, aligné sur la boucle
  return Array.from({ length: steps + 1 }, (_, i) => {
    const y = (i / steps) * H;
    const dx = amplitude * Math.sin((2 * Math.PI * y) / WAVE + phase);
    return `${(x + dx).toFixed(1)} ${y.toFixed(1)}`;
  });
}

/** Bande entre deux bords (listes de points de haut en bas). */
const band = (left: string[], right: string[]) => `M${left.join(" L")} L${[...right].reverse().join(" L")} Z`;

/** Bandes blanche et rouge (zone à droite du contenu). Le bord gauche ondule sur le bleu. */
function WhiteRed() {
  const left = 30; // marge pour que l'ondulation reste visible
  const split = left + (W - left) * WHITE_SHARE;
  const edgeBlue = edge(left, 18, 0);
  const edgeRed = edge(split, 24, 1.3); // plus loin de la hampe : onde plus ample, décalée
  const outer = [`${W + 40} 0`, `${W + 40} ${H}`];
  return (
    <svg
      className="flag-wave absolute inset-x-0 top-0 w-full"
      style={{ height: H }}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Le bord blanc/rouge est le même tracé pour les deux bandes : aucun jour entre elles */}
      <path fill={WHITE} d={band(edgeBlue, edgeRed)} />
      <path fill={RED} d={band(edgeRed, outer)} />
    </svg>
  );
}

/** Éclairage statique (hampe / bout du drapeau, haut / bas). */
function Shading() {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="flag-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="flag-vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#flag-light)" />
      <rect width="100" height="100" fill="url(#flag-vignette)" />
    </svg>
  );
}

export function HeroFlag({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let started = false;
    let visible = true;

    /** data-wind : "on" (animé) ou "paused" (figé sur place) ; absent = pas encore démarré. */
    const update = () => {
      if (started) section.dataset.wind = visible && !document.hidden ? "on" : "paused";
    };

    // Démarre après le chargement, quand le navigateur est inactif :
    // le premier affichage (LCP) se fait avec un drapeau statique.
    let idle = 0;
    const go = () => {
      started = true;
      update();
    };
    const start = () => {
      // requestIdleCallback absent de Safari : repli sur un délai
      idle =
        typeof requestIdleCallback === "function"
          ? requestIdleCallback(go, { timeout: 3000 })
          : window.setTimeout(go, 1000);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    // Pause quand le hero sort de l'écran ou que l'onglet est caché
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.removeEventListener("load", start);
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle);
      window.clearTimeout(idle);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <section ref={ref} className="relative isolate overflow-hidden" style={{ backgroundColor: BLUE }}>
      <div className="flex">
        {/* Bande bleue : sa largeur suit le contenu */}
        <div className="relative z-10 min-w-0 flex-1 px-4 py-12 md:max-w-[72%] md:flex-initial md:py-20 md:pr-12 md:pl-8 lg:max-w-[62%] lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {children}
        </div>
        {/* Bandes blanche et rouge : la place restante (au moins une bordure sur mobile) */}
        <div className="relative w-20 shrink-0 overflow-hidden md:w-auto md:flex-1" aria-hidden>
          <WhiteRed />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
        {/* Plis du tissu */}
        <div className="flag-folds" />
        <Shading />
      </div>
    </section>
  );
}
