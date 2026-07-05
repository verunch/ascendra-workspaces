import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `tailwind-merge` only recognizes color/size values out of the box —
 * it has no knowledge of this project's custom theme (tailwind.config.ts).
 * Without this extension, a custom color suffix (e.g. `text-on-primary`)
 * and a custom font-size suffix (e.g. `text-body-sm`) both look like
 * unrecognized `text-*` fragments to it, so it silently treats them as
 * conflicting and keeps only the last one — this is exactly how a
 * semantic color token could be dropped from a merged className despite
 * being present in the component's source. Registering every custom
 * suffix below makes conflict resolution correct instead of accidental,
 * so `cn()` is safe to use with any token defined in the theme.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["overline", "caption", "body-sm", "body", "title-sm", "h1", "h2", "display"],
        },
      ],
      "text-color": [
        {
          text: ["text", "secondary", "muted", "faint", "heading", "3"],
        },
        "on-primary",
        "background",
        "foreground",
        "card-foreground",
        "popover-foreground",
        "secondary-foreground",
        "muted-foreground",
        "accent-foreground",
        "destructive-foreground",
        "success-foreground",
        "warning-foreground",
        "danger-foreground",
        "info-foreground",
        "danger",
      ],
      "bg-color": [
        {
          bg: [
            "bg",
            "surface",
            "surface-subtle",
            "border",
            "border-strong",
            "background",
            "foreground",
            "card",
            "popover",
            "secondary",
            "muted",
            "accent",
            "destructive",
            "success",
            "success-subtle",
            "warning",
            "warning-subtle",
            "danger",
            "danger-subtle",
            "info",
            "info-subtle",
            "text-muted",
          ],
        },
      ],
      "border-color": [
        {
          border: [
            "border",
            "border-strong",
            "success-border",
            "warning-border",
            "danger-border",
            "info-border",
            "input",
            "danger",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
