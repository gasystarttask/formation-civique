import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { BookOpen01 } from "@untitledui/icons";
import { HeaderProgress, HeaderProgressBadge } from "@/components/progress";
import { Search } from "@/components/search";
import { GitHubFooterLink, GitHubLink } from "@/components/github-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { themeScript } from "@/lib/theme-script";
import { allFicheIds, days, meta, searchIndex } from "@/lib/content";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Fiches de révision — Formation civique", template: "%s — Formation civique" },
  description: "Révisez les fiches de la formation civique, journée par journée.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* suppressHydrationWarning : certaines extensions injectent leur propre <script> en tête de <head> */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-base/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 md:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs">
                <BookOpen01 className="size-5" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold whitespace-nowrap text-gray-900">Formation civique</span>
                <span className="block text-xs text-gray-500">Fiches de révision</span>
              </span>
            </Link>
            <nav aria-label="Journées" className="ml-4 hidden items-center gap-1 lg:flex">
              {days.map((d) => (
                <Link
                  key={d.slug}
                  href={`/journee/${d.slug}`}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                >
                  {d.title}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <HeaderProgressBadge ids={allFicheIds} />
              <Search entries={searchIndex} />
              <ThemeToggle />
              {/* Masqué sur petit mobile (place) : lien dans le pied de page */}
              <GitHubLink className="hidden sm:flex" />
            </div>
          </div>
          <HeaderProgress days={days.map(({ slug, title, ficheIds }) => ({ slug, title, ficheIds }))} />
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-500 md:px-8">
            Contenus issus de{" "}
            <a href={meta.source} className="font-medium text-gray-700 underline underline-offset-2">
              formation-civique.interieur.gouv.fr
            </a>{" "}
            (ministère de l’Intérieur), sous{" "}
            <a
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              className="font-medium text-gray-700 underline underline-offset-2"
            >
              licence etalab-2.0
            </a>
            . Site non officiel. Mis à jour le{" "}
            {new Date(meta.scrapedAt).toLocaleDateString("fr-FR", { dateStyle: "long" })}.
            <div className="mt-3">
              <GitHubFooterLink />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
