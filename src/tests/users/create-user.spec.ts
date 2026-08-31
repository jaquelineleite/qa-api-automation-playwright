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

test.describe('POST /usuarios', () => {
  let api: APIRequestContext;
  let usersRequest: UsersRequest;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    usersRequest = new UsersRequest(api);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test(
    'deve criar um usuário com sucesso',
    {
    tag: ['@smoke', '@regression'],
  } ,
    async () => {
    await epic('QA API Automation - Playwright & TypeScript');
    await feature('Usuários');
    await story('Criar usuário');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const response = await usersRequest.createUser(user);
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();

    const getResponse = await usersRequest.getUserById(body._id);
    const createdUser = await getResponse.json();

    expect(getResponse.status()).toBe(200);
    expect(createdUser.nome).toBe(user.nome);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.password).toBe(user.password);
    expect(createdUser.administrador).toBe(user.administrador);

    await usersRequest.deleteUser(body._id);
  });
});
