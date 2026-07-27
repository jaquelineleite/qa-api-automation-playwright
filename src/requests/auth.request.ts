import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthRequest {
  constructor(private readonly api: APIRequestContext) {}

  async login(email: string, password: string): Promise<APIResponse> {
    return this.api.post('/login', {
      data: {
        email,
        password,
      },
    });
  }
}