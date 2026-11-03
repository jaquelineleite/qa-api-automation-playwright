import {
  test as base,
  expect,
} from '@playwright/test';

import { ApiClient } from '../client/apiClient';
import {
  createValidUser,
  UserData,
} from '../data/user.data';
import { UsersRequest } from '../requests/users.request';

type CreatedUser = {
  id: string;
  data: UserData;
};

type UserFixtures = {
  usersRequest: UsersRequest;
  testUser: CreatedUser;
};

export const test = base.extend<UserFixtures>({
  usersRequest: async ({}, use) => {
    const api = await ApiClient.create();
    const usersRequest = new UsersRequest(api);

    try {
      await use(usersRequest);
    } finally {
      await api.dispose();
    }
  },

  testUser: async ({ usersRequest }, use) => {
    const data = createValidUser();

    const response = await usersRequest.createUser(data);

    expect(response.status()).toBe(201);

    const body = await response.json();
    const id = body._id;

    try {
      await use({
        id,
        data,
      });
    } finally {
      try {
        const getResponse = await usersRequest.getUserById(id);

        if (getResponse.status() === 200) {
          const deleteResponse = await usersRequest.deleteUser(id);
          expect(deleteResponse.status()).toBe(200);
        }
      } catch (error) {
        throw new Error(
          `[cleanup] Não foi possível validar/remover o usuário de teste ${id}`,
          { cause: error },
        );
      }
    }
  },
});

export { expect };