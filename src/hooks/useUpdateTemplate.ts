import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTemplate } from "@/api/templates";
import type { VMTemplateInput } from "@/types/template";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<VMTemplateInput> }) =>
      updateTemplate(id, patch),
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.detail(template.id) });
    },
  });
}
