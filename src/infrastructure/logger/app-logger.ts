import { Injectable, LoggerService } from '@nestjs/common';
import * as pino from 'pino';

@Injectable()
export class AppLogger implements LoggerService {
  private logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: { colorize: true },
          }
        : undefined,
  });

  log(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace?: string) {
    this.logger.error({ trace }, message);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.info(message);
  }
}
