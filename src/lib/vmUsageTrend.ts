import type { VM } from "@/types/vm";
import type { FleetTrendPoint } from "@/components/shared/FleetTrendChart";

const TREND_HOURS = 24;

/** Simple string hash → 32-bit seed, so each VM gets a stable-looking trend. */
function seedFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

/** Deterministic PRNG (mulberry32) — same VM id always produces the same trend. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function walkToward(current: number, target: number, random: () => number): number {
  const next = current + (random() - 0.5) * 14;
  const clamped = Math.min(100, Math.max(0, next));
  return clamped + (target - clamped) * 0.15;
}

/**
 * The mock dataset only stores current utilization, not history, so a VM's
 * "usage over time" chart is synthesized here: a deterministic random walk
 * that ends exactly at the VM's current CPU/memory reading. Derived from
 * already-fetched query data — not a hardcoded UI value.
 */
export function generateVmUsageTrend(vm: VM): FleetTrendPoint[] {
  const random = mulberry32(seedFromId(vm.id));
  const now = Date.now();
  const points: { cpu: number; memory: number }[] = [
    { cpu: vm.cpuUsagePercent, memory: vm.memoryUsagePercent },
  ];

  for (let i = 1; i < TREND_HOURS; i++) {
    const prev = points[i - 1];
    points.push({
      cpu: walkToward(prev.cpu, vm.cpuUsagePercent, random),
      memory: walkToward(prev.memory, vm.memoryUsagePercent, random),
    });
  }
  points.reverse();

  return points.map((point, index) => ({
    timestamp: new Date(now - (TREND_HOURS - 1 - index) * 60 * 60 * 1000).toISOString(),
    cpuPercent: Math.round(point.cpu),
    memoryPercent: Math.round(point.memory),
  }));
}
