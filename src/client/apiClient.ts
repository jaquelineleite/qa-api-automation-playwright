import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  static async create(): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: 'https://serverest.dev',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}