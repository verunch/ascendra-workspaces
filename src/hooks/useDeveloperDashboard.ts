import { useMemo } from "react";
import { useVms } from "./useVms";
import { useTemplates } from "./useTemplates";
import { useUsers } from "./useUsers";
import type { VM, VMStatus } from "@/types/vm";

/**
 * Stands in for auth (docs/architecture.md §1) — the developer this
 * dashboard is scoped to. No login exists yet, so this is a fixed mock
 * identity rather than a session value.
 */
export const CURRENT_DEVELOPER_ID = "usr-001";

export interface DeveloperActivityEvent {
  id: string;
  vmName: string;
  kind: "created" | "started";
  timestamp: string;
}

export interface DeveloperVmUsage {
  vmId: string;
  name: string;
  cpu: number;
  memory: number;
  disk: number;
}

export interface DeveloperDashboardData {
  developerName: string;
  vms: VM[];
  runningCount: number;
  stoppedCount: number;
  transitionalCount: number;
  avgCpuPercent: number;
  avgMemoryPercent: number;
  estimatedMonthlyCost: number;
  totalVCpu: number;
  totalMemoryGb: number;
  totalDiskGb: number;
  statusDistribution: { status: VMStatus; count: number }[];
  perVmUsage: DeveloperVmUsage[];
  activity: DeveloperActivityEvent[];
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Combines the existing vms/templates/users queries into the derived
 * shape the Developer Dashboard renders. Every number here is computed
 * from real mock JSON scoped to CURRENT_DEVELOPER_ID — nothing is
 * fabricated. Historical per-developer trend data does not exist in the
 * mock dataset, so this deliberately does not synthesize fake deltas;
 * see MachinesPage for how that constraint is handled in the UI.
 */
export function useDeveloperDashboard() {
  const vmsQuery = useVms();
  const templatesQuery = useTemplates();
  const usersQuery = useUsers();

  const isLoading = vmsQuery.isLoading || templatesQuery.isLoading || usersQuery.isLoading;
  const isError = vmsQuery.isError || templatesQuery.isError || usersQuery.isError;

  const data = useMemo<DeveloperDashboardData | undefined>(() => {
    if (!vmsQuery.data || !templatesQuery.data || !usersQuery.data) return undefined;

    const developer = usersQuery.data.find((user) => user.id === CURRENT_DEVELOPER_ID);
    const vms = vmsQuery.data.filter((vm) => vm.ownerId === CURRENT_DEVELOPER_ID);
    const templateById = new Map(templatesQuery.data.map((template) => [template.id, template]));

    const runningVms = vms.filter((vm) => vm.status === "running");
    const stoppedVms = vms.filter((vm) => vm.status === "stopped");
    const transitionalVms = vms.filter((vm) => vm.status === "starting" || vm.status === "stopping");

    const totals = vms.reduce(
      (acc, vm) => {
        const template = templateById.get(vm.templateId);
        if (template) {
          acc.vCpu += template.vCpu;
          acc.memoryGb += template.memoryGb;
          acc.diskGb += template.diskSizeGb;
        }
        return acc;
      },
      { vCpu: 0, memoryGb: 0, diskGb: 0 },
    );

    const statusCounts = new Map<VMStatus, number>();
    for (const vm of vms) {
      statusCounts.set(vm.status, (statusCounts.get(vm.status) ?? 0) + 1);
    }

    const activity: DeveloperActivityEvent[] = vms
      .flatMap((vm): DeveloperActivityEvent[] => {
        const events: DeveloperActivityEvent[] = [
          { id: `${vm.id}-created`, vmName: vm.name, kind: "created", timestamp: vm.createdAt },
        ];
        if (vm.startedAt) {
          events.push({ id: `${vm.id}-started`, vmName: vm.name, kind: "started", timestamp: vm.startedAt });
        }
        return events;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      developerName: developer?.name ?? "Developer",
      vms,
      runningCount: runningVms.length,
      stoppedCount: stoppedVms.length,
      transitionalCount: transitionalVms.length,
      avgCpuPercent: average(runningVms.map((vm) => vm.cpuUsagePercent)),
      avgMemoryPercent: average(runningVms.map((vm) => vm.memoryUsagePercent)),
      estimatedMonthlyCost: runningVms.reduce((sum, vm) => sum + vm.hourlyCost, 0) * 24 * 30,
      totalVCpu: totals.vCpu,
      totalMemoryGb: totals.memoryGb,
      totalDiskGb: totals.diskGb,
      statusDistribution: Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count })),
      perVmUsage: vms.map((vm) => ({
        vmId: vm.id,
        name: vm.name,
        cpu: vm.cpuUsagePercent,
        memory: vm.memoryUsagePercent,
        disk: vm.diskUsagePercent,
      })),
      activity,
    };
  }, [vmsQuery.data, templatesQuery.data, usersQuery.data]);

  const refetch = () => {
    vmsQuery.refetch();
    templatesQuery.refetch();
    usersQuery.refetch();
  };

  return { data, isLoading, isError, refetch };
}
