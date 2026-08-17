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

test.describe('POST /login', () => {
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

  test('deve realizar login e retornar token JWT', async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Autenticação');
    await story('Login com sucesso');
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
    expect(loginBody.message).toBe('Login realizado com sucesso');
    expect(loginBody.authorization).toBeTruthy();
    expect(loginBody.authorization).toContain('Bearer');

      const token = loginBody.authorization.replace('Bearer ', '');
      const tokenParts = token.split('.');

      expect(tokenParts).toHaveLength(3);
      expect(tokenParts.every((part: string) => part.length > 0)).toBeTruthy();

    await usersRequest.deleteUser(createdBody._id);
  });

  test('não deve realizar login com senha inválida', async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Autenticação');
    await story('Login com senha inválida');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const createResponse = await usersRequest.createUser(user);
    const createdBody = await createResponse.json();

    expect(createResponse.status()).toBe(201);

    const loginResponse = await authRequest.login(
      user.email,
      'senha-incorreta',
    );

    const loginBody = await loginResponse.json();

    expect(loginResponse.status()).toBe(401);
    expect(loginBody.message).toBe('Email e/ou senha inválidos');

    await usersRequest.deleteUser(createdBody._id);
  });
});