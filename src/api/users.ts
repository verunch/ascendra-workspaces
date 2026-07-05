import type { User } from "@/types/user";
import { mockRequest } from "./client";
import { findUser, getAllUsers } from "./store";

export function listUsers(): Promise<User[]> {
  return mockRequest(() => [...getAllUsers()], { emptyValue: [] });
}

export function getUser(id: string): Promise<User> {
  return mockRequest(() => {
    const user = findUser(id);
    if (!user) {
      throw new Error(`User "${id}" was not found.`);
    }
    return { ...user };
  });
}
