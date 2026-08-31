# 🧪 API Quality Engineering — Playwright & TypeScript

[![API Quality Gate](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml/badge.svg)](https://github.com/jaquelineleite/qa-api-automation-playwright/actions/workflows/api-tests.yml)

[![GitLab Pipeline](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/badges/main/pipeline.svg)](https://gitlab.com/jaquelinefdeandrade/qa-api-automation-playwright/-/pipelines)

Projeto de **Quality Engineering aplicado a APIs REST**, utilizando Playwright e TypeScript para transformar riscos de qualidade em verificações automatizadas, rastreáveis, mensuráveis e integradas ao CI/CD.

Mais do que automatizar endpoints, este projeto demonstra decisões de engenharia relacionadas a:

- estratégia de testes baseada em risco;
- definição de Smoke, Regression e Non-Functional Testing;
- escolha da camada adequada de validação;
- autenticação e autorização com JWT;
- testes funcionais, negativos e de contrato;
- gerenciamento do ciclo de vida da massa de testes;
- isolamento e cleanup de dados;
- rastreabilidade entre riscos e testes automatizados;
- estabilidade da suíte e tratamento de flaky tests;
- classificação e investigação de falhas;
- métricas de qualidade;
- evidências com Playwright, JUnit e Allure;
- Quality Summary no GitHub Actions;
- Quality Gate obrigatório;
- execução contínua em pipelines.

A [ServeRest](https://serverest.dev/) é utilizada como sistema sob teste para as validações funcionais. As validações não funcionais que geram carga são executadas exclusivamente contra uma instância local e controlada.

> O objetivo não é maximizar a quantidade de testes, mas produzir um **sinal de qualidade confiável** sobre os riscos selecionados.

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

# 🧭 Documentação de Engenharia

As decisões de qualidade, arquitetura, risco, estabilidade e execução estão documentadas em:

| Documento | Objetivo |
|---|---|
| [Quality Strategy](docs/quality-strategy.md) | Princípios de Quality Engineering, estratégia baseada em risco e Quality Gates |
| [Risk Matrix](docs/risk-matrix.md) | Riscos, impacto, probabilidade, prioridade e estratégia de mitigação |
| [Test Architecture](docs/test-architecture.md) | Critérios utilizados para selecionar a camada adequada de teste |
| [Traceability Matrix](docs/traceability-matrix.md) | Relação entre risco, cenário automatizado, criticidade, cobertura e Quality Gate |
| [Test Suite Strategy](docs/test-suite-strategy.md) | Critérios de separação entre Smoke, Regression e Non-Functional Testing |
| [Test Stability Strategy](docs/test-stability-strategy.md) | Política de flaky tests, retries, investigação e classificação de falhas |
| [Non-Functional Strategy](docs/non-functional-strategy.md) | Baseline não funcional, métricas, segurança de execução e limitações |

---

# ⚠️ Risk-Based Testing

A cobertura não é definida pela quantidade de testes, mas pela criticidade dos riscos que precisam ser controlados.

Exemplos:

| Área | Risco | Prioridade | Estratégia |
|---|---|---:|---|
| Autenticação | Usuário válido não conseguir autenticar | Crítica | Login positivo |
| Autenticação | Credenciais inválidas concederem acesso | Crítica | Teste negativo |
| Autorização | Endpoint protegido aceitar acesso sem JWT | Crítica | Chamada sem token |
| Usuários | Criação retornar sucesso sem estado válido | Alta | POST + validações |
| Usuários | Atualização não ser persistida | Alta | PUT + GET de confirmação |
| Usuários | Exclusão retornar sucesso sem remover o recurso | Alta | DELETE + GET de pós-condição |
| Contrato | Mudança estrutural quebrar consumidores | Alta | JSON Schema + AJV |
| Massa de teste | Dados compartilhados gerarem falsos resultados | Alta | Faker + fixtures + cleanup |
| Estabilidade | Falhas intermitentes reduzirem a confiança na suíte | Alta | Zero retries + triagem de falhas |
| Não funcional | Comportamento degradar sob requisições concorrentes | Média | Baseline local e controlado |

A matriz completa está disponível em:

[`docs/risk-matrix.md`](docs/risk-matrix.md)

---

# 🏗️ Arquitetura de Testes

```text
                     QUALITY STRATEGY
                            |
                            v
                       RISK ANALYSIS
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
        Functional       Contract    Non-functional
              |             |             |
              v             v             v
         API Tests      JSON Schema   Local Baseline
              |             |             |
              +------+------+-------------+
                     |
                     v
               Test Evidence
                     |
                     v
              Quality Metrics
                     |
                     v
              Failure Analysis
                     |
                     v
               Quality Gate
```

Este repositório valida diretamente a camada de serviços REST.

Não é utilizada uma camada de UI para comportamentos que podem ser comprovados de maneira mais rápida, isolada e confiável pela própria API.

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

A escolha da camada é baseada no **risco que precisa ser validado**, no custo de execução e na qualidade do feedback produzido pelo teste.

---

# 📂 Arquitetura do Framework

```text
.
├── .github/
│   └── workflows/
│       └── api-tests.yml
│
├── docs/
│   ├── non-functional-strategy.md
│   ├── quality-strategy.md
│   ├── risk-matrix.md
│   ├── test-architecture.md
│   ├── test-stability-strategy.md
│   ├── test-suite-strategy.md
│   └── traceability-matrix.md
│
├── scripts/
│   └── generate-quality-metrics.mjs
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
│   │       ├── non-functional-baseline.spec.ts
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
ApiClient
    ↓
Request Layer
    ↓
Fixtures / Test Data
    ↓
Schemas / Contracts
    ↓
Test Scenarios
    ↓
Reports / Metrics / Evidence
```

Essa arquitetura permite:

- centralizar a comunicação HTTP;
- reduzir duplicação de código;
- separar comportamento de teste da infraestrutura de acesso à API;
- controlar o ciclo de vida da massa de dados;
- reutilizar fixtures e requests;
- manter contratos separados dos cenários funcionais;
- aumentar legibilidade e manutenibilidade;
- reduzir acoplamento entre cenários;
- produzir evidências e métricas consumíveis pelo CI/CD.

---

# 🧹 Test Data Lifecycle

A massa de testes é criada dinamicamente utilizando Faker e gerenciada por fixtures reutilizáveis.

Nos cenários CRUD, a fixture controla o ciclo de vida completo do usuário:

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

O cleanup é tratado de forma **idempotente**.

Se o próprio cenário remover o usuário, a fixture identifica que o recurso já não existe e não tenta excluí-lo novamente.

Se o recurso permanecer disponível após a execução, a fixture realiza a limpeza automaticamente.

Essa estratégia reduz:

- dependência de massa fixa;
- dados abandonados no ambiente;
- colisões entre execuções;
- dependência da ordem dos testes;
- falsos negativos provocados por estado compartilhado;
- complexidade dentro dos próprios cenários de teste.

O objetivo é manter os testes independentes e permitir que cada cenário controle o estado necessário para sua própria execução.

---

# ✅ Validação de Estado e Pós-Condições

Os testes não consideram apenas o status HTTP retornado pela operação.

Quando o risco envolve alteração de estado, a automação verifica também a **pós-condição**.

## Update

```text
PUT /usuarios/{id}
        ↓
HTTP 200
        ↓
GET /usuarios/{id}
        ↓
Validar estado persistido
```

Após a atualização, uma nova consulta confirma que os dados realmente foram persistidos.

## Delete

```text
DELETE /usuarios/{id}
        ↓
HTTP 200
        ↓
GET /usuarios/{id}
        ↓
Recurso não encontrado
```

Após a exclusão, uma nova consulta confirma que o recurso deixou de existir.

Essa abordagem evita falsos positivos em que a API retorna sucesso para a operação, mas o estado final não corresponde ao comportamento esperado.

---

# 🧪 Data-Driven Negative Testing

As validações de campos obrigatórios utilizam uma abordagem parametrizada para reduzir duplicação sem perder rastreabilidade.

São validadas individualmente as ausências de:

- `nome`;
- `email`;
- `password`;
- `administrador`.

Cada combinação continua sendo apresentada como um cenário independente nos relatórios.

Também fazem parte da cobertura negativa:

- criação com e-mail duplicado;
- consulta de usuário inexistente;
- exclusão de usuário inexistente.

A parametrização reduz código repetido, enquanto os cenários permanecem identificáveis para análise de falhas e evidências.

---

# 🔐 Autenticação e Autorização

Autenticação e autorização são tratadas como **riscos diferentes** e, portanto, possuem verificações independentes.

## Autenticação

```text
email + senha
     ↓
POST /login
     ↓
JWT
```

O fluxo de autenticação valida:

- credenciais válidas;
- credenciais inválidas;
- status HTTP;
- mensagem de resposta;
- presença do campo `authorization`;
- prefixo `Bearer`;
- estrutura básica do JWT em três segmentos.

O objetivo não é apenas confirmar que o endpoint `/login` responde, mas verificar se o mecanismo de autenticação produz uma credencial utilizável para os fluxos protegidos.

> A validação estrutural do JWT não representa validação criptográfica da assinatura do token.

## Autorização

O token obtido no login é utilizado em uma rota protegida:

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

O mesmo recurso também é acessado sem token:

```text
No JWT
   ↓
Protected Endpoint
   ↓
HTTP 401
```

Portanto, a simples geração do token não é tratada como evidência suficiente de autorização.

A estratégia valida tanto:

- obtenção da credencial;
- uso da credencial em uma operação protegida;
- rejeição do acesso quando a credencial não é fornecida.

---

# 📐 Contract Testing

O projeto utiliza **AJV + JSON Schema** para validar a estrutura retornada por:

```text
GET /usuarios
```

Entre os elementos validados estão:

```text
quantidade
usuarios[]
  ├── nome
  ├── email
  ├── password
  ├── administrador
  └── _id
```

Essa camada busca detectar mudanças que possam afetar consumidores da API, como:

- propriedades removidas;
- propriedades obrigatórias ausentes;
- alterações de tipo;
- estruturas incompatíveis;
- mudanças inesperadas no formato da resposta.

A validação de contrato complementa os testes funcionais: um endpoint pode continuar retornando `HTTP 200` e, ainda assim, introduzir uma quebra estrutural para seus consumidores.

---

# 📊 Non-Functional API Baseline

O projeto possui uma validação não funcional separada da regressão funcional.

Ela é identificada pela tag:

```text
@non-functional
```

A execução é **opt-in** e restrita a ambiente local.

O teste se recusa a gerar carga contra hosts externos e aceita somente:

```text
localhost
127.0.0.1
::1
```

Essa decisão evita que uma execução acidental gere carga sobre APIs públicas ou ambientes compartilhados.

## Métricas coletadas

O baseline registra:

- total de requisições;
- nível de concorrência;
- requisições com sucesso;
- requisições com falha;
- taxa de erro;
- duração total;
- tempo médio de resposta;
- p95 de tempo de resposta;
- requests por segundo;
- distribuição de status HTTP.

Exemplo de evidência:

```json
{
  "totalRequests": 50,
  "concurrency": 5,
  "successfulRequests": 50,
  "failedRequests": 0,
  "errorRate": 0,
  "durationMs": 572,
  "averageResponseTimeMs": 48.7,
  "p95ResponseTimeMs": 71,
  "requestsPerSecond": 87.41,
  "statusDistribution": {
    "200": 50
  }
}
```

A evidência é anexada ao resultado do teste como:

```text
non-functional-baseline
```

## Execução

Com uma instância local do ServeRest disponível:

```bash
RUN_NON_FUNCTIONAL_TEST=true \
NON_FUNCTIONAL_BASE_URL=http://127.0.0.1:3000 \
NF_TOTAL_REQUESTS=50 \
NF_CONCURRENCY=5 \
npm run test:non-functional
```

Sem o opt-in:

```bash
npm run test:non-functional
```

o cenário permanece:

```text
skipped
```

## Baseline não é SLA

O projeto não define thresholds arbitrários de tempo de resposta apenas para tornar o teste mais sofisticado.

Uma medição como:

```text
p95 = 100 ms
```

representa um dado observado naquele ambiente e naquela execução.

Ela só deveria se transformar em um requisito como:

```text
p95 < 150 ms
```

quando existir um SLA, SLO, requisito técnico ou baseline histórico que justifique esse limite.

Por isso, a implementação atual é tratada como **baseline não funcional controlado**, e não como uma estratégia completa de load, stress ou soak testing.

A estratégia completa está documentada em:

[`docs/non-functional-strategy.md`](docs/non-functional-strategy.md)

---

# 🚥 Quality Gates

O pipeline utiliza um Quality Gate obrigatório para impedir que uma mudança seja considerada saudável quando verificações essenciais falham.

O fluxo atual é:

```text
TypeScript Quality Check
        ↓
Smoke Tests
        ↓
API Regression
        ↓
Quality Metrics
        ↓
Quality Summary
        ↓
Reports / Evidence
        ↓
Quality Gate
```

Uma falha em TypeScript, Smoke ou Regression impede a aprovação do Quality Gate.

Entre os riscos cobertos pela regressão obrigatória estão:

- autenticação;
- autorização;
- CRUD crítico;
- campos obrigatórios;
- duplicidade;
- contrato;
- persistência de estado;
- pós-condições;
- integridade da automação.

Os testes não funcionais permanecem fora desse gate por exigirem ambiente e estratégia de execução específicos.

## Investigação de Falhas

Uma falha automatizada não é classificada automaticamente como defeito de produto.

O fluxo de investigação é:

```text
Failure Detected
       ↓
Error / Evidence Analysis
       ↓
Reproduction
       ↓
Environment / Data Check
       ↓
Automation Check
       ↓
Requirement / Contract Check
       ↓
Root Cause Classification
```

As possíveis causas incluem:

- Product Failure;
- Test Automation Failure;
- Test Data Failure;
- Environment Failure;
- Contract Change;
- Flaky Test.

O Allure também utiliza categorias de **triagem inicial**, como:

- `Environment / Connectivity Signal`;
- `Timeout / Instability Signal`;
- `Assertion / Functional Signal`;
- `Unclassified Failure - Investigation Required`.

Essas categorias funcionam como sinais para investigação e não como diagnóstico automático da causa raiz.

A política completa está documentada em:

[`docs/test-stability-strategy.md`](docs/test-stability-strategy.md)

---

# 🔎 Traceability

A rastreabilidade conecta risco, cenário, implementação, criticidade e decisão de qualidade:

```text
Risk
  ↓
Scenario
  ↓
Automated Test
  ↓
Validation / Evidence
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
PUT /usuarios/{id}
        ↓
GET posterior
        ↓
Validar estado persistido
        ↓
Critical
        ↓
Block
```

A rastreabilidade ajuda a responder não apenas **quais testes existem**, mas principalmente **por que eles existem e qual risco justificou sua automação**.

Matriz completa:

[`docs/traceability-matrix.md`](docs/traceability-matrix.md)

---

# 📊 Suíte Automatizada

A estratégia atual separa explicitamente os testes por propósito.

## Smoke

```text
4 cenários críticos
```

Cobertura:

- login válido;
- autenticação em rota protegida com JWT;
- criação de usuário;
- listagem de usuários.

Execução:

```bash
npm run test:smoke
```

Resultado validado:

```text
4 passed
```

## Regression

A regressão funcional exclui cenários marcados como `@non-functional`.

Execução:

```bash
npm run test:regression
```

Resultado validado:

```text
17 passed
```

## Non-Functional

O baseline não funcional possui execução independente e opt-in.

Execução padrão:

```bash
npm run test:non-functional
```

Sem opt-in:

```text
1 skipped
```

Execução controlada em ambiente local:

```bash
RUN_NON_FUNCTIONAL_TEST=true \
NON_FUNCTIONAL_BASE_URL=http://127.0.0.1:3000 \
NF_TOTAL_REQUESTS=50 \
NF_CONCURRENCY=5 \
npm run test:non-functional
```

Resultado validado:

```text
1 passed
```

A separação entre as suítes permite produzir feedback rápido sem misturar riscos funcionais com execuções que possuem características e requisitos de ambiente diferentes.

---

# 📏 Quality Metrics

Após a regressão, o projeto gera automaticamente métricas a partir do relatório JUnit.

São calculados:

- total de testes;
- testes aprovados;
- falhas;
- erros;
- testes ignorados;
- pass rate;
- duração;
- status da execução.

Exemplo:

```text
API QUALITY METRICS
-------------------
Total:     17
Passed:    17
Failed:    0
Errors:    0
Skipped:   0
Pass Rate: 100%
Status:    PASSED
```

Execução manual:

```bash
npm run quality:metrics
```

Arquivos produzidos:

```text
reports/quality/quality-metrics.json
reports/quality/quality-summary.md
```

O formato JSON permite consumo automatizado, enquanto o Markdown pode ser utilizado diretamente por pipelines e relatórios.

---

# 🛠️ Stack

| Área | Tecnologia |
|---|---|
| Test Automation | Playwright |
| Linguagem | TypeScript |
| Runtime | Node.js |
| API Testing | Playwright APIRequestContext |
| Contract Testing | JSON Schema + AJV |
| Test Data | Faker |
| Test Architecture | Fixtures + Request Layer |
| Reporting | Playwright HTML, Allure, JUnit |
| Quality Metrics | Node.js + JUnit parsing |
| CI/CD | GitHub Actions, GitLab CI |
| Versionamento | Git |
| Quality Governance | Pull Requests, Branch Protection, Quality Gate |

---

# 🚀 Instalação

## Pré-requisitos

- Node.js 22+
- npm
- Git
- Java/JDK para geração local do Allure

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

# ▶️ Execução

## Validação TypeScript

```bash
npm run typecheck
```

## Smoke

```bash
npm run test:smoke
```

## Regression

```bash
npm run test:regression
```

## Todos os testes Playwright

```bash
npm test
```

O baseline não funcional continuará `skipped` enquanto o opt-in não estiver habilitado.

## Usuários

```bash
npm run test:users
```

## Autenticação

```bash
npm run test:auth
```

## Non-Functional Baseline

Sem execução de carga:

```bash
npm run test:non-functional
```

Com instância local do ServeRest disponível:

```bash
RUN_NON_FUNCTIONAL_TEST=true \
NON_FUNCTIONAL_BASE_URL=http://127.0.0.1:3000 \
NF_TOTAL_REQUESTS=50 \
NF_CONCURRENCY=5 \
npm run test:non-functional
```

## Quality Metrics

```bash
npm run quality:metrics
```

---

# 📈 Reporting e Evidências

O projeto produz múltiplos formatos de evidência para diferentes necessidades de investigação e integração.

## Playwright HTML Report

```bash
npx playwright show-report reports/playwright-report
```

## Allure

Gerar:

```bash
npm run allure:generate
```

Abrir:

```bash
npm run allure:open
```

O Allure também recebe:

- informações de ambiente;
- política de retries;
- contexto do Quality Gate;
- categorias de triagem de falhas.

## JUnit

```text
reports/junit/results.xml
```

O JUnit é utilizado também como fonte para geração das métricas de qualidade.

## Quality Metrics

```text
reports/quality/quality-metrics.json
reports/quality/quality-summary.md
```

## Failure Triage

O relatório Allure classifica padrões de falha em sinais iniciais de investigação:

```text
Environment / Connectivity Signal
Timeout / Instability Signal
Assertion / Functional Signal
Unclassified Failure - Investigation Required
```

Essas categorias auxiliam a triagem, mas não substituem a investigação de causa raiz.

---

# 🔄 CI/CD

## GitHub Actions

O pipeline principal implementa uma sequência explícita de validação:

```text
Checkout
   ↓
Setup Node.js 22
   ↓
npm ci
   ↓
TypeScript Quality Check
   ↓
Smoke Tests
   ↓
API Regression
   ↓
Generate Quality Metrics
   ↓
Publish Quality Summary
   ↓
Generate Reports
   ↓
Upload Artifacts
   ↓
Quality Gate
```

O Smoke fornece feedback rápido sobre fluxos críticos antes da regressão completa.

A regressão funcional é executada separadamente e exclui cenários `@non-functional`.

Após a execução, o GitHub Actions publica um **Quality Summary** diretamente na página da pipeline com o status das etapas e as métricas da suíte.

Artifacts disponibilizados:

- `playwright-report`;
- `junit-results`;
- `quality-metrics`;
- `allure-report`;
- `allure-results`.

## Quality Gate

O job `Quality Gate` depende da validação obrigatória da API.

Uma falha nas etapas obrigatórias impede que o gate seja aprovado.

```text
Mandatory validation success
           ↓
     Quality Gate
        PASSED
```

ou:

```text
Mandatory validation failure
           ↓
     Quality Gate
        FAILED
```

## Branch Protection

A branch `main` utiliza proteção para tornar o Quality Gate parte do fluxo de mudança.

A estratégia adotada inclui:

- alteração através de Pull Request;
- status check obrigatório;
- `Quality Gate` obrigatório;
- branch atualizada antes do merge;
- resolução de conversas;
- sem bypass das regras configuradas.

Como o projeto é mantido individualmente, aprovação obrigatória de outro reviewer não é utilizada.

Esse fluxo representa:

```text
Feature Branch
      ↓
Pull Request
      ↓
Automated Validation
      ↓
Quality Gate
      ↓
Merge
```

## GitLab CI

O projeto também mantém configuração de pipeline no GitLab como implementação adicional de CI/CD.

A pipeline executa verificações automatizadas e mantém relatórios como artifacts, demonstrando portabilidade da estratégia de automação entre plataformas de integração contínua.

---

# 🧯 Estratégia de Estabilidade

A suíte possui uma política explícita para evitar que instabilidade seja mascarada.

No Playwright:

```text
retries: 0
```

Retries automáticos permanecem desabilitados intencionalmente.

Também é utilizado:

```text
forbidOnly: true no CI
```

para impedir que um `test.only()` enviado acidentalmente reduza silenciosamente a cobertura executada pela pipeline.

A estratégia prioriza:

```text
Failure
   ↓
Evidence
   ↓
Reproduction
   ↓
Classification
   ↓
Root Cause
   ↓
Correction
```

em vez de:

```text
Failure
   ↓
Automatic Retry
   ↓
Passed
   ↓
Instability Hidden
```

Detalhes:

[`docs/test-stability-strategy.md`](docs/test-stability-strategy.md)

---

# 🔒 Limites da Cobertura

Este projeto **não afirma cobertura total da qualidade do sistema**.

A cobertura atual não representa:

- code coverage do backend;
- pentest;
- OWASP API Security completo;
- validação criptográfica da assinatura JWT;
- testes completos de autorização por papéis e permissões;
- estratégia completa de load testing;
- stress testing;
- soak/endurance testing;
- observabilidade interna da aplicação;
- validação direta do banco de dados;
- infraestrutura interna da ServeRest;
- disponibilidade ou resiliência de dependências distribuídas.

Esses itens exigiriam escopo, requisitos, ambientes ou níveis de acesso diferentes.

Essa distinção faz parte da estratégia de Quality Engineering:

> **Automatizar um cenário não significa declarar cobertura sobre uma área inteira.**

---

# 🔭 Evoluções Futuras

O projeto está funcionalmente consolidado para o escopo atual. Evoluções futuras devem ser guiadas por novos riscos ou requisitos, e não apenas pelo aumento da quantidade de testes.

Possibilidades:

- expansão de contract testing para outros recursos;
- baseline histórico de métricas entre builds;
- definição de thresholds baseada em SLA/SLO real;
- comparação automática de performance entre execuções;
- p99 e outras métricas não funcionais;
- correlação com CPU, memória e observabilidade;
- validações adicionais de segurança de API;
- integração com k6 ou JMeter quando houver necessidade de carga especializada;
- análise assistida de falhas;
- AI Quality Engineering;
- agentes de qualidade;
- integração futura através de MCP.

---

# 👩‍💻 Autora

**Jaqueline Fernandes de Andrade**

Quality Assurance | Quality Engineering | Test Automation

GitHub: [github.com/jaquelineleite](https://github.com/jaquelineleite)