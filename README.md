# 🚀 Desafio de Automação de Testes de API - Banco Carrefour

## 📋 Sobre o projeto

Projeto desenvolvido como solução para o desafio técnico de Automação de Testes de API do Banco Carrefour.

O objetivo foi construir um framework de testes automatizados utilizando Playwright + TypeScript para validar os principais endpoints da API ServeRest, seguindo boas práticas de organização, reutilização de código e geração de relatórios.

---

# 🛠 Tecnologias utilizadas

- Playwright
- TypeScript
- Node.js
- Faker
- AJV
- Allure Report
- GitHub Actions

---

# 📁 Estrutura do projeto

```
src
├── client
│   └── apiClient.ts
├── data
│   └── user.data.ts
├── helpers
├── requests
│   ├── auth.request.ts
│   └── users.request.ts
├── schemas
├── tests
│   ├── users
│   │   ├── create-user.spec.ts
│   │   ├── users-crud.spec.ts
│   │   ├── users-negative.spec.ts
│   │   └── login.spec.ts
│   └── auth
└── utils
```

---

# ✅ Casos de teste implementados

## Usuários

- Criar usuário
- Listar usuários
- Buscar usuário por ID
- Atualizar usuário
- Excluir usuário

## Autenticação

- Login com sucesso
- Login com senha inválida

## Cenários negativos

- E-mail duplicado
- Nome obrigatório
- E-mail obrigatório
- Senha obrigatória
- Buscar usuário inexistente
- Excluir usuário inexistente

---

# 📊 Relatórios

O projeto gera automaticamente:

- Playwright HTML Report
- Allure Report

O Allure está organizado utilizando:

- Epic
- Feature
- Story
- Severity
- Owner
- Environment

---

# ▶️ Instalação

```bash
npm install
```

---

# ▶️ Executar todos os testes

```bash
npm test
```

---

# ▶️ Executar apenas Login

```bash
npm run test:auth
```

---

# ▶️ Executar apenas Usuários

```bash
npm run test:users
```

---

# ▶️ Validar TypeScript

```bash
npm run typecheck
```

---

# ▶️ Gerar Allure

```bash
npm run allure:generate
```

Abrir relatório

```bash
npm run allure:open
```

---

# ▶️ Abrir relatório Playwright

```bash
npm run test:report
```

---

# ⚙️ Integração Contínua

O projeto possui pipeline utilizando GitHub Actions.

A pipeline executa automaticamente:

- Instalação das dependências
- Validação do TypeScript
- Execução dos testes
- Geração do Allure Report
- Publicação dos artefatos

---

# 📈 Resultados atuais

- ✅ 13 testes automatizados
- ✅ CRUD completo
- ✅ Autenticação JWT
- ✅ Cenários positivos
- ✅ Cenários negativos
- ✅ Relatórios Playwright
- ✅ Relatórios Allure
- ✅ Pipeline GitHub Actions
- ✅ TypeScript

---

# 👩‍💻 Autora

**Jaqueline Fernandes de Andrade**

Analista de Qualidade | QA Automation

Tecnologias:

- Playwright
- Cypress
- TypeScript
- JavaScript
- API Testing
- CI/CD
- Allure
- GitHub Actions