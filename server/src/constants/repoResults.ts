export const OK = "ok";
export const NOT_FOUND = "not_found";
export const UNAUTHORIZED = "unauthorized";
export const NO_UPDATES = "no_updates";

export type RepoResult = typeof OK | typeof NOT_FOUND | typeof UNAUTHORIZED | typeof NO_UPDATES;
