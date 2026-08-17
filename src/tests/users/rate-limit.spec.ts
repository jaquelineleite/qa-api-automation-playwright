import { test, expect, request, APIRequestContext } from '@playwright/test';
import {
  epic,
  feature,
  story,
  severity,
  owner,
} from 'allure-js-commons';

test.describe('Rate limit da API', () => {
  let api: APIRequestContext;

  test.beforeAll(async () => {
    test.skip(
      process.env.RUN_RATE_LIMIT_TEST !== 'true',
      'Teste de rate limit é opt-in para evitar sobrecarga da API pública.',
    );

    const baseURL = process.env.RATE_LIMIT_BASE_URL;

    if (!baseURL) {
      throw new Error(
        'Defina RATE_LIMIT_BASE_URL para executar o teste de rate limit.',
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

  test('deve limitar requisições acima de 100 por minuto', async () => {
    await epic('API Automation');
    await feature('Rate Limit');
    await story('Limite de 100 requisições por minuto');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const responses = [];

    for (let index = 1; index <= 101; index += 1) {
      responses.push(await api.get('/usuarios'));
    }

    const firstHundred = responses.slice(0, 100);
    const request101 = responses[100];

    expect(
      firstHundred.every((response) => response.status() !== 429),
    ).toBeTruthy();

    expect(request101.status()).toBe(429);
  });
});
