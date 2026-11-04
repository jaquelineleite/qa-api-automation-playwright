import { test, expect } from '@playwright/test';
import { classifyApiFailure } from '../../utils/api-failure';

test.describe('Diagnóstico HTTP determinístico (sem chamadas externas)', () => {
  const scenarios: Array<[number, string, string]> = [
    [429, 'text/plain', 'rate-limited'],
    [401, 'application/json', 'unauthorized'],
    [403, 'application/json', 'forbidden'],
    [500, 'text/html', 'server-error'],
    [400, 'application/json', 'client-error'],
    [200, 'text/html', 'unexpected-content-type'],
    [200, 'application/json; charset=utf-8', 'none'],
  ];

  for (const [status, contentType, expected] of scenarios) {
    test(`HTTP ${status} / ${contentType} => ${expected}`, { tag: '@regression' }, async () => {
      expect(classifyApiFailure(status, contentType)).toBe(expected);
    });
  }
});
