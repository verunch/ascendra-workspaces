import { PersonaSwitcher } from "./PersonaSwitcher";
import { UserMenuPlaceholder } from "./UserMenuPlaceholder";
import { cn } from "@/lib/utils";

export interface TopHeaderProps {
  /** Subtle surface tint distinguishes the Admin chrome from Developer's plain white (docs/architecture.md §6). */
  tone?: "light" | "dark";
}

export function TopHeader({ tone = "light" }: TopHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 shrink-0 items-center justify-end gap-3 border-b border-border px-6",
        tone === "dark" ? "bg-surface-subtle" : "bg-surface",
      )}
    >
      <PersonaSwitcher />
      <div className="h-6 w-px bg-border" aria-hidden="true" />
      <UserMenuPlaceholder />
    </header>
  );
}
