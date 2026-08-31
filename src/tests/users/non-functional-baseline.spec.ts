import {
  test,
  expect,
  request,
  APIRequestContext,
} from '@playwright/test';

import {
  epic,
  feature,
  story,
  severity,
  owner,
} from 'allure-js-commons';

test.describe('Non-functional API baseline', () => {
  let api: APIRequestContext;

  const totalRequests = Number(
    process.env.NF_TOTAL_REQUESTS ?? 50,
  );

  const concurrency = Number(
    process.env.NF_CONCURRENCY ?? 5,
  );

  test.beforeAll(async () => {
    test.skip(
      process.env.RUN_NON_FUNCTIONAL_TEST !== 'true',
      'Non-functional baseline is opt-in and local-only.',
    );

    const baseURL =
      process.env.NON_FUNCTIONAL_BASE_URL ??
      'http://127.0.0.1:3000';

    const url = new URL(baseURL);

    const allowedHosts = [
      'localhost',
      '127.0.0.1',
      '::1',
    ];

    if (!allowedHosts.includes(url.hostname)) {
      throw new Error(
        'Non-functional tests must run only against a local environment.',
      );
    }

    api = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    if (api) {
      await api.dispose();
    }
  });

  test(
    'deve gerar baseline não funcional da API',
    {
      tag: '@non-functional',
    },
    async ({}, testInfo) => {
      await epic('API Quality Engineering');
      await feature('Non-Functional Testing');
      await story('API performance baseline');
      await severity('normal');
      await owner('Jaqueline Fernandes de Andrade');

      const responseTimes: number[] = [];
      const statuses: number[] = [];

      const startedAt = Date.now();

      for (
        let offset = 0;
        offset < totalRequests;
        offset += concurrency
      ) {
        const currentBatchSize = Math.min(
          concurrency,
          totalRequests - offset,
        );

        const batch = Array.from(
          { length: currentBatchSize },
          async () => {
            const requestStartedAt = Date.now();

            const response = await api.get('/usuarios');

            responseTimes.push(
              Date.now() - requestStartedAt,
            );

            statuses.push(response.status());
          },
        );

        await Promise.all(batch);
      }

      const durationMs = Date.now() - startedAt;

      const sortedResponseTimes = [
        ...responseTimes,
      ].sort((a, b) => a - b);

      const averageResponseTime =
        responseTimes.reduce(
          (total, value) => total + value,
          0,
        ) / responseTimes.length;

      const p95Index = Math.ceil(
        sortedResponseTimes.length * 0.95,
      ) - 1;

      const p95 = sortedResponseTimes[p95Index];

      const successfulRequests = statuses.filter(
        (status) => status >= 200 && status < 300,
      ).length;

      const failedRequests =
        totalRequests - successfulRequests;

      const errorRate =
        (failedRequests / totalRequests) * 100;

      const requestsPerSecond =
        totalRequests / (durationMs / 1000);

      const statusDistribution =
        statuses.reduce<Record<string, number>>(
          (accumulator, status) => {
            const key = String(status);

            accumulator[key] =
              (accumulator[key] ?? 0) + 1;

            return accumulator;
          },
          {},
        );

      const evidence = {
        totalRequests,
        concurrency,
        successfulRequests,
        failedRequests,
        errorRate: Number(errorRate.toFixed(2)),
        durationMs,
        averageResponseTimeMs: Number(
          averageResponseTime.toFixed(2),
        ),
        p95ResponseTimeMs: p95,
        requestsPerSecond: Number(
          requestsPerSecond.toFixed(2),
        ),
        statusDistribution,
      };

      await testInfo.attach(
        'non-functional-baseline',
        {
          body: JSON.stringify(evidence, null, 2),
          contentType: 'application/json',
        },
      );

      expect(failedRequests).toBe(0);
      expect(successfulRequests).toBe(
        totalRequests,
      );
    },
  );
});