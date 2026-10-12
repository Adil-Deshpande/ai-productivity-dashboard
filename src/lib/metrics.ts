import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';

type ApplicationMetrics = {
  register: Registry;
  httpRequestsTotal: Counter<string>;
  httpRequestDuration: Histogram<string>;
};

const globalForMetrics = globalThis as typeof globalThis & {
  __appMetrics?: ApplicationMetrics;
};

function createApplicationMetrics(): ApplicationMetrics {
  const register = new Registry();

  register.setDefaultLabels({
    app: 'ai-productivity-dashboard',
  });

  const httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests handled by the application.',
    labelNames: ['method', 'status_code'],
    registers: [register],
  });

  const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds.',
    labelNames: ['method', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [register],
  });

  collectDefaultMetrics({
    register,
    prefix: 'nodejs_',
  });

  return {
    register,
    httpRequestsTotal,
    httpRequestDuration,
  };
}

const metrics =
  globalForMetrics.__appMetrics ??= createApplicationMetrics();

export const register = metrics.register;
export const httpRequestsTotal = metrics.httpRequestsTotal;
export const httpRequestDuration = metrics.httpRequestDuration;