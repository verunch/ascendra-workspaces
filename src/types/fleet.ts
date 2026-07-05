export interface FleetUtilizationTrendPoint {
  timestamp: string;
  cpuPercent: number;
  memoryPercent: number;
  runningVms: number;
}

/**
 * Powers the admin Fleet Overview screen.
 *
 * Note: the assignment's suggested shape also includes a `vmMetrics[]`
 * snapshot array for the inventory view, but mock/fleet-utilization.json
 * does not provide it (docs/architecture.md §12). VM Inventory instead
 * computes per-VM CPU/memory/disk directly from VM records.
 */
export interface FleetUtilization {
  period: string; // "real-time" | "last-24-hours" | "last-30-days"

  // Counts
  totalVms: number;
  runningVms: number;
  stoppedVms: number;
  totalUsers: number;

  // Aggregate utilization (right now)
  avgCpuUtilizationPercent: number;
  peakCpuUtilizationPercent: number;
  avgMemoryUtilizationPercent: number;
  peakMemoryUtilizationPercent: number;

  // Cost
  totalHourlyCost: number; // USD/hour
  monthToDateCost: number; // USD
  projectedMonthlyCost: number; // USD

  // Trend for charting
  utilizationTrend: FleetUtilizationTrendPoint[];
}
