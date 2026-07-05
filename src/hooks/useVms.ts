import { useQuery } from "@tanstack/react-query";
import { listVms } from "@/api/vms";
import { queryKeys } from "@/lib/queryKeys";

export function useVms() {
  return useQuery({ queryKey: queryKeys.vms.all, queryFn: listVms });
}
