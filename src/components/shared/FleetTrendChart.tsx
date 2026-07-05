import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";

export interface FleetTrendPoint {
  timestamp: string;
  cpuPercent: number;
  memoryPercent: number;
}

export interface FleetTrendChartProps {
  data: FleetTrendPoint[];
  className?: string;
}

/** Line chart of aggregate CPU/Memory utilization over time (fleet-wide). */
export function FleetTrendChart({ data, className }: FleetTrendChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.timestamp).toLocaleTimeString(undefined, { hour: "2-digit" }),
  }));
  const a11y = useChartAccessibility<HTMLDivElement>(
    "Line chart of aggregate CPU and memory utilization over time across the fleet.",
  );

  return (
    <div {...a11y} className={className} style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} accessibilityLayer={false}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: CHART_COLORS.neutral }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            unit="%"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: CHART_COLORS.neutral }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip contentStyle={{ borderRadius: 6, borderColor: CHART_COLORS.grid, fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="cpuPercent"
            name="CPU"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="memoryPercent"
            name="Memory"
            stroke={CHART_COLORS.info}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
