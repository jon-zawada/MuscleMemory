import { logger } from "./utils/logger";

const loadedVars: string[] = [];

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    logger.error(`[ENV] Missing required env variable: ${key}`);
    throw new Error(`Missing required env variable: ${key}`);
  }
  loadedVars.push(key);
  return value;
}

export const config = {
  nodeEnv: requireEnv("NODE_ENV"),
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: requireEnv("JWT_EXPIRES_IN"),
};

logger.info(
  `[ENV] Loaded ${loadedVars.length} env variables:\n {\n  ${loadedVars.join(",  \n  ")} \n }`,
);
