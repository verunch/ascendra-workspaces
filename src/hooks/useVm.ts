import { useQuery } from "@tanstack/react-query";
import { getVm } from "@/api/vms";
import { queryKeys } from "@/lib/queryKeys";

export function useVm(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vms.detail(id ?? ""),
    queryFn: () => getVm(id as string),
    enabled: Boolean(id),
  });
}
