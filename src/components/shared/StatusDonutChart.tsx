import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";
import type { Status } from "@/types/status";

const statusLabel: Record<Status, string> = {
  running: "Running",
  stopped: "Stopped",
  starting: "Starting",
  stopping: "Stopping",
  provisioning: "Provisioning",
  updating: "Updating",
  suspended: "Suspended",
  error: "Error",
};

const statusColor: Record<Status, string> = {
  running: CHART_COLORS.success,
  stopped: CHART_COLORS.neutral,
  starting: CHART_COLORS.warning,
  stopping: CHART_COLORS.warning,
  provisioning: CHART_COLORS.warning,
  updating: CHART_COLORS.warning,
  suspended: CHART_COLORS.info,
  error: CHART_COLORS.danger,
};

export interface StatusDonutChartProps {
  data: { status: Status; count: number }[];
  /** Accessible description of the chart — falls back to a generated summary. */
  ariaLabel?: string;
  className?: string;
}

/** Donut chart of a status distribution — reuses the same semantic colors as StatusBadge. */
export function StatusDonutChart({ data, ariaLabel, className }: StatusDonutChartProps) {
  const chartData = data.map((d) => ({ ...d, label: statusLabel[d.status] }));
  const summary = chartData.map((d) => `${d.count} ${d.label}`).join(", ");
  const a11y = useChartAccessibility<HTMLDivElement>(
    ariaLabel ?? `Donut chart of status distribution: ${summary}.`,
  );

  return (
    <div {...a11y} className={className} style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart accessibilityLayer={false}>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="label"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            rootTabIndex={-1}
          >
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={statusColor[entry.status]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 6, borderColor: CHART_COLORS.grid, fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
