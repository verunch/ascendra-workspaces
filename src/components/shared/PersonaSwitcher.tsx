import { useNavigate } from "react-router-dom";
import { usePersona } from "@/app/use-persona";
import type { Persona } from "@/app/persona-context";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Persona; label: string; to: string }[] = [
  { value: "developer", label: "Developer", to: "/app/machines" },
  { value: "admin", label: "Admin", to: "/admin/overview" },
];

export interface PersonaSwitcherProps {
  className?: string;
}

/**
 * Stands in for auth (docs/architecture.md §8) — lets a user move between
 * the Developer and Admin experiences without a login flow.
 */
export function PersonaSwitcher({ className }: PersonaSwitcherProps) {
  const { persona, setPersona } = usePersona();
  const navigate = useNavigate();

  return (
    <div
      role="radiogroup"
      aria-label="Switch persona"
      className={cn("inline-flex rounded-md bg-bg p-0.5", className)}
    >
      {OPTIONS.map((option) => {
        const isActive = persona === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => {
              setPersona(option.value);
              navigate(option.to);
            }}
            className={cn(
              "rounded-md px-3 py-1.5 text-caption font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:shadow-focus-ring",
              isActive
                ? "bg-surface text-primary-700 shadow-card"
                : "text-text-muted hover:text-text",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
