import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  timestamp: string;
  /** Pre-formatted relative time (e.g. "2h ago") — kept as a prop so formatting stays in one place upstream. */
  relativeTime: string;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

/** Chronological list of recent events — reusable wherever an activity/audit trail is needed. */
export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <ul className={cn("divide-y divide-border", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary-700">
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm text-text">{item.title}</p>
              <time dateTime={item.timestamp} className="text-caption text-text-muted">
                {item.relativeTime}
              </time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
