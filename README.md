# 🧪 API Quality Engineering — Playwright & TypeScript

[![API Tests](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml/badge.svg)](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml)

[![GitLab Pipeline](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/badges/main/pipeline.svg)](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/-/pipelines)

Projeto de **Quality Engineering aplicado a APIs REST**, utilizando Playwright e TypeScript para transformar riscos de qualidade em verificações automatizadas, rastreáveis e executáveis em CI/CD.

Mais do que automatizar endpoints, o projeto demonstra decisões relacionadas a:

- estratégia de testes baseada em risco;
- escolha da camada adequada de validação;
- autenticação e autorização;
- testes funcionais e negativos;
- validação de contrato;
- gerenciamento do ciclo de vida da massa de testes;
- quality gates;
- rastreabilidade entre risco e automação;
- análise e classificação de falhas;
- execução contínua em pipelines.

A API pública [ServeRest](https://serverest.dev/) é utilizada como sistema sob teste.

> O objetivo não é maximizar a quantidade de testes, mas produzir um sinal de qualidade confiável sobre os riscos selecionados.

---

# 🎯 Quality Engineering Approach

A estratégia segue o fluxo:

```text
Requirement / Change
        ↓
Risk Analysis
        ↓
Test Strategy
        ↓
Escolha da camada
        ↓
Automação
        ↓
Execution Evidence
        ↓
Failure Analysis
        ↓
Quality Gate
```

Cada cenário deve responder três perguntas:

1. **Qual risco estou cobrindo?**
2. **Por que essa é a camada adequada para validá-lo?**
3. **Qual evidência determina se o comportamento está saudável?**

A automação é tratada como consequência da estratégia de qualidade, e não como objetivo isolado.

---

# 🧭 Documentação de Engenharia

A arquitetura e as decisões do projeto estão documentadas em:

| Documento | Objetivo |
|---|---|
| [Quality Strategy](docs/quality-strategy.md) | Princípios, estratégia baseada em risco, quality gates e classificação de falhas |
| [Risk Matrix](docs/risk-matrix.md) | Riscos, impacto, probabilidade, prioridade e estratégia de mitigação |
| [Test Architecture](docs/test-architecture.md) | Critérios utilizados para selecionar a camada de teste |
| [Traceability Matrix](docs/traceability-matrix.md) | Relação entre risco, cenário automatizado, criticidade e quality gate |

---

# ⚠️ Risk-Based Testing

Os testes são priorizados de acordo com impacto e risco.

Exemplos:

| Área | Risco | Prioridade | Estratégia |
|---|---|---:|---|
| Autenticação | Usuário válido não conseguir autenticar | Crítica | Login positivo |
| Autenticação | Credenciais inválidas concederem acesso | Crítica | Teste negativo |
| Autorização | Endpoint protegido aceitar acesso sem JWT | Crítica | Chamada sem token |
| Usuários | Criação retornar sucesso sem estado válido | Alta | POST + validação posterior |
| Usuários | Atualização não persistir | Alta | PUT + GET |
| Usuários | Exclusão não remover recurso | Alta | DELETE + GET |
| Contrato | Mudança estrutural quebrar consumidores | Alta | JSON Schema + AJV |
| Massa | Dados compartilhados gerarem falsos resultados | Alta | Faker + fixtures |
| Rate Limit | Excesso de requisições não ser controlado | Média | Teste opt-in |

A matriz completa está em:

[`docs/risk-matrix.md`](docs/risk-matrix.md)

---

# 🏗️ Arquitetura de Testes

```text
                    QUALITY STRATEGY
                           |
                           v
                     RISK ANALYSIS
                           |
              +------------+------------+
              |            |            |
              v            v            v
         Functional     Contract   Non-functional
              |            |            |
              v            v            v
          API Tests    JSON Schema   Rate Limit
              |
              v
        Test Evidence
              |
              v
       Failure Analysis
              |
              v
         Quality Gate
```

Este repositório valida diretamente a camada de serviços REST.

Não é utilizada UI para comportamentos que podem ser comprovados de maneira mais rápida, isolada e confiável pela API.

Exemplo:

```text
Regra de API
     ↓
Teste de API
```

em vez de:

```text
Regra de API
     ↓
UI
     ↓
Browser
     ↓
Frontend
     ↓
API
```

A escolha da camada é baseada no risco que precisa ser validado.

---

# 📂 Arquitetura do Framework

```text
.
├── .github/
│   └── workflows/
│       └── api-tests.yml
│
├── docs/
│   ├── quality-strategy.md
│   ├── risk-matrix.md
│   ├── test-architecture.md
│   └── traceability-matrix.md
│
├── src/
│   ├── client/
│   │   └── apiClient.ts
│   │
│   ├── data/
│   │   └── user.data.ts
│   │
│   ├── fixtures/
│   │   └── user.fixture.ts
│   │
│   ├── requests/
│   │   ├── auth.request.ts
│   │   └── users.request.ts
│   │
│   ├── schemas/
│   │   └── users.schema.ts
│   │
│   ├── tests/
│   │   └── users/
│   │       ├── create-user.spec.ts
│   │       ├── jwt-auth.spec.ts
│   │       ├── login.spec.ts
│   │       ├── rate-limit.spec.ts
│   │       ├── users-contract.spec.ts
│   │       ├── users-crud.spec.ts
│   │       └── users-negative.spec.ts
│   │
│   └── utils/
│       └── allure-environment.ts
│
├── .gitlab-ci.yml
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

A separação de responsabilidades segue:

```text
Client
  ↓
Requests
  ↓
Fixtures / Test Data
  ↓
Schemas
  ↓
Tests
```

Essa estrutura permite:

- centralizar comunicação HTTP;
- reduzir duplicação;
- isolar gerenciamento de massa;
- facilitar manutenção;
- aumentar legibilidade;
- reutilizar componentes;
- reduzir acoplamento entre cenários.

---

# 🧹 Test Data Lifecycle

A massa de testes é criada dinamicamente utilizando Faker.

Os cenários CRUD utilizam fixture responsável pelo ciclo de vida do usuário:

```text
Fixture
   ↓
Create User
   ↓
Provide ID + Test Data
   ↓
Test Execution
   ↓
Check Resource State
   ↓
Cleanup
```

O cleanup é tratado de forma idempotente.

Se o próprio cenário remover o usuário, a fixture reconhece que o recurso já não existe.

Se o usuário continuar disponível após o teste, a fixture realiza a limpeza.

Isso reduz:

- dependência de massa fixa;
- dados abandonados;
- conflitos entre execuções;
- dependência da ordem dos testes;
- falsos negativos.

---

# ✅ Validação de Estado

Os testes não dependem apenas do status retornado pela operação.

## Update

```text
PUT /usuarios/{id}
        ↓
HTTP 200
        ↓
GET /usuarios/{id}
        ↓
validar novo estado persistido
```

## Delete

```text
DELETE /usuarios/{id}
        ↓
HTTP 200
        ↓
GET /usuarios/{id}
        ↓
usuário não encontrado
```

Isso permite validar a **pós-condição**, e não somente a resposta imediata da requisição.

---

# 🧪 Data-Driven Negative Testing

As validações de campos obrigatórios utilizam abordagem parametrizada.

São testadas individualmente as ausências de:

```text
nome
email
password
administrador
```

A estrutura compartilhada reduz duplicação sem eliminar a rastreabilidade.

Cada variação continua aparecendo como cenário independente nos relatórios.

Também são testados:

- e-mail duplicado;
- usuário inexistente;
- exclusão de usuário inexistente.

---

# 🔐 Autenticação e Autorização

Autenticação e autorização são tratadas como riscos diferentes.

## Autenticação

```text
email + senha
     ↓
POST /login
     ↓
JWT
```

São validados:

- credenciais válidas;
- senha inválida;
- status HTTP;
- mensagem;
- campo `authorization`;
- prefixo `Bearer`;
- estrutura JWT em três partes.

> A validação estrutural não representa validação criptográfica da assinatura JWT.

## Autorização

O token obtido é utilizado em uma rota protegida:

```text
POST /login
     ↓
JWT
     ↓
Authorization Header
     ↓
Protected Endpoint
     ↓
HTTP 200
```

O mesmo recurso é acessado sem token:

```text
No JWT
  ↓
Protected Endpoint
  ↓
HTTP 401
```

Portanto, a simples geração do token não é utilizada como evidência suficiente de autorização.

---

# 📐 Contract Testing

O projeto utiliza **AJV + JSON Schema** para validar a estrutura retornada por:

```text
GET /usuarios
```

São verificados elementos como:

```text
quantidade
usuarios[]
  ├── nome
  ├── email
  ├── password
  ├── administrador
  └── _id
```

Essa camada busca detectar:

- propriedades removidas;
- propriedades esperadas ausentes;
- alterações de tipo;
- mudanças estruturais que possam afetar consumidores.

---

# 🚦 Rate Limit como Teste Opt-in

Existe um cenário para:

```text
100 requisições por minuto
```

A requisição acima do limite deve retornar:

```text
HTTP 429
```

Esse teste **não faz parte da regressão padrão**.

A decisão é intencional porque:

- a aplicação utilizada é uma API pública;
- o teste gera volume elevado de requisições;
- a política pode variar conforme o ambiente;
- uma configuração ausente não deve produzir um falso quality gate funcional.

Execução:

```bash
RUN_RATE_LIMIT_TEST=true \
RATE_LIMIT_BASE_URL=https://seu-ambiente.com \
npm run test:rate-limit
```

---

# 🚥 Quality Gates

Uma execução da regressão obrigatória não deve ser considerada saudável sem investigação quando houver falha em:

- autenticação;
- autorização;
- CRUD crítico;
- campos obrigatórios;
- duplicidade;
- contrato;
- TypeScript;
- regressão automatizada obrigatória.

O fluxo esperado é:

```text
Test Failed
    ↓
Reproduz?
  /       \
não       sim
 ↓         ↓
Test /    Viola requisito
Data /     ou contrato?
Env          |
             ↓
        Product Defect
```

Categorias consideradas:

- Product Defect
- Test Defect
- Data Issue
- Environment Issue
- Contract Change

Uma falha automatizada não é classificada automaticamente como defeito de produto.

---

# 🔎 Traceability

A rastreabilidade conecta:

```text
Risk
  ↓
Scenario
  ↓
Automated Test
  ↓
Severity
  ↓
Quality Gate
```

Exemplo:

```text
R06
Atualização não persistir
        ↓
users-crud.spec.ts
        ↓
PUT
        ↓
GET posterior
        ↓
Critical
        ↓
Block
```

Matriz completa:

[`docs/traceability-matrix.md`](docs/traceability-matrix.md)

---

# 📊 Suíte Automatizada

Baseline atual:

```text
18 cenários cadastrados
17 testes executados
1 cenário opt-in
0 falhas
```

Execução validada:

```text
17 passed
1 skipped
```

O cenário `skipped` corresponde ao teste de rate limit opt-in.

---

# 🛠️ Stack

| Área | Tecnologia |
|---|---|
| Test Automation | Playwright |
| Linguagem | TypeScript |
| Runtime | Node.js |
| Contract Testing | JSON Schema + AJV |
| Test Data | Faker |
| Reporting | Playwright HTML, Allure, JUnit |
| CI/CD | GitHub Actions, GitLab CI |
| Versionamento | Git |

---

# 🚀 Instalação

## Pré-requisitos

- Node.js 20+
- npm
- Git
- Java/JDK para geração local do Allure

Clone:

```bash
git clone https://github.com/jaquelineleite/qa-api-automation-playwright.git
```

Entre no diretório:

```bash
cd qa-api-automation-playwright
```

Instale:

```bash
npm ci
```

---

# ▶️ Execução

## Regressão

```bash
npm test
```

## Usuários

```bash
npm run test:users
```

## Autenticação

```bash
npm run test:auth
```

## TypeScript

```bash
npm run typecheck
```

---

# 📈 Reporting

O projeto produz:

- Playwright HTML Report;
- Allure Report;
- JUnit.

Playwright:

```bash
npx playwright show-report reports/playwright-report
```

Allure:

```bash
npm run allure:generate
npm run allure:open
```

JUnit:

```text
reports/junit/results.xml
```

---

# 🔄 CI/CD

## GitHub Actions

```text
Checkout
   ↓
Setup Node
   ↓
npm ci
   ↓
TypeScript Check
   ↓
API Tests
   ↓
Allure
   ↓
Artifacts
```

São disponibilizados:

- `allure-report`;
- `allure-results`;
- `playwright-report`.

## GitLab CI

```text
npm ci
   ↓
npm run typecheck
   ↓
npm test
   ↓
npm run allure:generate
```

Relatórios são armazenados como artefatos da pipeline.

---

# 🔒 Limites da Cobertura

Este projeto **não afirma cobertura total de qualidade do sistema**.

A cobertura atual não representa:

- code coverage do backend;
- pentest;
- OWASP API Security completo;
- validação criptográfica JWT;
- performance completa;
- stress;
- endurance;
- observabilidade interna;
- banco de dados interno;
- infraestrutura da ServeRest.

Esses itens exigiriam escopo e níveis de acesso diferentes.

Essa distinção faz parte da estratégia de qualidade: **automatizar um cenário não significa declarar cobertura sobre uma área inteira.**

---

# 🔭 Evoluções Planejadas

Próximas possibilidades de evolução:

- classificação formal entre smoke e regression;
- métricas de estabilidade;
- estratégia de flaky tests;
- expansão de contract testing;
- observabilidade;
- análise automatizada de falhas;
- AI Quality Engineering;
- integração futura com agentes e MCP.

---

# 👩‍💻 Autora

**Jaqueline Fernandes de Andrade**

Quality Assurance | Quality Engineering | Test Automation

GitHub: https://github.com/jaquelineleite