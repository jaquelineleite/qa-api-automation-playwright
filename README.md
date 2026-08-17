# 🚀 QA API Automation — Playwright & TypeScript

[![API Tests](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml/badge.svg)](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml)
[![GitLab Pipeline](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/badges/main/pipeline.svg)](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/-/pipelines)

Projeto de automação de testes de API REST desenvolvido como solução para um desafio técnico de **Quality Assurance**, utilizando **Playwright, TypeScript, AJV, Faker e Allure**, com a API pública [ServeRest](https://serverest.dev/) como ambiente de testes.

O projeto cobre operações CRUD de usuários, autenticação, validações negativas, contrato de API com JSON Schema, validação e utilização de token JWT, geração de dados dinâmicos e integração com pipelines CI/CD no GitHub Actions e GitLab CI.

> **Mapeamento do desafio:** o enunciado utiliza os endpoints `/users`, enquanto a ServeRest disponibiliza o recurso equivalente em `/usuarios`. Por isso, os testes utilizam `/usuarios` e `/usuarios/{id}`.

---

## 🎯 Objetivo

Garantir cobertura funcional dos endpoints e requisitos descritos no desafio por meio de testes automatizados de API, contemplando:

- testes funcionais positivos;
- testes negativos;
- operações CRUD;
- autenticação;
- validação estrutural de JWT;
- utilização do token JWT em requisição autenticada;
- validação de acesso negado sem token;
- validação de contrato com JSON Schema;
- geração dinâmica de massa de dados;
- validação de campos obrigatórios;
- rate limit configurado como teste opt-in;
- relatórios automatizados;
- execução em pipelines CI/CD.


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
│   │       ├── jwt-auth.spec.ts
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

| Operação | Endpoint do desafio | Endpoint utilizado | Método |
|---|---|---|---|
| Criar usuário | `/users` | `/usuarios` | POST |
| Listar usuários | `/users` | `/usuarios` | GET |
| Buscar usuário por ID | `/users/{id}` | `/usuarios/{id}` | GET |
| Atualizar usuário | `/users/{id}` | `/usuarios/{id}` | PUT |
| Excluir usuário | `/users/{id}` | `/usuarios/{id}` | DELETE |

Além do CRUD, a suíte cobre cenários positivos, negativos, autenticação JWT, contrato da API e rate limit.

---

## 🔐 Autenticação JWT

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

> A validação da estrutura do token não representa validação criptográfica da assinatura do JWT.

Além da validação estrutural, o projeto demonstra a **utilização real do token JWT** em uma rota protegida da ServeRest (`DELETE /carrinhos/concluir-compra`):

- um usuário administrador é criado dinamicamente;
- o login é realizado via `POST /login`;
- o valor retornado em `authorization` é utilizado no header `Authorization`;
- uma rota protegida é acessada com o token e retorna `HTTP 200`;
- a mesma rota é acessada sem token e retorna `HTTP 401`.

O CRUD de `/usuarios` permanece testado separadamente, conforme o comportamento disponibilizado pela API pública ServeRest.

---

## 🧪 Campos obrigatórios e cenários negativos

O payload de usuário utiliza os campos:

```json
{
  "nome": "string",
  "email": "string",
  "password": "string",
  "administrador": "string"
}
```

São validados os seguintes cenários negativos:

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

O projeto utiliza **AJV** e **JSON Schema** para validar o contrato da resposta do endpoint:

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

Essa validação permite detectar alterações inesperadas na estrutura da resposta, ausência de propriedades esperadas e mudanças de tipo nos dados retornados pela API.

---

## 🚦 Rate Limit

Existe um cenário específico para validar a regra de:

`100 requisições por minuto`

O teste envia até 101 requisições e espera que a requisição acima do limite retorne:

`HTTP 429`

O cenário de rate limit está **implementado**, porém sua execução é **opt-in** e não faz parte da suíte padrão executada contra a API pública ServeRest.

Essa decisão evita gerar carga desnecessária no ambiente público e também evita tratar como falha uma política que pode não estar habilitada da mesma forma no ambiente utilizado.

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
18 cenários cadastrados
17 testes executados com sucesso
1 cenário opt-in de rate limit
0 falhas
```

Execução validada:

```text
17 passed
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

### Testes de autenticação e JWT

Executa os cenários de login e utilização do token JWT:

```bash
npm run test:auth
```

### Rate limit

O teste de rate limit é opt-in. Para executá-lo, informe um ambiente que implemente a regra de 100 requisições por minuto:

```bash
RUN_RATE_LIMIT_TEST=true \
RATE_LIMIT_BASE_URL=https://seu-ambiente.com \
npm run test:rate-limit
```

> Sem `RUN_RATE_LIMIT_TEST=true`, o cenário permanece marcado como `skipped` por decisão de projeto.

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
Upload dos artefatos
```

Ao final da execução, o GitHub Actions disponibiliza os seguintes artefatos para consulta e download:

- `allure-report`;
- `allure-results`;
- `playwright-report`.

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

A pipeline do GitLab também armazena os relatórios como artefatos:

```text
reports/
allure-results/
allure-report/
```

O relatório JUnit também é integrado à pipeline do GitLab, permitindo visualizar os resultados dos testes diretamente na execução da pipeline.

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
- reutilizar dados e objetos de requisição;
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

Para este desafio, a expressão **100% de cobertura** é tratada como cobertura funcional dos endpoints e requisitos descritos no enunciado.

Todos os endpoints de usuários solicitados estão contemplados na suíte automatizada, juntamente com validações de campos obrigatórios, cenários negativos, autenticação, contrato e rate limit.

Não é utilizado percentual de code coverage, pois o código-fonte interno da API ServeRest não faz parte deste repositório.

---

## 👩‍💻 Autora

**Jaqueline Fernandes de Andrade**

QA | Quality Assurance | Test Automation

GitHub: https://github.com/jaquelineleite

