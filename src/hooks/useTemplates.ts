import { useQuery } from "@tanstack/react-query";
import { listTemplates } from "@/api/templates";
import { queryKeys } from "@/lib/queryKeys";

export function useTemplates() {
  return useQuery({ queryKey: queryKeys.templates.all, queryFn: listTemplates });
}
