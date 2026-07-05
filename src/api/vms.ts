import type { VM, VMStatus } from "@/types/vm";
import { delayTransition, mockRequest, throwIfSimulatedError } from "./client";
import { findVm, getAllVms, patchVm } from "./store";

export function listVms(): Promise<VM[]> {
  return mockRequest(() => [...getAllVms()], { emptyValue: [] });
}

export function getVm(id: string): Promise<VM> {
  return mockRequest(() => {
    const vm = findVm(id);
    if (!vm) {
      throw new Error(`VM "${id}" was not found.`);
    }
    return { ...vm };
  });
}

/**
 * Immediate transitional status, then a terminal status after a delay —
 * simulates real infra transition time instead of an instant state flip
 * (docs/architecture.md §7).
 */
async function transition(
  id: string,
  transitionalStatus: VMStatus,
  terminalPatch: Partial<VM>,
): Promise<VM> {
  throwIfSimulatedError();

  if (!findVm(id)) {
    throw new Error(`VM "${id}" was not found.`);
  }

  patchVm(id, { status: transitionalStatus });
  await delayTransition();

  return { ...patchVm(id, terminalPatch) };
}

export function startVm(id: string): Promise<VM> {
  const now = new Date().toISOString();
  return transition(id, "starting", { status: "running", startedAt: now, lastActiveAt: now });
}

export function stopVm(id: string): Promise<VM> {
  return transition(id, "stopping", {
    status: "stopped",
    startedAt: null,
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
  });
}

export async function restartVm(id: string): Promise<VM> {
  await transition(id, "stopping", {
    status: "stopped",
    startedAt: null,
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
  });
  return startVm(id);
}
