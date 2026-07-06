import type { ComponentType } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardDelta {
  label: string;
  direction: "up" | "down" | "neutral";
  /** Whether an "up" trend is good news — flips the color for metrics like cost or errors. */
  positiveDirection?: "up" | "down";
}

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: StatCardDelta;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}

const deltaIconByDirection = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

function deltaTone(delta: StatCardDelta): "success" | "danger" | "muted" {
  if (delta.direction === "neutral") return "muted";
  const positive = delta.positiveDirection ?? "up";
  return delta.direction === positive ? "success" : "danger";
}

/** KPI metric card — the desktop-first stat-row pattern from the Design System. */
export function StatCard({ label, value, unit, delta, icon: Icon, className }: StatCardProps) {
  const DeltaIcon = delta ? deltaIconByDirection[delta.direction] : null;
  const tone = delta ? deltaTone(delta) : null;

  return (
    <div className={cn("rounded-md border border-border bg-surface p-5 shadow-card shadow-card_min-width", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-caption text-text-muted">{label}</p>
        {Icon && <Icon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />}
      </div>
      <p className="mt-2.5 font-mono text-display leading-none text-text-heading tabular-nums">
        {value}
        {unit && <span className="ml-1 text-body text-text-muted">{unit}</span>}
      </p>
      {delta && DeltaIcon && (
        <div className="mt-2 flex items-center gap-1.5 text-caption">
          <DeltaIcon
            className={cn(
              "size-3.5",
              tone === "success" && "text-success",
              tone === "danger" && "text-danger",
              tone === "muted" && "text-text-muted",
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "font-semibold",
              tone === "success" && "text-success",
              tone === "danger" && "text-danger",
              tone === "muted" && "text-text-secondary",
            )}
          >
            {delta.label}
          </span>
        </div>
      )}
    </div>
  );
}
