import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, FilePlus2, Monitor, Play, PlayCircle, RotateCcw, Square } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentSection } from "@/components/shared/ContentSection";
import { Grid } from "@/components/shared/Grid";
import { InfoCard } from "@/components/shared/InfoCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ActivityFeed, type ActivityItem } from "@/components/shared/ActivityFeed";
import { FleetTrendChart } from "@/components/shared/FleetTrendChart";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVm } from "@/hooks/useVm";
import { useTemplates } from "@/hooks/useTemplates";
import { useVmLifecycle, type VmLifecycleAction } from "@/hooks/useVmLifecycle";
import { CURRENT_DEVELOPER_ID } from "@/hooks/useDeveloperDashboard";
import { formatDuration, formatRelativeTime } from "@/lib/format";
import { generateVmUsageTrend } from "@/lib/vmUsageTrend";
import type { VMStatus } from "@/types/vm";

/**
 * Kept local rather than shared with MachinesPage.tsx — small, page-scoped,
 * and this milestone explicitly avoids modifying that screen or extracting
 * new shared abstractions.
 */
function availableLifecycleActions(status: VMStatus): {
  label: string;
  action: VmLifecycleAction;
  icon: typeof Play;
}[] {
  switch (status) {
    case "running":
      return [
        { label: "Stop", action: "stop", icon: Square },
        { label: "Restart", action: "restart", icon: RotateCcw },
      ];
    case "stopped":
      return [{ label: "Start", action: "start", icon: Play }];
    case "error":
      return [{ label: "Restart", action: "restart", icon: RotateCcw }];
    default:
      return []; // starting/stopping — mid-transition, no actions available
  }
}

export function MachineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vmQuery = useVm(id);
  const templatesQuery = useTemplates();
  const lifecycle = useVmLifecycle();

  const isLoading = vmQuery.isLoading || templatesQuery.isLoading;
  const isError = vmQuery.isError || templatesQuery.isError;
  const vm = vmQuery.data;
  const usageTrend = useMemo(() => (vm ? generateVmUsageTrend(vm) : []), [vm]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          breadcrumbs={[{ label: "Machines", to: "/app/machines" }, { label: id ?? "VM Detail" }]}
          title={id ?? "VM Detail"}
          description="Usage over time, metadata, and lifecycle controls for a single machine."
        />
        <LoadingSkeleton className="mt-8" />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader
          breadcrumbs={[{ label: "Machines", to: "/app/machines" }, { label: id ?? "VM Detail" }]}
          title={id ?? "VM Detail"}
          description="Usage over time, metadata, and lifecycle controls for a single machine."
        />
        <ErrorState
          className="mt-8"
          description="Couldn't load this machine. Your data is safe — try again."
          onRetry={() => {
            vmQuery.refetch();
            templatesQuery.refetch();
          }}
        />
      </PageContainer>
    );
  }

  if (!vm || vm.ownerId !== CURRENT_DEVELOPER_ID) {
    return (
      <PageContainer>
        <PageHeader
          breadcrumbs={[{ label: "Machines", to: "/app/machines" }, { label: id ?? "VM Detail" }]}
          title={id ?? "VM Detail"}
          description="Usage over time, metadata, and lifecycle controls for a single machine."
        />
        <EmptyState
          className="mt-8"
          icon={Monitor}
          title="Machine not found"
          description="This machine doesn't exist or isn't one of yours."
          action={
            <Button asChild size="sm">
              <Link to="/app/machines">Back to Machines</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const template = templatesQuery.data?.find((t) => t.id === vm.templateId);
  const isRunning = vm.status === "running";
  const isRowPending = lifecycle.isPending && lifecycle.variables?.id === vm.id;

  const activityItems: ActivityItem[] = [
    ...(vm.startedAt
      ? [
          {
            id: `${vm.id}-started`,
            icon: PlayCircle,
            title: `${vm.name} started`,
            timestamp: vm.startedAt,
            relativeTime: formatRelativeTime(vm.startedAt),
          },
        ]
      : []),
    {
      id: `${vm.id}-created`,
      icon: FilePlus2,
      title: `${vm.name} created`,
      timestamp: vm.createdAt,
      relativeTime: formatRelativeTime(vm.createdAt),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Machines", to: "/app/machines" }, { label: vm.name }]}
        title={vm.name}
        description={template ? `${template.name} · ${vm.region}` : vm.region}
        action={<StatusBadge status={vm.status} />}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button disabled={!isRunning}>
          <ExternalLink className="size-4" /> Connect
        </Button>
        {availableLifecycleActions(vm.status).map(({ label, action, icon: Icon }) => (
          <Button
            key={action}
            variant="secondary"
            disabled={isRowPending}
            onClick={() => lifecycle.mutate({ id: vm.id, action })}
          >
            <Icon className="size-4" /> {label}
          </Button>
        ))}
      </div>

      <Grid cols={2} className="mt-8">
        <InfoCard
          title="Machine metadata"
          rows={[
            { label: "Template", value: template?.name ?? vm.templateId },
            { label: "vCPU", value: template ? `${template.vCpu} cores` : "—" },
            { label: "Memory", value: template ? `${template.memoryGb} GB` : "—" },
            { label: "Disk", value: template ? `${template.diskSizeGb} GB` : "—" },
            { label: "Base image", value: template?.baseImage ?? "—" },
            { label: "Region", value: vm.region },
            {
              label: "Uptime",
              value: isRunning && vm.startedAt ? formatDuration(vm.startedAt) : "—",
            },
            {
              label: "Created",
              value: new Date(vm.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            },
          ]}
        />

        <Card>
          <CardHeader>
            <h3 className="text-title-sm text-text-heading">Usage over time</h3>
          </CardHeader>
          <CardContent>
            {vm.status === "stopped" ? (
              <p className="text-body-sm text-text-muted">
                This machine is stopped — no live usage data.
              </p>
            ) : (
              <>
                <FleetTrendChart
                  data={usageTrend}
                  ariaLabel={`Line chart of CPU and memory utilization for ${vm.name} over the last 24 hours.`}
                />
                <p className="mt-2 text-caption text-text-muted">
                  CPU and memory over the last 24 hours · Disk: {vm.diskUsagePercent}%
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      <ContentSection title="Activity" className="mt-8">
        <Card>
          <CardContent>
            <ActivityFeed items={activityItems} />
          </CardContent>
        </Card>
      </ContentSection>
    </PageContainer>
  );
}
