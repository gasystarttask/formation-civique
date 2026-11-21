/** Squelette affiché pendant la résolution des paramètres d'URL. */
export function PageSkeleton() {
  return (
    <main aria-busy="true" className="mx-auto max-w-7xl animate-pulse px-4 py-8 md:px-8 md:py-12">
      <div className="h-7 w-64 rounded-md bg-gray-100" />
      <div className="mt-8 h-9 w-2/3 max-w-xl rounded-md bg-gray-100" />
      <div className="mt-4 h-5 w-1/2 max-w-md rounded-md bg-gray-100" />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-gray-50 ring-1 ring-gray-200" />
        <div className="h-64 rounded-xl bg-gray-50 ring-1 ring-gray-200" />
      </div>
    </main>
  );
}
