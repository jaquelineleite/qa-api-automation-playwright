# Quality Traceability Matrix

## 1. Objetivo

Esta matriz conecta os riscos identificados na estratégia de qualidade aos cenários automatizados existentes no projeto.

O objetivo é permitir responder de forma objetiva:

- qual risco está sendo coberto;
- qual teste fornece evidência sobre esse risco;
- em qual camada a validação ocorre;
- qual é a criticidade;
- se uma falha deve bloquear o quality gate;
- quais riscos possuem cobertura parcial ou ainda dependem de análise manual.

A quantidade de testes não é utilizada isoladamente como medida de cobertura.

Cobertura é tratada como a relação entre:

**risco → comportamento esperado → evidência produzida.**

---

## 2. Status de cobertura

| Status | Significado |
|---|---|
| Automated | Existe validação automatizada direta para o risco |
| Partial | Parte relevante do risco está automatizada, mas não representa cobertura completa |
| Process | O risco é tratado por processo ou análise, não por um teste automatizado isolado |
| Opt-in | Existe automação, porém sua execução é controlada e não faz parte da regressão padrão |
| Planned | Cobertura ainda não implementada |

---

## 3. Matriz de rastreabilidade

| Risk ID | Risco | Evidência / Cenário | Arquivo | Camada | Severidade | Coverage | Quality Gate |
|---|---|---|---|---|---|---|---|
| R01 | Usuário válido não conseguir autenticar | deve realizar login e retornar token JWT | `login.spec.ts` | API | Critical | Automated | Block |
| R02 | Credenciais inválidas concederem acesso | não deve realizar login com senha inválida | `login.spec.ts` | API | Critical | Automated | Block |
| R03 | Recurso protegido aceitar requisição sem token | não deve acessar rota protegida sem token JWT | `jwt-auth.spec.ts` | API / Auth | Critical | Automated | Block |
| R04 | Token válido não permitir acesso esperado | deve acessar rota protegida utilizando token JWT | `jwt-auth.spec.ts` | API / Auth | Critical | Automated | Block |
| R05 | Criação retornar sucesso sem estado recuperável | criação + recuperação de usuário nos fluxos CRUD | `users-crud.spec.ts` | API | High | Automated | Block |
| R06 | Atualização não persistir novo estado | deve atualizar um usuário + GET posterior | `users-crud.spec.ts` | API | Critical | Automated | Block |
| R07 | Exclusão não remover efetivamente o recurso | deve excluir um usuário + GET posterior | `users-crud.spec.ts` | API | Critical | Automated | Block |
| R08 | Usuário duplicado ser criado indevidamente | não deve criar usuário com e-mail duplicado | `users-negative.spec.ts` | API | Critical | Automated | Block |
| R09 | Campos obrigatórios ausentes serem aceitos | nome, e-mail, password e administrador ausentes | `users-negative.spec.ts` | API | Normal/High | Automated | Block |
| R10 | Alteração estrutural quebrar consumidores | validação de JSON Schema com AJV | `users-contract.spec.ts` | Contract | High | Automated | Block |
| R11 | Autenticação/autorização ser contornada | JWT presente x ausente em recurso protegido | `jwt-auth.spec.ts` | API / Security | Critical | Partial | Block |
| R12 | Massa compartilhada provocar resultados inconsistentes | Faker + lifecycle automático através de fixture | `user.fixture.ts` | Test Infrastructure | High | Process/Automated | Block if infrastructure failure |
| R13 | Instabilidade externa gerar falso defeito | classificação entre produto, ambiente, dados e teste | Quality Strategy | Environment | Medium | Process | Investigation |
| R14 | Limite de requisições apresentar comportamento inadequado | deve limitar requisições acima de 100 por minuto | `rate-limit.spec.ts` | Non-functional | Medium | Opt-in | Non-blocking by default |
| R15 | Falha de automação ser classificada como defeito de produto | processo de classificação de falhas | Quality Strategy | Quality Process | High | Process | Investigation |

---

## 4. Cobertura dos fluxos principais

### Usuários

```text
CREATE
  ↓
validação da resposta
  ↓
recurso criado

READ
  ↓
consulta por ID
  ↓
validação de dados

UPDATE
  ↓
resposta de sucesso
  ↓
GET posterior
  ↓
estado persistido

DELETE
  ↓
resposta de sucesso
  ↓
GET posterior
  ↓
recurso não encontrado


### Por que esse documento é importante

Ele faz algo que muitos portfólios não fazem:

**mostra os gaps também.**

Por exemplo, não estamos dizendo:

> “Tenho segurança de API.”

Estamos dizendo:

> “Tenho cobertura parcial de autenticação/autorização, mas isso não equivale a OWASP API Security completo.”

Isso transmite muito mais maturidade técnica.

E também fazemos uma conexão explícita:

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
Quality Gate = Block