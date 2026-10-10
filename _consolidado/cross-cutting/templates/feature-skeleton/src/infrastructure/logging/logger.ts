import { createLogger, format, transports } from 'winston';

/**
 * Structured logger factory — used across domain, application, infrastructure.
 * Enforces correlationId propagation (ADR-014).
 * Output: JSON to stdout (container-friendly), pretty in dev.
 */

export interface LogContext {
  correlationId?: string;
  entityId?: string;
  feature?: string;
  [key: string]: unknown;
}

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  format.errors({ stack: true }),
  format.json()
);

export function createFeatureLogger(featureName: string) {
  const isDev = process.env.NODE_ENV !== 'production';

  const logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    defaultMeta: { feature: featureName },
    format: isDev ? format.combine(format.colorize(), format.simple()) : logFormat,
    transports: [
      new transports.Console({
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
  });

  const withContext = (context: LogContext = {}) => {
    return {
      debug: (message: string, meta?: Record<string, unknown>) => logger.debug(message, { ...context, ...meta }),
      info: (message: string, meta?: Record<string, unknown>) => logger.info(message, { ...context, ...meta }),
      warn: (message: string, meta?: Record<string, unknown>) => logger.warn(message, { ...context, ...meta }),
      error: (message: string, meta?: Record<string, unknown>) => logger.error(message, { ...context, ...meta }),
    };
  };

  return { logger, withContext };
}

export const defaultLogger = createFeatureLogger('feature-skeleton');