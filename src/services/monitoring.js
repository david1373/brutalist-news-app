import promClient from 'prom-client';
import { logger } from './logger';

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const transformationDuration = new promClient.Histogram({
  name: 'content_transformation_duration_seconds',
  help: 'Duration of content transformations in seconds',
  labelNames: ['source', 'status'],
  buckets: [1, 5, 10, 30, 60]
});

register.registerMetric(httpRequestDuration);
register.registerMetric(transformationDuration);

export const monitorRequest = (req, res, next) => {
  const start = Date.now();
  const { method, path } = req;

  res.once('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(method, path, res.statusCode.toString())
      .observe(duration);

    logger.info('HTTP Request', {
      method,
      path,
      statusCode: res.statusCode,
      duration
    });
  });

  next();
};