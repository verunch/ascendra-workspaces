import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/api/users";
import { queryKeys } from "@/lib/queryKeys";

export function useUsers() {
  return useQuery({ queryKey: queryKeys.users.all, queryFn: listUsers });
}
