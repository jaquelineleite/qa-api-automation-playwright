import { faker } from '@faker-js/faker';

export interface UserData {
  nome: string;
  email: string;
  password: string;
  administrador: string;
}

export function createValidUser(): UserData {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    administrador: 'true',
  };
}