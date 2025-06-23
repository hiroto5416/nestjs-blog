import { LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';

export class CustomLogger implements LoggerService {
  log(message: string) {
    this.writeToFile('log', message);
  }

  error(message: string, trace?: string) {
    this.writeToFile('error', `${message} \n ${trace}`);
  }

  warn(message: string) {
    this.writeToFile('warn', message);
  }

  private writeToFile(level: LogLevel, message: string) {
    const log = `[${new Date().toISOString()}] [${level}] ${message}\n`;
    fs.appendFileSync('app.log', log);
  }
}
