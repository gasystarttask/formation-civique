// Scrape les fiches de révision "par journée" de formation-civique.interieur.gouv.fr
// Contenu sous licence etalab-2.0.
// Usage : node scripts/scrape.mjs  -> écrit src/data/content.json
import * as cheerio from "cheerio";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const ORIGIN = "https://formation-civique.interieur.gouv.fr";
const ROOT = "/fiches-par-journ%C3%A9e/";
const CACHE_DIR = ".cache/pages";
const OUT = "src/data/content.json";

await mkdir(CACHE_DIR, { recursive: true });

async function fetchPage(url) {
  const key = createHash("sha1").update(url).digest("hex");
  const file = path.join(CACHE_DIR, `${key}.html`);
  try {
    return await readFile(file, "utf8");
  } catch {}
  const res = await fetch(ORIGIN + url, {
    headers: { "User-Agent": "formation-civique-revision (static mirror)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const html = await res.text();
  await writeFile(file, html);
  await new Promise((r) => setTimeout(r, 250));
  return html;
}

const clean = (s) => s.replace(/\s+/g, " ").trim();
const normUrl = (href) => {
  const u = new URL(href, ORIGIN);
  return u.origin === ORIGIN ? u.pathname : null;
};
const lastSlug = (url) =>
  decodeURIComponent(url.replace(/\/$/, "").split("/").pop())
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Le site tronque certaines descriptions de cartes ("…", "[…]") : on ne garde que les textes complets. */
const fullDescription = (t) => (!t || /(…|\.\.\.|\[…\])$/.test(t) ? undefined : t);

/** Liens de cartes "enlarge-link" présents dans le contenu principal (pages index). */
function childLinks($) {
  const links = [];
  $("main .fr-card.fr-enlarge-link").each((_, card) => {
    const a = $(card).find(".fr-card__title a").first();
    const href = a.attr("href");
    if (!href) return;
    const url = normUrl(href);
    if (!url) return;
    links.push({
      url,
      title: clean(a.text()),
      description: fullDescription(clean($(card).find(".fr-card__desc").text())),
    });
  });
  return links;
}

const fiches = {};
const ficheIdByUrl = {};
const unsupported = new Map();

function ficheId(url) {
  if (ficheIdByUrl[url]) return ficheIdByUrl[url];
  const base = lastSlug(url);
  const taken = new Set(Object.values(ficheIdByUrl));
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}--${n}`;
  ficheIdByUrl[url] = id;
  return id;
}

/** Transforme le contenu DSFR d'une fiche en HTML simple et propre. */
function extractFiche($) {
  const out = [];
  const objectives = [];
  let objectivesTitle;
  const resources = [];

  $("main > .fr-container").each((_, el) => {
    const $el = $(el);
    const cls = $el.attr("class") || "";
    if ($el.find("h1").length || $el.find(".fr-breadcrumb").length) return;
    if (cls.includes("cmsfr-block-separator")) return;

    if ($el.find(".fr-card--grey").length && /objectif/i.test($el.text())) {
      objectivesTitle = clean($el.find(".fr-card__title").first().text()).replace(/\s*:$/, "") || undefined;
      $el.find(".fr-card__desc").each((_, p) => {
        const t = clean($(p).text());
        if (t) objectives.push(t);
      });
      return;
    }
    if (cls.includes("cmsfr-block-callout")) {
      $el.find(".fr-sr-only").remove();
      const title = clean($el.find(".fr-callout__title").text());
      const body = $el.find(".fr-callout__text").clone();
      body.find("a").remove();
      const onlyLinks = !clean(body.text());
      if (/aller plus loin/i.test(title) && onlyLinks && $el.find(".fr-callout").length === 1) {
        $el.find("a[href]").each((_, a) => {
          resources.push({
            label: clean($(a).text()),
            href: new URL($(a).attr("href"), ORIGIN).href,
          });
        });
        return;
      }
      $el.find(".fr-callout__title").each((_, t) => {
        $(t).replaceWith(`<h3>${$(t).html()}</h3>`);
      });
      $el.find(".fr-callout").each((_, c) => {
        out.push(`<aside class="callout">${$(c).html()}</aside>`);
      });
      return;
    }
    if (cls.includes("cmsfr-block-imageandtext")) {
      const cols = $el.find(".fr-grid-row > [class*='fr-col']");
      const parts = cols.map((_, c) => $(c).html()).get();
      out.push(
        `<div class="media">${parts.map((p, i) => `<div class="${i === parts.length - 1 && parts.length > 1 ? "media-aside" : "media-body"}">${p}</div>`).join("")}</div>`,
      );
      return;
    }
    if (cls.includes("cmsfr-block-transcription")) {
      const body = $el.find(".fr-modal__content").clone();
      body.find(".fr-modal__title").remove();
      out.push(`<details><summary>Transcription</summary>${body.html()}</details>`);
      return;
    }
    if (cls.includes("cmsfr-block-link")) {
      $el.find("a.fr-link").each((_, a) => {
        const detail = clean($(a).find(".fr-link__detail").text());
        $(a).find(".fr-link__detail").remove();
        const p = cheerio.load("<p></p>", null, false);
        p("p").append(p("<a></a>").attr("href", $(a).attr("href")).text(clean($(a).text())));
        if (detail) p("p").append(" ").append(p("<small></small>").text(`(${detail})`));
        out.push(p.html());
      });
      return;
    }
    if (cls.includes("fr-my-4w") && !$el.text().trim()) return;
    const kind = cls.split(/\s+/).find((c) => c.startsWith("cmsfr-block-")) || "raw";
    if (!["cmsfr-block-paragraph", "cmsfr-block-image", "cmsfr-block-item_grid"].includes(kind)) {
      unsupported.set(kind, (unsupported.get(kind) || 0) + 1);
    }
    out.push($el.html());
  });

  return { objectivesTitle, objectives, resources, html: sanitize(out.join("\n")) };
}

const ALLOWED = new Set([
  "h2", "h3", "h4", "h5", "p", "ul", "ol", "li", "b", "strong", "i", "em", "a", "img",
  "br", "hr", "table", "thead", "tbody", "tr", "th", "td", "blockquote", "aside", "div",
  "span", "figure", "figcaption", "iframe", "sup", "sub", "u", "caption", "details", "summary", "small",
]);
const KEEP_ATTRS = {
  a: ["href"],
  img: ["src", "alt", "width", "height"],
  iframe: ["src", "title"],
  aside: ["class"],
  div: ["class"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan", "scope"],
};

function sanitize(html) {
  const $ = cheerio.load(`<root>${html}</root>`, null, false);
  $(".fr-sr-only, script, style, button").remove();
  $("*").each((_, el) => {
    if (el.type !== "tag" || el.name === "root") return;
    const tag = el.name;
    if (!ALLOWED.has(tag)) {
      unsupported.set(`tag:${tag}`, (unsupported.get(`tag:${tag}`) || 0) + 1);
      $(el).replaceWith($(el).contents());
      return;
    }
    const keep = KEEP_ATTRS[tag] || [];
    for (const name of Object.keys(el.attribs)) {
      if (!keep.includes(name)) $(el).removeAttr(name);
    }
    if (tag === "div" || tag === "aside") {
      const c = $(el).attr("class");
      if (c && !["media", "media-body", "media-aside", "callout"].includes(c)) $(el).removeAttr("class");
    }
    if (tag === "img" || tag === "iframe") {
      const src = $(el).attr("src");
      if (src) $(el).attr("src", new URL(src, ORIGIN).href);
    }
    if (tag === "a") {
      const href = $(el).attr("href");
      if (!href) return;
      const internal = normUrl(href);
      if (internal) $(el).attr("href", `${internal}`).attr("data-internal", "");
      else $(el).attr("target", "_blank").attr("rel", "noopener noreferrer");
    }
  });
  // div/span sans attribut : on aplatit
  let changed = true;
  while (changed) {
    changed = false;
    $("span:not([class])").each((_, el) => {
      $(el).replaceWith($(el).contents());
      changed = true;
    });
    $("div:not([class])").each((_, el) => {
      $(el).replaceWith($(el).contents());
      changed = true;
    });
  }
  return $("root").html().replace(/\n\s*\n/g, "\n").trim();
}

/** Parcourt récursivement une page index jusqu'aux fiches. */
const indexNodes = new Map(); // url -> nœud (null pendant son exploration, pour couper les cycles)

async function crawl(link, depth = 0) {
  const html = await fetchPage(link.url);
  const $ = cheerio.load(html);
  const title = clean($("main h1").first().text()) || link.title;
  const children = childLinks($);
  process.stdout.write(`${"  ".repeat(depth)}${title}${children.length ? ` (${children.length})` : ""}\n`);

  if (children.length) {
    if (indexNodes.has(link.url)) return indexNodes.get(link.url);
    indexNodes.set(link.url, null);
    const nodes = [];
    for (const c of children) {
      const node = await crawl(c, depth + 1);
      if (node) nodes.push(node);
    }
    const node = { title, description: link.description, children: nodes };
    indexNodes.set(link.url, node);
    return node;
  }

  const id = ficheId(link.url);
  if (!fiches[id]) {
    fiches[id] = {
      id,
      title,
      description: link.description,
      source: ORIGIN + link.url,
      ...extractFiche($),
    };
  }
  return { title, description: link.description, ficheId: id };
}

const rootHtml = await fetchPage(ROOT);
const $root = cheerio.load(rootHtml);
const dayLinks = [];
$root("a[href*='/fiches-par-journ%C3%A9e/journ']").each((_, a) => {
  const url = normUrl($root(a).attr("href"));
  if (url && !dayLinks.some((d) => d.url === url)) dayLinks.push({ url, title: clean($root(a).text()) });
});
const days = [];
for (const d of dayLinks) {
  const node = await crawl(d);
  days.push({ slug: `journee-${days.length + 1}`, ...node });
}

// Réécrit les liens internes vers les routes de l'app
for (const f of Object.values(fiches)) {
  f.html = f.html.replace(/href="([^"]+)" data-internal=""/g, (_, href) => {
    const id = ficheIdByUrl[href];
    return id ? `href="/fiche/${id}"` : `href="${ORIGIN}${href}" target="_blank" rel="noopener noreferrer"`;
  });
}

await writeFile(
  OUT,
  JSON.stringify({ scrapedAt: new Date().toISOString(), source: ORIGIN + ROOT, days, fiches }, null, 1),
);
console.log(`\n${days.length} journées, ${Object.keys(fiches).length} fiches -> ${OUT}`);
if (unsupported.size) console.log("Éléments non standard :", Object.fromEntries(unsupported));
