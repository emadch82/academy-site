import pino from 'pino';
import { config } from './env.js';

const isDev = config.isDev;

export const logger = pino({
  level: config.env.LOG_LEVEL,
  base: { app: config.env.APP_NAME },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        },
      }
    : {
        // در production JSON ساختاریافته برای جمع‌آوری با ELK/Loki
        formatters: {
          level(label) {
            return { level: label };
          },
        },
      }),
});

export type Logger = typeof logger;

export default logger;
