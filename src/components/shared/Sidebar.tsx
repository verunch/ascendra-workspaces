import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
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
  items: SidebarNavItem[];
  widthClassName: string;
}

/**
 * Generic sidebar shell reused by both DeveloperShell and AdminShell —
 * tone/items/width are the only differences (docs/architecture.md §6).
 * Collapses to an icon rail below the tablet breakpoint so content never
 * needs to scroll horizontally.
 */
export function Sidebar({ tone, brandLabel, brandSublabel, items, widthClassName }: SidebarProps) {
  const isDark = tone === "dark";

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r max-md:w-16",
        widthClassName,
        isDark ? "border-primary-900 bg-primary-900" : "border-border bg-surface",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 px-5 py-5",
          !isDark && "border-b border-border",
        )}
      >
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-700",
            isDark && "border border-primary-400",
          )}
        >
          <div className="size-2.5 rotate-45 rounded-sm border-2 border-primary-300" aria-hidden="true" />
        </div>
        <div className="min-w-0 leading-tight max-md:hidden">
          <p className={cn("truncate text-body-sm font-semibold", isDark ? "text-on-primary" : "text-text-heading")}>
            {brandLabel}
          </p>
          <p className={cn("truncate text-caption font-mono", isDark ? "text-primary-300" : "text-text-muted")}>
            {brandSublabel}
          </p>
        </div>
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
