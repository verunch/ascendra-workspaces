import type { ChangeEvent } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible name — defaults to `placeholder` since there's usually no visible <label>. */
  "aria-label"?: string;
  className?: string;
}

/** Thin, consistent wrapper around SearchInput for list/table search fields. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  "aria-label": ariaLabel,
  className,
}: SearchBarProps) {
  return (
    <SearchInput
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      className={cn("max-w-sm", className)}
    />
  );
}
