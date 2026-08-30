import { test, expect } from '../../fixtures/user.fixture';
import {
  createValidUser,
  UserData,
} from '../../data/user.data';

import {
  epic,
  feature,
  story,
  severity,
  owner,
} from 'allure-js-commons';

type RequiredFieldScenario = {
  field: keyof UserData;
  testName: string;
  storyName: string;
};

const requiredFieldScenarios: RequiredFieldScenario[] = [
  {
    field: 'nome',
    testName: 'não deve criar usuário sem nome',
    storyName: 'Validação de nome obrigatório',
  },
  {
    field: 'email',
    testName: 'não deve criar usuário sem e-mail',
    storyName: 'Validação de e-mail obrigatório',
  },
  {
    field: 'password',
    testName: 'não deve criar usuário sem password',
    storyName: 'Validação de senha obrigatória',
  },
  {
    field: 'administrador',
    testName: 'não deve criar usuário sem administrador',
    storyName: 'Validação de administrador obrigatório',
  },
];

test.describe('Cenários negativos de usuários', () => {
  test(
    'não deve criar usuário com e-mail duplicado',
    async ({ usersRequest, testUser }) => {
      await epic('QA API Automation - Playwright & TypeScript');
      await feature('Usuários');
      await story('Validação de e-mail duplicado');
      await severity('critical');
      await owner('Jaqueline Fernandes de Andrade');

      const duplicateResponse = await usersRequest.createUser(
        testUser.data
      );

      const duplicateBody = await duplicateResponse.json();

      expect(duplicateResponse.status()).toBe(400);
      expect(duplicateBody.message).toBe(
        'Este email já está sendo usado'
      );
    }
  );

  for (const scenario of requiredFieldScenarios) {
    test(scenario.testName, async ({ usersRequest }) => {
      await epic('QA API Automation - Playwright & TypeScript');
      await feature('Usuários');
      await story(scenario.storyName);
      await severity('normal');
      await owner('Jaqueline Fernandes de Andrade');

      const payload: Partial<UserData> = {
        ...createValidUser(),
      };

      delete payload[scenario.field];

      const response =
        await usersRequest.createUserWithPayload(payload);

      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(body).toHaveProperty(scenario.field);
    });
  }

  test(
    'deve retornar erro ao buscar usuário inexistente',
    async ({ usersRequest }) => {
      await epic('QA API Automation - Playwright & TypeScript');
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
    }
  );

  test(
    'deve informar que nenhum registro foi excluído',
    async ({ usersRequest }) => {
      await epic('QA API Automation - Playwright & TypeScript');
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
    }
  );
});