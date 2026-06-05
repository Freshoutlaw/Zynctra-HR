/**
 * /frontend/src/utils/logger.ts
 *
 * Structured logger with log levels.
 * In production, pipe to a monitoring service (e.g. Sentry, Datadog).
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

const isDev = import.meta.env.DEV;

const format = (entry: LogEntry): string =>
  `[${entry.timestamp}] [${entry.level.toUpperCase()}]${
    entry.context ? ` [${entry.context}]` : ''
  } ${entry.message}`;

const log = (level: LogLevel, message: string, data?: unknown, context?: string): void => {
  const entry: LogEntry = {
    level,
    message,
    context,
    data,
    timestamp: new Date().toISOString(),
  };

  if (!isDev && level === 'debug') return; // silence debug in prod

  const formatted = format(entry);

  switch (level) {
    case 'debug':
      console.debug(formatted, data ?? '');
      break;
    case 'info':
      console.info(formatted, data ?? '');
      break;
    case 'warn':
      console.warn(formatted, data ?? '');
      break;
    case 'error':
      console.error(formatted, data ?? '');
      // TODO: send to Sentry / monitoring
      break;
  }
};

export const logger = {
  debug: (message: string, data?: unknown, context?: string) =>
    log('debug', message, data, context),
  info: (message: string, data?: unknown, context?: string) =>
    log('info', message, data, context),
  warn: (message: string, data?: unknown, context?: string) =>
    log('warn', message, data, context),
  error: (message: string, data?: unknown, context?: string) =>
    log('error', message, data, context),
};

export default logger;