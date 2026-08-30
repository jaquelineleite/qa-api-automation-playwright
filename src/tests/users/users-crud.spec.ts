import { test, expect, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../client/apiClient';
import { createValidUser } from '../../data/user.data';
import { UsersRequest } from '../../requests/users.request';
import {
  epic,
  feature,
  story,
  severity,
  owner,
} from 'allure-js-commons';

test.describe('CRUD de usuários', () => {
  let api: APIRequestContext;
  let usersRequest: UsersRequest;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    usersRequest = new UsersRequest(api);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('deve listar todos os usuários', async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Usuários');
    await story('Listar usuários');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const response = await usersRequest.getUsers();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('quantidade');
    expect(Array.isArray(body.usuarios)).toBeTruthy();
  });

 test('deve buscar um usuário pelo ID', async () => {
  await epic('QA API Automation - Playwright & TypeScript');
  await feature('Usuários');
  await story('Buscar usuário');
  await severity('critical');
  await owner('Jaqueline Fernandes de Andrade');

  const user = createValidUser();
  const createResponse = await usersRequest.createUser(user);

  expect(createResponse.status()).toBe(201);

  const createdBody = await createResponse.json();
  const userId = createdBody._id;

  try {
    const response = await usersRequest.getUserById(userId);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body._id).toBe(userId);
    expect(body.nome).toBe(user.nome);
    expect(body.email).toBe(user.email);
   } finally {
    await usersRequest.deleteUser(userId);
    }
      });

  test('deve atualizar um usuário', async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Usuários');
    await story('Atualizar usuário');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const originalUser = createValidUser();

    const createResponse = await usersRequest.createUser(originalUser);
    const createdBody = await createResponse.json();
    const userId = createdBody._id;

    const updatedUser = createValidUser();

    const response = await usersRequest.updateUser(userId, updatedUser);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Registro alterado com sucesso');

    const getResponse = await usersRequest.getUserById(userId);
    const getBody = await getResponse.json();

    expect(getBody.nome).toBe(updatedUser.nome);
    expect(getBody.email).toBe(updatedUser.email);

    await usersRequest.deleteUser(userId);
  });

  test('deve excluir um usuário', async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Usuários');
    await story('Excluir usuário');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const createResponse = await usersRequest.createUser(user);
    const createdBody = await createResponse.json();
    const userId = createdBody._id;

    const response = await usersRequest.deleteUser(userId);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Registro excluído com sucesso');

    const getResponse = await usersRequest.getUserById(userId);

    expect(getResponse.status()).toBe(400);
  });
});