import type { Status } from "@/types/status";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<Status, { label: string; variant: "success" | "neutral" | "warning" | "danger" | "info" }> = {
  running: { label: "Running", variant: "success" },
  stopped: { label: "Stopped", variant: "neutral" },
  starting: { label: "Starting", variant: "warning" },
  stopping: { label: "Stopping", variant: "warning" },
  provisioning: { label: "Provisioning", variant: "warning" },
  updating: { label: "Updating", variant: "warning" },
  suspended: { label: "Suspended", variant: "info" },
  error: { label: "Error", variant: "danger" },
};

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}

/**
 * Maps a Status to a labelled, dotted badge — status is never color-only.
 * Reuses the same semantic colors everywhere a status appears (success =
 * green, neutral = gray, warning = amber for transitional states, danger =
 * red, info = blue for administratively-suspended states).
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, variant } = statusConfig[status];
  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  );
}
