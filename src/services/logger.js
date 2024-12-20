import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { format } from 'winston';

const structuredFormat = format.combine(
  format.timestamp(),
  format.metadata({ fillWith: ['timestamp', 'severity', 'labels'] }),
  format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: structuredFormat,
  defaultMeta: { service: 'brutalist-news' },
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: structuredFormat
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: structuredFormat
    })
  ]
});

export { logger };