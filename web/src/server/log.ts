import pino from 'pino'

export const baseLogger = (tag: string) =>
  pino({
    level: process.env.LOG_LEVEL || 'info',
    base: undefined,
  }).child({ tag })
