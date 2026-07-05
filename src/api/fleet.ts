import type { FleetUtilization } from "@/types/fleet";
import { mockRequest } from "./client";
import { getFleetUtilizationSnapshot } from "./store";

export function getFleetUtilization(): Promise<FleetUtilization> {
  return mockRequest(() => structuredClone(getFleetUtilizationSnapshot()));
}
