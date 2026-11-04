import { test, expect, APIRequestContext } from '@playwright/test';
import Ajv from 'ajv';
import { ApiClient } from '../../client/apiClient';
import { UsersRequest } from '../../requests/users.request';
import { usersListSchema } from '../../schemas/users.schema';
import {
  epic,
  feature,
  story,
  severity,
  owner,
} from 'allure-js-commons';

test.describe('Contrato da API de usuários', () => {
  let api: APIRequestContext;
  let usersRequest: UsersRequest;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    usersRequest = new UsersRequest(api);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('deve validar o schema da listagem de usuários com AJV', async () => {
    await epic('API Automation');
    await feature('Contrato');
    await story('Schema de GET /usuarios');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const response = await usersRequest.getUsers();
    // Check the HTTP envelope before parsing to avoid opaque JSON errors on rate limiting.
    const status = response.status();
    const contentType = response.headers()['content-type'] ?? '';
    expect(status, `GET /usuarios returned HTTP ${status}`).toBe(200);
    expect(contentType).toMatch(/^application\/json(?:\s*;|$)/i);
    const body: unknown = await response.json();

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(usersListSchema);
    const isValid = validate(body);

    expect(
      isValid,
      `Erros de contrato: ${JSON.stringify(validate.errors)}`,
    ).toBeTruthy();
    if (!isValid) return;
    // Schema narrowing is established by AJV at runtime; do not log response payloads.
    const result = body as { quantidade: number; usuarios: unknown[] };
    expect(result.quantidade).toBe(result.usuarios.length);
  });
});
