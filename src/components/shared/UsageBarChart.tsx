import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";

export interface UsageBarChartDatum {
  name: string;
  cpu: number;
  memory: number;
  disk: number;
}

export interface UsageBarChartProps {
  data: UsageBarChartDatum[];
  /** Accessible description of the chart — falls back to a generated summary. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Strips a shared "owner-" style prefix across all names (e.g.
 * "priya-backend-api" / "priya-scratch-sandbox" → "backend-api" /
 * "scratch-sandbox") so chart labels don't repeat redundant context and
 * don't get clipped at narrow widths. Generic — not tied to any specific
 * naming convention.
 */
function stripCommonPrefix(names: string[]): string[] {
  if (names.length < 2) return names;
  const [first, ...rest] = names;
  let prefixLen = first.length;
  for (const name of rest) {
    let i = 0;
    while (i < prefixLen && i < name.length && name[i] === first[i]) i++;
    prefixLen = Math.min(prefixLen, i);
  }
  const lastHyphen = first.slice(0, prefixLen).lastIndexOf("-");
  const cut = lastHyphen > 0 ? lastHyphen + 1 : 0;
  return names.map((name) => name.slice(cut));
}

/**
 * Horizontal grouped bar chart comparing CPU/Memory/Disk % per VM.
 * Horizontal (not vertical) bars specifically because VM names are long
 * and this needs to stay legible from 1440px down to 430px without
 * category labels colliding or being dropped.
 */
export function UsageBarChart({ data, ariaLabel, className }: UsageBarChartProps) {
  const shortNames = stripCommonPrefix(data.map((d) => d.name));
  const chartData = data.map((d, i) => ({ ...d, name: shortNames[i] }));
  const chartHeight = Math.max(180, data.length * 64);
  const a11y = useChartAccessibility<HTMLDivElement>(
    ariaLabel ??
      `Bar chart comparing CPU, memory, and disk utilization across ${data.length} machine${data.length === 1 ? "" : "s"}.`,
  );

  return (
    <div {...a11y} className={className} style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          barCategoryGap={16}
          accessibilityLayer={false}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            unit="%"
            tick={{ fontSize: 12, fill: CHART_COLORS.neutral }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: CHART_COLORS.neutral }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 6,
              borderColor: CHART_COLORS.grid,
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="cpu" name="CPU" fill={CHART_COLORS.primary} radius={[0, 3, 3, 0]} barSize={12} />
          <Bar dataKey="memory" name="Memory" fill={CHART_COLORS.primaryTint} radius={[0, 3, 3, 0]} barSize={12} />
          <Bar dataKey="disk" name="Disk" fill={CHART_COLORS.info} radius={[0, 3, 3, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
