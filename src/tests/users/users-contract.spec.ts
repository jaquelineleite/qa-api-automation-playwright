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
    const body = await response.json();

    expect(response.status()).toBe(200);

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(usersListSchema);
    const isValid = validate(body);

    expect(
      isValid,
      `Erros de contrato: ${JSON.stringify(validate.errors)}`,
    ).toBeTruthy();
  });
});
