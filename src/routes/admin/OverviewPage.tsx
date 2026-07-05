import { Cpu, DollarSign, MemoryStick, Server, Square, Users } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentSection } from "@/components/shared/ContentSection";
import { Grid } from "@/components/shared/Grid";
import { StatCard } from "@/components/shared/StatCard";
import { FleetTrendChart } from "@/components/shared/FleetTrendChart";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFleetUtilization } from "@/hooks/useFleetUtilization";
import { formatUsd } from "@/lib/format";

export function OverviewPage() {
  const { data, isLoading, isError, refetch } = useFleetUtilization();

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Overview" }]}
        title="Fleet Overview"
        description="Top-level infrastructure health, utilization, and cost across the fleet."
      />

      {isLoading ? (
        <LoadingSkeleton variant="cards" cards={4} className="mt-8" />
      ) : isError ? (
        <ErrorState
          className="mt-8"
          description="Couldn't load fleet metrics. Your data is safe — try again."
          onRetry={refetch}
        />
      ) : (
        data && (
          <>
            <Grid cols={4} className="mt-6">
              <StatCard label="Total VMs" value={data.totalVms} icon={Server} />
              <StatCard
                label="Running"
                value={data.runningVms}
                unit={`of ${data.totalVms}`}
                icon={Server}
              />
              <StatCard label="Stopped" value={data.stoppedVms} icon={Square} />
              <StatCard label="Users" value={data.totalUsers} icon={Users} />
              <StatCard
                label="Avg CPU utilization"
                value={Math.round(data.avgCpuUtilizationPercent)}
                unit="%"
                icon={Cpu}
              />
              <StatCard
                label="Avg memory utilization"
                value={Math.round(data.avgMemoryUtilizationPercent)}
                unit="%"
                icon={MemoryStick}
              />
              <StatCard
                label="Month-to-date cost"
                value={formatUsd(data.monthToDateCost)}
                icon={DollarSign}
              />
              <StatCard
                label="Projected monthly cost"
                value={formatUsd(data.projectedMonthlyCost)}
                icon={DollarSign}
              />
            </Grid>

            <ContentSection
              title="Fleet Utilization"
              description="Aggregate CPU and memory utilization over time."
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <h3 className="text-title-sm text-text-heading">Utilization trend</h3>
                </CardHeader>
                <CardContent>
                  <FleetTrendChart data={data.utilizationTrend} />
                </CardContent>
              </Card>
            </ContentSection>
          </>
        )
      )}
    </PageContainer>
  );
}
