import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(): Promise<void> {
  const allureResultsPath = path.resolve('allure-results');

  fs.mkdirSync(allureResultsPath, { recursive: true });

  const environmentContent = [
    'Projeto=QA API Automation - Playwright & TypeScript',
    'Ambiente=QA',
    'Framework=Playwright',
    'Linguagem=TypeScript',
    'Tipo=API Testing',
    'BaseURL=https://serverest.dev',
    'Retries=0',
    'QualityGate=Smoke + Regression',
  ].join('\n');

  fs.writeFileSync(
    path.join(allureResultsPath, 'environment.properties'),
    environmentContent,
    'utf-8',
  );

  const failureCategories = [
    {
      name: 'Environment / Connectivity Signal',
      matchedStatuses: ['failed', 'broken'],
      messageRegex:
        '.*(ECONNRESET|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|socket hang up|network).*',
    },
    {
      name: 'Timeout / Instability Signal',
      matchedStatuses: ['failed', 'broken'],
      messageRegex:
        '.*(Timeout|timeout|timed out).*',
    },
    {
      name: 'Assertion / Functional Signal',
      matchedStatuses: ['failed'],
      messageRegex:
        '.*(expect|Expected|Received|AssertionError).*',
    },
    {
      name: 'Unclassified Failure - Investigation Required',
      matchedStatuses: ['failed', 'broken'],
    },
  ];

  fs.writeFileSync(
    path.join(allureResultsPath, 'categories.json'),
    JSON.stringify(failureCategories, null, 2),
    'utf-8',
  );
}