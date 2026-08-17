# 🚀 QA API Automation — Playwright & TypeScript

[![API Tests](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml/badge.svg)](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml)
[![GitLab Pipeline](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/badges/main/pipeline.svg)](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/-/pipelines)

Projeto de automação de testes de API REST desenvolvido com **Playwright, TypeScript, AJV e Allure**, utilizando a API pública [ServeRest](https://serverest.dev/) como ambiente de testes.

O projeto cobre operações CRUD de usuários, autenticação, validações negativas, contrato de API com JSON Schema, estrutura de token JWT, geração de dados dinâmicos e integração com pipelines CI/CD no GitHub Actions e GitLab CI.

---

## 🎯 Objetivo

Demonstrar uma estratégia de Quality Assurance aplicada a testes de API, contemplando:

- testes funcionais positivos;
- testes negativos;
- operações CRUD;
- autenticação;
- validação estrutural de JWT;
- validação de contrato com JSON Schema;
- geração dinâmica de massa de dados;
- validação de campos obrigatórios;
- rate limit configurado como teste opt-in;
- relatórios automatizados;
- execução em pipelines CI/CD.

> A API utilizada possui endpoints em português. Portanto, o recurso de usuários é acessado por `/usuarios`.

---
## 🛠️ Tecnologias

- **Playwright**
- **TypeScript**
- **Node.js**
- **AJV**
- **Faker**
- **Allure Report**
- **JUnit**
- **GitHub Actions**
- **GitLab CI/CD**

---

## 📂 Estrutura do projeto

```text
.
├── .github/
│   └── workflows/
│       └── api-tests.yml
│
├── src/
│   ├── client/
│   │   └── apiClient.ts
│   ├── data/
│   │   └── user.data.ts
│   ├── requests/
│   │   ├── auth.request.ts
│   │   └── users.request.ts
│   ├── schemas/
│   │   └── users.schema.ts
│   ├── tests/
│   │   └── users/
│   │       ├── create-user.spec.ts
│   │       ├── login.spec.ts
│   │       ├── rate-limit.spec.ts
│   │       ├── users-contract.spec.ts
│   │       ├── users-crud.spec.ts
│   │       └── users-negative.spec.ts
│   └── utils/
│       └── allure-environment.ts
│
├── .gitlab-ci.yml
├── playwright.config.ts
├── package.json
└── README.md


```

---
## ✅ Cobertura funcional

### Usuários

| Cenário | Endpoint | Método |
|---|---|---|
| Criar usuário | `/usuarios` | POST |
| Listar usuários | `/usuarios` | GET |
| Buscar usuário por ID | `/usuarios/{id}` | GET |
| Atualizar usuário | `/usuarios/{id}` | PUT |
| Excluir usuário | `/usuarios/{id}` | DELETE |

---

## 🔐 Autenticação

O projeto possui testes para o endpoint:

`POST /login`

São validados:

- login com credenciais válidas;
- login com senha inválida;
- status HTTP;
- mensagem retornada pela API;
- presença do campo `authorization`;
- prefixo `Bearer`;
- estrutura do token JWT composta por três partes.

> A validação realizada é estrutural e não representa validação criptográfica da assinatura do JWT.

---

## 🧪 Validações de criação de usuário

O payload de usuário utiliza os campos:

```json
{
  "nome": "string",
  "email": "string",
  "password": "string",
  "administrador": "string"
}
```

Foram implementados cenários negativos para validar:

- ausência de `nome`;
- ausência de `email`;
- ausência de `password`;
- ausência de `administrador`;
- e-mail duplicado.

Também são validados cenários envolvendo:

- consulta de usuário inexistente;
- exclusão de usuário inexistente.

---

## 📐 Validação de contrato com AJV

O projeto utiliza **AJV** para validar o contrato da resposta do:

`GET /usuarios`

Estrutura esperada:

```text
quantidade
usuarios[]
  ├── nome
  ├── email
  ├── password
  ├── administrador
  └── _id
```

O teste utiliza JSON Schema para detectar alterações inesperadas na estrutura da resposta da API.

---

## 🚦 Rate Limit

Existe um cenário específico para validar a regra de:

`100 requisições por minuto`

O teste envia até 101 requisições e espera que a requisição acima do limite retorne:

`HTTP 429`

Esse teste é **opt-in** e não é executado automaticamente contra a API pública ServeRest.

A decisão evita gerar carga desnecessária ou assumir que o ambiente público implementa exatamente essa política.

Para executá-lo em um ambiente que implemente essa regra:

```bash
RUN_RATE_LIMIT_TEST=true \
RATE_LIMIT_BASE_URL=https://seu-ambiente.com \
npm run test:rate-limit
```

---

## 📊 Suíte automatizada

Atualmente o projeto possui:

```text
16 cenários cadastrados
15 testes executados com sucesso
1 cenário opt-in de rate limit
0 falhas
```

Execução validada:

```text
15 passed
1 skipped
```

O cenário marcado como `skipped` corresponde exclusivamente ao teste de rate limit opt-in.

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 20+
- npm
- Git
- Java/JDK para geração local do relatório Allure

Clone o projeto:

```bash
git clone https://github.com/jaquelineleite/qa-api-automation-playwright.git
```

Entre no diretório:

```bash
cd qa-api-automation-playwright
```

Instale as dependências:

```bash
npm ci
```

---

## ▶️ Executando os testes

### Suíte completa

```bash
npm test
```

### Testes de usuários

```bash
npm run test:users
```

### Testes de autenticação

```bash
npm run test:auth
```

### Rate limit

```bash
npm run test:rate-limit
```

> O cenário de rate limit somente é efetivamente executado quando as variáveis necessárias são informadas.

---

## 🔎 Validação TypeScript

Para verificar erros de tipagem sem executar os testes:

```bash
npm run typecheck
```

---

## 📈 Relatórios

O projeto possui relatórios nos formatos Playwright HTML, Allure e JUnit.

### Playwright HTML Report

```bash
npm run test:report
```

ou:

```bash
npx playwright show-report reports/playwright-report
```

### Allure Report

```bash
npm run allure:generate
```

```bash
npm run allure:open
```

### JUnit

O relatório JUnit é gerado em:

`reports/junit/results.xml`

---

## 🔄 CI/CD

### GitHub Actions

O workflow executa automaticamente:

```text
Checkout
   ↓
Setup Node.js
   ↓
npm ci
   ↓
TypeScript Check
   ↓
Testes de API
   ↓
Geração de relatório Allure
   ↓
Upload dos artifacts
```

São disponibilizados artifacts contendo os relatórios de execução.

### GitLab CI/CD

A pipeline executa:

```text
npm ci
   ↓
npm run typecheck
   ↓
npm test
   ↓
npm run allure:generate
```

São armazenados como artifacts:

```text
reports/
allure-results/
allure-report/
```

O relatório JUnit também é integrado à pipeline do GitLab.

---

## 🧩 Estratégia utilizada

O projeto separa responsabilidades entre:

```text
Client
   ↓
Requests
   ↓
Data
   ↓
Schemas
   ↓
Tests
```

Essa organização permite:

- reduzir duplicação;
- centralizar chamadas HTTP;
- facilitar manutenção;
- reutilizar dados e requests;
- separar regras de teste da camada de comunicação;
- adicionar novos endpoints com menor impacto;
- manter testes mais legíveis.

---

## 🧹 Massa de dados

Os dados utilizados nos testes são criados dinamicamente com **Faker**, reduzindo conflitos entre execuções.

Nos cenários que criam dados exclusivamente para teste, os usuários são removidos ao final quando aplicável.

---

## 🏷️ Allure

Os testes possuem metadados como:

- Epic;
- Feature;
- Story;
- Severity;
- Owner.

Isso permite organizar os cenários no relatório por funcionalidade e criticidade.

---

## 🔒 Segurança das dependências

As dependências do projeto foram verificadas com:

```bash
npm audit
```

Resultado da última validação local:

```text
found 0 vulnerabilities
```

---

## 📌 Observação sobre cobertura

A cobertura apresentada neste projeto representa **cobertura funcional dos endpoints e requisitos automatizados**.

Não é utilizado percentual de code coverage, pois o código-fonte interno da API ServeRest não faz parte deste repositório.

---

## 👩‍💻 Autora

**Jaqueline Fernandes de Andrade**

QA | Quality Assurance | Test Automation

GitHub: https://github.com/jaquelineleite

