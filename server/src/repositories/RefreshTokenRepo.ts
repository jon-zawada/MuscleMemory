import { Pool } from "pg";
import { randomUUID } from "crypto";
import { RefreshToken } from "../types/refreshToken";

export class RefreshTokenRepo {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  createToken = async (userId: string): Promise<string> => {
    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const query = `INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)`;
    await this.pool.query(query, [refreshToken, userId, expiresAt]);
    return refreshToken;
  };
  findByToken = async (token: string): Promise<RefreshToken | undefined> => {
    const query = `SELECT id, token, user_id AS "userId", expires_at AS "expiresAt", created_at AS "createdAt" FROM refresh_tokens WHERE token = $1`;
    const result = await this.pool.query(query, [token]);
    return result.rows[0];
  };

  deleteToken = async (token: string): Promise<void> => {
    const query = `DELETE FROM refresh_tokens WHERE token = $1`;
    await this.pool.query(query, [token]);
  };
}
