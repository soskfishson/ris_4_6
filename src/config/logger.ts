import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

export const createServiceLogger = (serviceName: string) => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.File({ 
        filename: path.join(logsDir, `${serviceName}-error.log`), 
        level: 'error',
        format: fileFormat
      }),
      new winston.transports.File({ 
        filename: path.join(logsDir, `${serviceName}.log`),
        format: fileFormat
      }),
      new winston.transports.Console({
        format: consoleFormat
      })
    ]
  });
};

export const centralLogger = createServiceLogger('central-service');
export const territorial1Logger = createServiceLogger('territorial1-service');
export const territorial2Logger = createServiceLogger('territorial2-service');
export const replicationLogger = createServiceLogger('replication-service');
// export const syncLogger = createServiceLogger('time-sync-service');