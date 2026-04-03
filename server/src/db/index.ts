import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  connectionString: config.databaseUrl,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
});

export default pool;
