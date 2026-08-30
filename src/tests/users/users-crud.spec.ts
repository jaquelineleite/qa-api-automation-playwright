import { test, expect } from '../../fixtures/user.fixture';
import { createValidUser } from '../../data/user.data';
import {
  epic,
  feature,
  story,
  severity,
  owner,
} from 'allure-js-commons';

test.describe('CRUD de usuários', () => {
  test('deve listar todos os usuários', async ({ usersRequest }) => {
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

  test(
    'deve buscar um usuário pelo ID',
    async ({ usersRequest, testUser }) => {
      await epic('QA API Automation - Playwright & TypeScript');
      await feature('Usuários');
      await story('Buscar usuário');
      await severity('critical');
      await owner('Jaqueline Fernandes de Andrade');

      const response = await usersRequest.getUserById(testUser.id);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body._id).toBe(testUser.id);
      expect(body.nome).toBe(testUser.data.nome);
      expect(body.email).toBe(testUser.data.email);
    }
  );

  test(
    'deve atualizar um usuário',
    async ({ usersRequest, testUser }) => {
      await epic('QA API Automation - Playwright & TypeScript');
      await feature('Usuários');
      await story('Atualizar usuário');
      await severity('critical');
      await owner('Jaqueline Fernandes de Andrade');

      const updatedUser = createValidUser();

      const response = await usersRequest.updateUser(
        testUser.id,
        updatedUser
      );

      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.message).toBe('Registro alterado com sucesso');

      // Post-condition:
      // comprova que a alteração realmente foi persistida.
      const getResponse = await usersRequest.getUserById(testUser.id);
      const getBody = await getResponse.json();

      expect(getResponse.status()).toBe(200);
      expect(getBody.nome).toBe(updatedUser.nome);
      expect(getBody.email).toBe(updatedUser.email);
    }
  );

  test(
    'deve excluir um usuário',
    async ({ usersRequest, testUser }) => {
      await epic('QA API Automation - Playwright & TypeScript');
      await feature('Usuários');
      await story('Excluir usuário');
      await severity('critical');
      await owner('Jaqueline Fernandes de Andrade');

      const response = await usersRequest.deleteUser(testUser.id);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.message).toBe('Registro excluído com sucesso');

      // Post-condition:
      // não confiamos apenas no HTTP 200 do DELETE.
      const getResponse = await usersRequest.getUserById(testUser.id);

      expect(getResponse.status()).toBe(400);
    }
  );
});