import { ChevronDown, Settings, User as UserIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface UserMenuPlaceholderProps {
  name?: string;
  className?: string;
}

/**
 * Static placeholder for the signed-in user menu. No real auth/session
 * exists yet (docs/architecture.md §1) — the menu items are visible but
 * inert, ready to be wired up later without pretending to be functional now.
 */
export function UserMenuPlaceholder({ name = "Guest User", className }: UserMenuPlaceholderProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md px-1.5 py-1 text-body-sm text-text transition-colors hover:bg-bg",
            "focus-visible:outline-none focus-visible:shadow-focus-ring",
            className,
          )}
        >
          <Avatar name={name} size="sm" />
          <span className="max-md:hidden">{name}</span>
          <ChevronDown className="size-3.5 text-text-muted max-md:hidden" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <UserIcon className="size-3.5" aria-hidden="true" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="size-3.5" aria-hidden="true" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
