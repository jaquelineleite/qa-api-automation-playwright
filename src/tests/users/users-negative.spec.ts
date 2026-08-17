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

test.describe('Cenários negativos de usuários', () => {
  let api: APIRequestContext;
  let usersRequest: UsersRequest;

  test.beforeAll(async () => {
    api = await ApiClient.create();
    usersRequest = new UsersRequest(api);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('não deve criar usuário com e-mail duplicado', async () => {
    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Validação de e-mail duplicado');
    await severity('critical');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const firstResponse = await usersRequest.createUser(user);
    const firstBody = await firstResponse.json();

    expect(firstResponse.status()).toBe(201);

    const duplicateResponse = await usersRequest.createUser(user);
    const duplicateBody = await duplicateResponse.json();

    expect(duplicateResponse.status()).toBe(400);
    expect(duplicateBody.message).toBe(
      'Este email já está sendo usado'
    );

    await usersRequest.deleteUser(firstBody._id);
  });

  test('não deve criar usuário sem nome', async () => {
    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Validação de nome obrigatório');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const response = await api.post('/usuarios', {
      data: {
        email: user.email,
        password: user.password,
        administrador: user.administrador,
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty('nome');
  });

  test('não deve criar usuário sem e-mail', async () => {
    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Validação de e-mail obrigatório');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const response = await api.post('/usuarios', {
      data: {
        nome: user.nome,
        password: user.password,
        administrador: user.administrador,
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty('email');
  });

  test('não deve criar usuário sem password', async () => {
    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Validação de senha obrigatória');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const response = await api.post('/usuarios', {
      data: {
        nome: user.nome,
        email: user.email,
        administrador: user.administrador,
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty('password');
  });

  test('não deve criar usuário sem administrador', async () => {
    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Validação de administrador obrigatório');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const user = createValidUser();

    const response = await api.post('/usuarios', {
      data: {
        nome: user.nome,
        email: user.email,
        password: user.password,
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty('administrador');
  });

  test('deve retornar erro ao buscar usuário inexistente', async () => {
    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Buscar usuário inexistente');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const response = await usersRequest.getUserById(
      '0000000000000000'
    );

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe('Usuário não encontrado');
  });

  test('deve informar que nenhum registro foi excluído', async () => {
    await epic('Banco Carrefour API');
    await feature('Usuários');
    await story('Excluir usuário inexistente');
    await severity('normal');
    await owner('Jaqueline Fernandes de Andrade');

    const response = await usersRequest.deleteUser(
      '0000000000000000'
    );

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Nenhum registro excluído');
  });
});