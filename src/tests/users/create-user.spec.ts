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
    test('deve criar um usuário com sucesso', async () => {

    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Criar usuário');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    // restante do teste...
});
  let api: APIRequestContext;
  let usersRequest: UsersRequest;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    usersRequest = new UsersRequest(api);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

   
  });