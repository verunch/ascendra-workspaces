import { useQuery } from "@tanstack/react-query";
import { getFleetUtilization } from "@/api/fleet";
import { queryKeys } from "@/lib/queryKeys";

export function useFleetUtilization() {
  return useQuery({
    queryKey: queryKeys.fleetUtilization.all,
    queryFn: getFleetUtilization,
  });
}
