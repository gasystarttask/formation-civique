import Link from "next/link";
import type { ComponentProps, FC, ReactNode, SVGProps } from "react";
import { ChevronRight, Home02 } from "@untitledui/icons";

type Icon = FC<SVGProps<SVGSVGElement>>;

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* Badge (pill) */
export function Badge({
  children,
  color = "gray",
}: {
  children: ReactNode;
  color?: "gray" | "brand" | "success";
}) {
  const colors = {
    gray: "bg-gray-50 text-gray-700 ring-gray-200",
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    success: "bg-success-50 text-success-700 ring-success-200",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        colors[color],
      )}
    >
      {children}
    </span>
  );
}

/* Featured icon – style "light", cercle */
export function FeaturedIcon({ icon: Icon, size = "md" }: { icon: Icon; size?: "sm" | "md" | "lg" }) {
  const s = {
    sm: "size-8 ring-4 [&>svg]:size-4",
    md: "size-10 ring-6 [&>svg]:size-5",
    lg: "size-12 ring-8 [&>svg]:size-6",
  };
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 ring-brand-50 dark:text-brand-700",
        s[size],
      )}
    >
      <Icon aria-hidden />
    </span>
  );
}

/* Boutons */
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-semibold shadow-xs transition-colors [&>svg]:size-5 [&>svg]:shrink-0";
const buttonColors = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 dark:hover:bg-brand-500 ring-1 ring-inset ring-brand-600",
  secondary: "bg-base text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-800",
  tertiary: "text-gray-600 shadow-none hover:bg-gray-50 hover:text-gray-700",
};
export type ButtonColor = keyof typeof buttonColors;
export const buttonClass = (color: ButtonColor = "secondary", extra?: string) =>
  cx(buttonBase, buttonColors[color], extra);

export function ButtonLink({
  color = "secondary",
  className,
  ...props
}: ComponentProps<typeof Link> & { color?: ButtonColor }) {
  return <Link className={buttonClass(color, className)} {...props} />;
}

/* Fil d'Ariane */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d’Ariane">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
        <li className="flex">
          <Link href="/" className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500">
            <Home02 className="size-5" aria-hidden />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1.5">
            <ChevronRight className="size-4 shrink-0 text-gray-300" aria-hidden />
            {item.href ? (
              <Link
                href={item.href}
                className="truncate rounded-md px-2 py-1 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate rounded-md bg-gray-50 px-2 py-1 text-gray-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { cx };
