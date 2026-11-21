export const THEME_KEY = "formation-civique:theme";
const KEY = THEME_KEY;

/**
 * Script exécuté avant le premier rendu (dans <head>) : applique le thème
 * sans flash de la mauvaise couleur.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${KEY}")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light"}catch(_){}})()`;
