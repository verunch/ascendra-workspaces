export type UserRole = "engineer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vmCount: number;
}
