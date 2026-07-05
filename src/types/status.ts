import type { VMStatus } from "./vm";

/**
 * Generic status vocabulary for the shared StatusBadge component. A
 * superset of VMStatus (unchanged — see vm.ts) plus enterprise-lifecycle
 * terms (Provisioning/Updating/Suspended) needed by non-VM status
 * displays. This does NOT replace or alias VMStatus; it's a separate,
 * broader UI-layer type so StatusBadge stays reusable beyond VMs without
 * touching the VM domain model.
 */
export type Status = VMStatus | "provisioning" | "updating" | "suspended";
