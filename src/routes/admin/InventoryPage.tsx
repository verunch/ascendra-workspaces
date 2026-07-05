import { useMemo, useState } from "react";
import { Server } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterBar } from "@/components/shared/FilterBar";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVms } from "@/hooks/useVms";
import { useUsers } from "@/hooks/useUsers";
import { useTemplates } from "@/hooks/useTemplates";
import type { VMStatus } from "@/types/vm";

const STATUS_FILTER_OPTIONS: { value: VMStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "running", label: "Running" },
  { value: "stopped", label: "Stopped" },
  { value: "starting", label: "Starting" },
  { value: "stopping", label: "Stopping" },
  { value: "error", label: "Error" },
];

/** A running VM using under 15% CPU is considered idle/underused. */
const IDLE_CPU_THRESHOLD = 15;

type SortKey = "cpuUsagePercent" | "memoryUsagePercent" | "diskUsagePercent";

export function InventoryPage() {
  const vmsQuery = useVms();
  const usersQuery = useUsers();
  const templatesQuery = useTemplates();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VMStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const isLoading = vmsQuery.isLoading || usersQuery.isLoading || templatesQuery.isLoading;
  const isError = vmsQuery.isError || usersQuery.isError || templatesQuery.isError;

  const userNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const user of usersQuery.data ?? []) map.set(user.id, user.name);
    return map;
  }, [usersQuery.data]);

  const templateNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const template of templatesQuery.data ?? []) map.set(template.id, template.name);
    return map;
  }, [templatesQuery.data]);

  const rows = useMemo(() => {
    const vms = vmsQuery.data ?? [];
    const query = search.trim().toLowerCase();
    let filtered = vms.filter((vm) => {
      const owner = userNameById.get(vm.ownerId) ?? "";
      const matchesSearch =
        query === "" || vm.name.toLowerCase().includes(query) || owner.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || vm.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortKey) {
      filtered = [...filtered].sort((a, b) =>
        sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey],
      );
    }

    return filtered;
  }, [vmsQuery.data, userNameById, search, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "VM Inventory" }]}
        title="VM Inventory"
        description="Search, filter, and inspect every VM across the organization."
      />

      {isLoading ? (
        <LoadingSkeleton className="mt-8" />
      ) : isError ? (
        <ErrorState
          className="mt-8"
          description="Couldn't load the VM inventory. Your data is safe — try again."
          onRetry={() => {
            vmsQuery.refetch();
            usersQuery.refetch();
            templatesQuery.refetch();
          }}
        />
      ) : (
        <Card className="mt-8 overflow-hidden">
          <TableToolbar
            title="All VMs"
            description={`${rows.length} of ${vmsQuery.data?.length ?? 0} shown`}
          >
            <FilterBar>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by VM or owner…"
                aria-label="Search VMs"
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

          {rows.length === 0 ? (
            <EmptyState
              className="rounded-none border-none shadow-none"
              icon={Server}
              title="No VMs match your filters"
              description="Try a different search term or status filter."
            />
          ) : (
            <table className="w-full border-collapse text-body-sm">
              <thead>
                <tr className="border-b border-border bg-surface-subtle">
                  <th className="px-5 py-2.5 text-left text-overline text-text-muted">Name</th>
                  <th className="px-3 py-2.5 text-left text-overline text-text-muted">Owner</th>
                  <th className="px-3 py-2.5 text-left text-overline text-text-muted">Template</th>
                  <th className="px-3 py-2.5 text-left text-overline text-text-muted">Status</th>
                  <th
                    className="cursor-pointer select-none px-3 py-2.5 text-right text-overline text-text-muted"
                    onClick={() => toggleSort("cpuUsagePercent")}
                  >
                    CPU{sortIndicator("cpuUsagePercent")}
                  </th>
                  <th
                    className="cursor-pointer select-none px-3 py-2.5 text-right text-overline text-text-muted"
                    onClick={() => toggleSort("memoryUsagePercent")}
                  >
                    Memory{sortIndicator("memoryUsagePercent")}
                  </th>
                  <th
                    className="cursor-pointer select-none px-5 py-2.5 text-right text-overline text-text-muted"
                    onClick={() => toggleSort("diskUsagePercent")}
                  >
                    Disk{sortIndicator("diskUsagePercent")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((vm) => {
                  const isIdle = vm.status === "running" && vm.cpuUsagePercent < IDLE_CPU_THRESHOLD;
                  return (
                    <tr key={vm.id} className="border-b border-border last:border-none hover:bg-bg">
                      <td className="px-5 py-2.5 font-mono text-text">{vm.name}</td>
                      <td className="px-3 py-2.5 text-text-secondary">
                        {userNameById.get(vm.ownerId) ?? vm.ownerId}
                      </td>
                      <td className="px-3 py-2.5 text-text-secondary">
                        {templateNameById.get(vm.templateId) ?? vm.templateId}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={vm.status} />
                          {isIdle && <Badge variant="warning">Idle</Badge>}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                        {vm.cpuUsagePercent}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                        {vm.memoryUsagePercent}%
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono tabular-nums text-text">
                        {vm.diskUsagePercent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </PageContainer>
  );
}
