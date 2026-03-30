/* eslint-disable no-console */
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  blue: "\x1b[94m",
};

const validate = (message: string): void => {
  if (!/^\[.+\]/.test(message)) {
    throw new Error(`Logger message must start with a [PREFIX] tag: "${message}"`);
  }
};

type ConsoleFn = (message: string) => void;

const createLogFn =
  (color: string, consoleFn: ConsoleFn): ConsoleFn =>
  (message: string) => {
    validate(message);
    consoleFn(`${color}${message}${colors.reset}`);
  };

export const logger = {
  log: createLogFn(colors.blue, console.log),
  info: createLogFn(colors.cyan, console.info),
  warn: createLogFn(colors.yellow, console.warn),
  error: createLogFn(colors.red, console.error),
};
