import { ArrowLeft, SearchLg } from "@untitledui/icons";
import { ButtonLink, FeaturedIcon } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <FeaturedIcon icon={SearchLg} size="lg" />
      <h1 className="mt-6 text-3xl font-semibold text-gray-900">Page introuvable</h1>
      <p className="mt-3 text-gray-600">Cette fiche n’existe pas ou a été déplacée.</p>
      <ButtonLink href="/" color="primary" className="mt-8">
        <ArrowLeft aria-hidden />
        Retour à l’accueil
      </ButtonLink>
    </main>
  );
}
