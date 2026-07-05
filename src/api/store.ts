import vmsData from "../../mock/vms.json";
import templatesData from "../../mock/vm-templates.json";
import usersData from "../../mock/users.json";
import policiesData from "../../mock/policies.json";
import fleetUtilizationData from "../../mock/fleet-utilization.json";

import type { VM } from "@/types/vm";
import type { VMTemplate } from "@/types/template";
import type { User } from "@/types/user";
import type { Policy } from "@/types/policy";
import type { FleetUtilization } from "@/types/fleet";

/**
 * A single in-memory, mutable copy of /mock/*.json, seeded once per
 * session. /mock is the single source of truth for data
 * (docs/data-model.md); this store never writes back to those files —
 * mutations (start/stop a VM, create/edit a template) only live for the
 * lifetime of the tab.
 */
interface MockStore {
  vms: VM[];
  templates: VMTemplate[];
  users: User[];
  policies: Policy[];
  fleetUtilization: FleetUtilization;
}

function seedStore(): MockStore {
  return structuredClone({
    vms: vmsData as VM[],
    templates: templatesData as VMTemplate[],
    users: usersData as User[],
    policies: policiesData as Policy[],
    fleetUtilization: fleetUtilizationData as FleetUtilization,
  });
}

const store: MockStore = seedStore();

/** Restores the store to its original /mock/*.json snapshot. */
export function resetStore(): void {
  Object.assign(store, seedStore());
}

// --- VMs ---

export function getAllVms(): VM[] {
  return store.vms;
}

export function findVm(id: string): VM | undefined {
  return store.vms.find((vm) => vm.id === id);
}

export function patchVm(id: string, patch: Partial<VM>): VM {
  const vm = findVm(id);
  if (!vm) {
    throw new Error(`VM "${id}" was not found.`);
  }
  Object.assign(vm, patch);
  return vm;
}

// --- Templates ---

export function getAllTemplates(): VMTemplate[] {
  return store.templates;
}

export function findTemplate(id: string): VMTemplate | undefined {
  return store.templates.find((template) => template.id === id);
}

export function insertTemplate(template: VMTemplate): VMTemplate {
  store.templates.push(template);
  return template;
}

export function patchTemplate(id: string, patch: Partial<VMTemplate>): VMTemplate {
  const template = findTemplate(id);
  if (!template) {
    throw new Error(`Template "${id}" was not found.`);
  }
  Object.assign(template, patch);
  return template;
}

// --- Users ---

export function getAllUsers(): User[] {
  return store.users;
}

export function findUser(id: string): User | undefined {
  return store.users.find((user) => user.id === id);
}

// --- Policies ---
// Policies & quotas are explicitly out of scope as a screen
// (docs/architecture.md §1 / §12), so only store access is provided —
// no service/hook layer is built on top until a consumer exists.

export function getAllPolicies(): Policy[] {
  return store.policies;
}

// --- Fleet utilization ---

export function getFleetUtilizationSnapshot(): FleetUtilization {
  return store.fleetUtilization;
}
