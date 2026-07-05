/** Centralized TanStack Query keys, kept next to the client instead of the API layer. */
export const queryKeys = {
  vms: {
    all: ["vms"] as const,
    detail: (id: string) => ["vms", id] as const,
  },
  templates: {
    all: ["templates"] as const,
    detail: (id: string) => ["templates", id] as const,
  },
  users: {
    all: ["users"] as const,
  },
  fleetUtilization: {
    all: ["fleet-utilization"] as const,
  },
};
