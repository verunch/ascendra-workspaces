import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTemplate } from "@/api/templates";
import { queryKeys } from "@/lib/queryKeys";

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
}
