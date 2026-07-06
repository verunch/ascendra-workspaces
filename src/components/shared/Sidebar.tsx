import type { ComponentType } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
}

export interface SidebarProps {
  tone: "light" | "dark";
  brandLabel: string;
  brandSublabel: string;
  /** Route the logo links to — the current persona's dashboard. */
  homeHref: string;
  items: SidebarNavItem[];
  widthClassName: string;
}

/**
 * Generic sidebar shell reused by both DeveloperShell and AdminShell —
 * tone/items/width are the only differences (docs/architecture.md §6).
 * Collapses to an icon rail below the tablet breakpoint so content never
 * needs to scroll horizontally.
 */
export function Sidebar({
  tone,
  brandLabel,
  brandSublabel,
  homeHref,
  items,
  widthClassName,
}: SidebarProps) {
  const isDark = tone === "dark";

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r max-md:w-16",
        widthClassName,
        isDark
          ? "border-primary-900 bg-primary-900"
          : "border-border bg-surface",
      )}
    >
      <div
        className={cn(
          "flex items-center h-14 px-5 py-5 max-md:justify-center max-md:px-1 max-md:py-3",
          !isDark && "border-b border-border",
        )}
      >
        <Link
          to={homeHref}
          aria-label={`${brandLabel} — go to dashboard`}
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:shadow-focus-ring max-md:w-full max-md:justify-center"
        >
          <span
            className={cn(
              "flex shrink-0 items-center rounded-md max-md:w-full",
              isDark && "bg-white px-1.5 py-1 max-md:px-0 max-md:py-0",
            )}
          >
            <img
              src={`${import.meta.env.BASE_URL}company-logo.png`}
              alt={brandLabel}
              className="h-4 w-auto max-w-[110px] object-contain max-md:h-auto max-md:w-full max-md:max-w-none"
            />
          </span>
          <span
            className={cn(
              "truncate text-caption font-mono leading-tight max-md:hidden",
              isDark ? "text-primary-300" : "text-text-muted",
            )}
          >
            {brandSublabel}
          </span>
        </Link>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-0.5">
          {items.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm font-medium transition-colors max-md:justify-center max-md:px-0",
                    isDark
                      ? isActive
                        ? "bg-primary-700 text-on-primary"
                        : "text-primary-100 hover:bg-primary-800 hover:text-on-primary"
                      : isActive
                        ? "bg-primary-subtle text-primary-900"
                        : "text-text-secondary hover:bg-primary-subtle hover:text-primary-700",
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                <span className="max-md:hidden">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
