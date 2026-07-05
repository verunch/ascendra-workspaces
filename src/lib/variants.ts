/**
 * Shared disabled-state treatment for form controls (Button, IconButton,
 * Input, Select). Identical across all of them — extracted once so it
 * can't silently drift out of sync between components.
 */
export const DISABLED_CONTROL_CLASSES =
  "disabled:cursor-not-allowed disabled:border-border disabled:bg-bg disabled:text-text-faint";
