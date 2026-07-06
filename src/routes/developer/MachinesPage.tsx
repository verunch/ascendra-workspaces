import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Cpu,
  DollarSign,
  ExternalLink,
  FilePlus2,
  MemoryStick,
  Monitor,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  Rocket,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentSection } from "@/components/shared/ContentSection";
import { Grid } from "@/components/shared/Grid";
import { StatCard } from "@/components/shared/StatCard";
import { InfoCard } from "@/components/shared/InfoCard";
import { ActivityFeed, type ActivityItem } from "@/components/shared/ActivityFeed";
import { UsageBarChart } from "@/components/shared/UsageBarChart";
import { StatusDonutChart } from "@/components/shared/StatusDonutChart";
import { QuickActionCard } from "@/components/shared/QuickActionCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterBar } from "@/components/shared/FilterBar";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { ActionMenu, type ActionMenuItem } from "@/components/shared/ActionMenu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeveloperDashboard } from "@/hooks/useDeveloperDashboard";
import { useTemplates } from "@/hooks/useTemplates";
import { useVmLifecycle, type VmLifecycleAction } from "@/hooks/useVmLifecycle";
import { formatRelativeTime, formatUsd } from "@/lib/format";
import type { VM, VMStatus } from "@/types/vm";

const STATUS_FILTER_OPTIONS: { value: VMStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "running", label: "Running" },
  { value: "stopped", label: "Stopped" },
  { value: "starting", label: "Starting" },
  { value: "stopping", label: "Stopping" },
  { value: "error", label: "Error" },
];

/** Which lifecycle actions make sense for a VM's current status. */
function availableLifecycleActions(status: VMStatus): { label: string; action: VmLifecycleAction }[] {
  switch (status) {
    case "running":
      return [
        { label: "Stop", action: "stop" },
        { label: "Restart", action: "restart" },
      ];
    case "stopped":
      return [{ label: "Start", action: "start" }];
    case "error":
      return [{ label: "Restart", action: "restart" }];
    default:
      return []; // starting/stopping — mid-transition, no actions available
  }
}

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function MachinesPage() {
  const { data, isLoading, isError, refetch } = useDeveloperDashboard();
  const templatesQuery = useTemplates();
  const lifecycle = useVmLifecycle();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VMStatus | "all">("all");
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const templateNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const template of templatesQuery.data ?? []) {
      map.set(template.id, template.name);
    }
    return map;
  }, [templatesQuery.data]);

  const tableVms: VM[] = useMemo(() => {
    const vms = data?.vms.filter((vm) => !deletedIds.has(vm.id)) ?? [];
    const query = search.trim().toLowerCase();
    return vms.filter((vm) => {
      const matchesSearch = query === "" || vm.name.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || vm.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data?.vms, deletedIds, search, statusFilter]);

  const activityItems: ActivityItem[] =
    data?.activity.map((event) => ({
      id: event.id,
      icon: event.kind === "created" ? FilePlus2 : PlayCircle,
      title: event.kind === "created" ? `${event.vmName} created` : `${event.vmName} started`,
      timestamp: event.timestamp,
      relativeTime: formatRelativeTime(event.timestamp),
    })) ?? [];

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Machines" }]}
        title="My Machines"
        description="Your developer VMs — status, template, and current resource usage."
      />

      {isLoading ? (
        <LoadingSkeleton variant="cards" cards={4} className="mt-8" />
      ) : isError ? (
        <ErrorState
          className="mt-8"
          description="Couldn't load your dashboard. Your data is safe — try again."
          onRetry={refetch}
        />
      ) : data && data.vms.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Monitor}
          title="No machines yet"
          description="Create your first developer VM to get started."
          action={
            <Button size="sm">
              <Plus className="size-4" /> New machine
            </Button>
          }
        />
      ) : (
        data &&
        <>
          <p className="mt-6 max-w-measure text-body text-text-secondary">
            {timeOfDayGreeting()}, {data.developerName.split(" ")[0]} — {data.runningCount} of{" "}
            {data.vms.length} machines running, averaging {Math.round(data.avgCpuPercent)}% CPU.
          </p>
          <p className="mt-1.5 max-w-measure text-body-sm text-text-muted">
            You have multiple developer workspaces for different projects, environments and
            experiments.
          </p>

          <Card className="mt-6 overflow-hidden">
            <TableToolbar title="Machines" description={`${tableVms.length} of ${data.vms.length} shown`}>
                <FilterBar>
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search machines…"
                    aria-label="Search machines"
                  />
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as VMStatus | "all")}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_FILTER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterBar>
              </TableToolbar>

              {tableVms.length === 0 ? (
                <EmptyState
                  className="rounded-none border-none shadow-none"
                  icon={Monitor}
                  title="No machines match your filters"
                  description="Try a different search term or status filter."
                />
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-body-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-subtle">
                      <th className="px-5 py-2.5 text-left text-overline text-text-muted">Name</th>
                      <th className="px-3 py-2.5 text-left text-overline text-text-muted">Status</th>
                      <th className="px-3 py-2.5 text-left text-overline text-text-muted">Template</th>
                      <th className="px-3 py-2.5 text-right text-overline text-text-muted">CPU</th>
                      <th className="px-3 py-2.5 text-right text-overline text-text-muted">Memory</th>
                      <th className="px-3 py-2.5 text-right text-overline text-text-muted">Disk</th>
                      <th className="px-3 py-2.5 text-right text-overline text-text-muted">Connect</th>
                      <th className="px-5 py-2.5 text-right text-overline text-text-muted">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableVms.map((vm) => {
                      const isRowPending = lifecycle.isPending && lifecycle.variables?.id === vm.id;
                      const isRunning = vm.status === "running";

                      const items: ActionMenuItem[] = [
                        ...availableLifecycleActions(vm.status).map((entry) => ({
                          label: entry.label,
                          icon: entry.action === "start" ? Play : entry.action === "stop" ? Square : RotateCcw,
                          disabled: isRowPending,
                          onSelect: () => lifecycle.mutate({ id: vm.id, action: entry.action }),
                        })),
                        {
                          label: "Delete",
                          icon: Trash2,
                          destructive: true,
                          disabled: isRowPending,
                          onSelect: () => {
                            if (window.confirm(`Delete ${vm.name}? This cannot be undone.`)) {
                              setDeletedIds((prev) => new Set(prev).add(vm.id));
                            }
                          },
                        },
                      ];

                      return (
                        <tr key={vm.id} className="border-b border-border last:border-none hover:bg-bg">
                          <td className="px-5 py-2.5 font-mono text-text">
                            <Link
                              to={`/app/machines/${vm.id}`}
                              className="rounded-sm hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:shadow-focus-ring"
                            >
                              {vm.name}
                            </Link>
                          </td>
                          <td className="px-3 py-2.5">
                            <StatusBadge status={vm.status} />
                          </td>
                          <td className="px-3 py-2.5 text-text-secondary">
                            {templateNameById.get(vm.templateId) ?? vm.templateId}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                            {vm.cpuUsagePercent}%
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                            {vm.memoryUsagePercent}%
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                            {vm.diskUsagePercent}%
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <Button variant="primary" size="sm" disabled={!isRunning}>
                              <ExternalLink className="size-3.5" /> Connect
                            </Button>
                          </td>
                          <td className="px-5 py-2.5 text-right">
                            <ActionMenu items={items} triggerLabel={`Actions for ${vm.name}`} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              )}
            </Card>

          <ContentSection
            title="Overview & Activity"
            description="Secondary — aggregate usage, cost, and recent activity across your machines."
            className="mt-10"
          >
            <Grid cols={4}>
              <StatCard
                label="Running VMs"
                value={data.runningCount}
                unit={`of ${data.vms.length}`}
                icon={Monitor}
              />
              <StatCard
                label="Avg CPU (running)"
                value={Math.round(data.avgCpuPercent)}
                unit="%"
                icon={Cpu}
              />
              <StatCard
                label="Avg memory (running)"
                value={Math.round(data.avgMemoryPercent)}
                unit="%"
                icon={MemoryStick}
              />
              <StatCard
                label="Est. monthly cost"
                value={formatUsd(data.estimatedMonthlyCost)}
                icon={DollarSign}
              />
            </Grid>

            <Grid cols={2} className="mt-4">
              <Card>
                <CardHeader>
                  <h3 className="text-title-sm text-text-heading">Utilization by machine</h3>
                </CardHeader>
                <CardContent>
                  <UsageBarChart data={data.perVmUsage} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-title-sm text-text-heading">Status distribution</h3>
                </CardHeader>
                <CardContent>
                  <StatusDonutChart data={data.statusDistribution} />
                </CardContent>
              </Card>
            </Grid>
            <InfoCard
              className="mt-4"
              title="Allocated resources"
              rows={[
                { label: "Total vCPU", value: `${data.totalVCpu} cores` },
                { label: "Total memory", value: `${data.totalMemoryGb} GB` },
                { label: "Total disk", value: `${data.totalDiskGb} GB` },
              ]}
            />

            <Grid cols={2} className="mt-4">
              <Card>
                <CardHeader>
                  <h3 className="text-title-sm text-text-heading">Recent Activity</h3>
                </CardHeader>
                <CardContent>
                  {activityItems.length > 0 ? (
                    <ActivityFeed items={activityItems} />
                  ) : (
                    <p className="text-body-sm text-text-muted">No recent activity.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-title-sm text-text-heading">Quick Actions</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 max-[1100px]:grid-cols-1">
                    <QuickActionCard icon={Plus} label="Create VM" description="Provision a new dev machine" />
                    <QuickActionCard
                      icon={Rocket}
                      label="Deploy Template"
                      description="Launch from a saved template"
                    />
                    <QuickActionCard icon={Upload} label="Import Image" description="Bring your own base image" />
                    <QuickActionCard
                      icon={BookOpen}
                      label="Documentation"
                      description="Guides and API reference"
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </ContentSection>
        </>
      )}
    </PageContainer>
  );
}
