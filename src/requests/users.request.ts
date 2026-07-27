import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserData } from '../data/user.data';

export class UsersRequest {
  constructor(private readonly api: APIRequestContext) {}

  async createUser(user: UserData): Promise<APIResponse> {
    return this.api.post('/usuarios', {
      data: user,
    });
  }

  async getUsers(): Promise<APIResponse> {
    return this.api.get('/usuarios');
  }

  async getUserById(userId: string): Promise<APIResponse> {
    return this.api.get(`/usuarios/${userId}`);
  }

  async updateUser(
    userId: string,
    user: UserData,
  ): Promise<APIResponse> {
    return this.api.put(`/usuarios/${userId}`, {
      data: user,
    });
  }

  async deleteUser(userId: string): Promise<APIResponse> {
    return this.api.delete(`/usuarios/${userId}`);
  }
}