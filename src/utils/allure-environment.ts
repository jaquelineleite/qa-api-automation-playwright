import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(): Promise<void> {
  const allureResultsPath = path.resolve('allure-results');

  fs.mkdirSync(allureResultsPath, { recursive: true });

  const environmentContent = [
    'Projeto=Banco Carrefour API',
    'Ambiente=QA',
    'Framework=Playwright',
    'Linguagem=TypeScript',
    'Tipo=API Testing',
    'BaseURL=https://serverest.dev',
  ].join('\n');

  fs.writeFileSync(
    path.join(allureResultsPath, 'environment.properties'),
    environmentContent,
    'utf-8',
  );
}