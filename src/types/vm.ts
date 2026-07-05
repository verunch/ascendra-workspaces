export type VMStatus = "running" | "stopped" | "starting" | "stopping" | "error";

export interface VM {
  id: string;
  name: string;
  ownerId: string;
  templateId: string;
  status: VMStatus;
  region: string;

  // Timestamps
  createdAt: string; // ISO timestamp
  startedAt: string | null;
  lastActiveAt: string; // used for idle detection

  // Current resource usage
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;

  // Cost
  hourlyCost: number; // USD
}
