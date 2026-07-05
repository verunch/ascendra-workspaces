import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restartVm, startVm, stopVm } from "@/api/vms";
import type { VM } from "@/types/vm";
import { queryKeys } from "@/lib/queryKeys";

export type VmLifecycleAction = "start" | "stop" | "restart";

const actionHandlers: Record<VmLifecycleAction, (id: string) => Promise<VM>> = {
  start: startVm,
  stop: stopVm,
  restart: restartVm,
};

export function useVmLifecycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: VmLifecycleAction }) =>
      actionHandlers[action](id),
    onSuccess: (vm) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.vms.detail(vm.id) });
    },
  });
}
