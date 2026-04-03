import { Pool } from "pg";
import { AuthUser, User, UserRole } from "../types/user";

export class UserRepo {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  getUsers = async (): Promise<User[]> => {
    const query = `SELECT id, email, username, role, created_at AS "createdAt" FROM users`;
    const result = await this.pool.query(query);
    return result.rows;
  };

  getUserByEmailForLogin = async (email: string): Promise<AuthUser | undefined> => {
    const query = `SELECT id, email, username, role, created_at AS "createdAt", password_hash AS "passwordHash" FROM users WHERE email = $1`;
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  };

  createUser = async (
    email: string,
    username: string,
    passwordHash: string,
    role: UserRole,
  ): Promise<void> => {
    const query = `INSERT INTO users (email, username, password_hash, role) VALUES ($1, $2, $3, $4)`;
    await this.pool.query(query, [email, username, passwordHash, role]);
  };
}
