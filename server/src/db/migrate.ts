import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import { logger } from "../utils/logger";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const migrationDir = path.resolve(__dirname, "./migrations");

const main = async (): Promise<void> => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    logger.log("[PSQL] Connected to PSQL");

    await ensureMigrationsTable(client);
    const dbFiles = await getDbMigrationFiles(client);
    const localFiles = getLocalMigrationFiles();
    const missingFiles = getPendingMigrations(dbFiles, localFiles);
    await runMigrations(missingFiles, client);
    logger.log(`[PSQL] ${missingFiles.length} migration(s) applied`);

    await client.end();
    logger.log("[PSQL] Disconnected from PSQL");
  } catch (error) {
    await client.end();
    logger.error(`[PSQL] Unexpected error: ${error}`);
    process.exit(1);
  }
};

const ensureMigrationsTable = async (client: Client): Promise<void> => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      run_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  logger.log("[PSQL] Migration table ready");
};

const getDbMigrationFiles = async (client: Client): Promise<string[]> => {
  const res = await client.query(`
    SELECT filename FROM migrations
  `);

  return res.rows.map((row) => row.filename);
};

const getLocalMigrationFiles = (): string[] => {
  const localFiles = fs.readdirSync(migrationDir);
  return localFiles.filter((file: string) => file.endsWith(".sql"));
};

const getPendingMigrations = (dbFiles: string[], localFiles: string[]): string[] => {
  return localFiles.filter((file: string) => !dbFiles.includes(file));
};

const runMigrations = async (sqlFiles: string[], client: Client): Promise<void> => {
  for (const fileName of sqlFiles) {
    try {
      const query = fs.readFileSync(path.resolve(migrationDir, fileName), "utf-8");
      logger.log(`[PSQL] Running migration: ${fileName}`);
      await client.query(query);
      await client.query(
        `
          INSERT INTO migrations (filename) VALUES ($1)
        `,
        [fileName],
      );
    } catch (error) {
      logger.error(`[PSQL] Migration failed: ${fileName} - ${error}`);
      throw error;
    }
  }
};

main();
