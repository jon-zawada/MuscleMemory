export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export type UserRole = "athlete" | "coach";
