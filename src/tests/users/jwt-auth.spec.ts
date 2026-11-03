import { test, expect, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../client/apiClient';
import { createValidUser } from '../../data/user.data';
import { UsersRequest } from '../../requests/users.request';
import { AuthRequest } from '../../requests/auth.request';
import {
  epic,
  feature,
  story,
  severity,
  owner,
} from 'allure-js-commons';

test.describe('Autenticação JWT', () => {
  let api: APIRequestContext;
  let usersRequest: UsersRequest;
  let authRequest: AuthRequest;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    usersRequest = new UsersRequest(api);
    authRequest = new AuthRequest(api);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test(
    'deve acessar rota protegida utilizando token JWT',
    {
      tag: ['@smoke', '@regression'],
    },
    async () => {
      await epic('QA API Automation - Playwright & TypeScript');
      await feature('Autenticação');
      await story('Utilização do token JWT');
      await severity('critical');
      await owner('Jaqueline Fernandes de Andrade');

      const user = createValidUser();

      const createResponse = await usersRequest.createUser(user);
      const createdBody = await createResponse.json();

      expect(createResponse.status()).toBe(201);

      const loginResponse = await authRequest.login(
        user.email,
        user.password,
      );

      const loginBody = await loginResponse.json();

      expect(loginResponse.status()).toBe(200);
      expect(loginBody.authorization).toContain('Bearer');

      const authenticatedApi = await ApiClient.create(
        loginBody.authorization,
      );

      try {
        const protectedResponse = await authenticatedApi.delete(
          '/carrinhos/concluir-compra',
        );

        const protectedBody = await protectedResponse.json();

        expect(protectedResponse.status()).toBe(200);
        expect(protectedBody.message).toContain(
          'Não foi encontrado carrinho',
        );
      } finally {
        await authenticatedApi.dispose();
        await usersRequest.deleteUser(createdBody._id);
      }
    },
  );

  test('não deve acessar rota protegida sem token JWT', async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Autenticação');
    await story('Acesso sem token JWT');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const response = await api.delete('/carrinhos/concluir-compra');
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.message).toContain('Token de acesso');
  });

  test('não deve acessar rota protegida com token JWT inválido', async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Autenticação');
    await story('Rejeição de token JWT inválido');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const invalidTokenApi = await ApiClient.create('Bearer token-invalido');

    try {
      const response = await invalidTokenApi.delete(
        '/carrinhos/concluir-compra',
      );
      const body = await response.json();

      expect(response.status()).toBe(401);
      expect(body).toHaveProperty('message');
      expect(typeof body.message).toBe('string');
      expect(body.message.trim().length).toBeGreaterThan(0);
    } finally {
      await invalidTokenApi.dispose();
    }
  });

});