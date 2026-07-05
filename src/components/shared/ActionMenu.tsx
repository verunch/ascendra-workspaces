import type { ComponentType } from "react";
import { MoreHorizontal } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ActionMenuItem {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  align?: "start" | "end";
  /** Accessible name for the trigger — there's no visible label, only an icon. */
  triggerLabel?: string;
  className?: string;
}

/** Row-level "more actions" menu (e.g. Start/Stop/Restart on a VM row). */
export function ActionMenu({
  items,
  align = "end",
  triggerLabel = "Open actions menu",
  className,
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton variant="ghost" size="sm" aria-label={triggerLabel} className={className}>
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.label}
              disabled={item.disabled}
              destructive={item.destructive}
              onSelect={item.onSelect}
            >
              {Icon && <Icon className="size-3.5" aria-hidden="true" />}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
