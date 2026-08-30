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
      await usersRequest.deleteUser(id);
    }
  },
});

export { expect };