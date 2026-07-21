export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(`[INFO] ${message}`, meta ? meta : '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error ? error : '');
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[WARN] ${message}`, meta ? meta : '');
  },
};
