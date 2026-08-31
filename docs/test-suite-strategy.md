# Test Suite Strategy — Smoke & Regression

## 1. Objetivo

Este documento define os critérios utilizados para classificar os testes automatizados entre Smoke e Regression.

A classificação não é baseada apenas na quantidade de cenários ou no tempo de execução.

São considerados:

- criticidade do fluxo;
- capacidade de detectar indisponibilidade rapidamente;
- impacto de negócio;
- custo de execução;
- dependências;
- estabilidade do cenário;
- valor do feedback produzido.

---

## 2. Smoke Suite

A Smoke Suite representa o conjunto mínimo de testes necessário para responder rapidamente:

> A API está funcional o suficiente para continuar com validações mais profundas?

Um teste é candidato a Smoke quando:

- cobre uma funcionalidade crítica;
- possui execução rápida;
- possui comportamento determinístico;
- identifica indisponibilidade ou quebra grave;
- representa um fluxo essencial do serviço.

### Smoke atual

| Cenário | Justificativa |
|---|---|
| Login com credenciais válidas | Confirma disponibilidade do fluxo de autenticação |
| Acesso protegido utilizando JWT | Confirma autenticação + autorização |
| Listagem de usuários | Confirma disponibilidade básica do recurso principal |
| Criação de usuário | Confirma operação crítica de escrita |

A Smoke Suite não tenta cobrir todas as regras.

Seu objetivo é **feedback rápido sobre a saúde básica do sistema**.

---

## 3. Regression Suite

A Regression Suite possui cobertura mais ampla e valida comportamentos que podem sofrer impacto após alterações.

Ela inclui:

- Smoke Suite;
- CRUD completo;
- autenticação;
- autorização;
- cenários negativos;
- campos obrigatórios;
- duplicidade;
- contrato;
- pós-condições;
- validações de recursos inexistentes.

Portanto:

```text
Regression
│
├── Smoke
│
├── CRUD completo
│
├── Negative Testing
│
├── Contract Testing
│
└── Auth validation