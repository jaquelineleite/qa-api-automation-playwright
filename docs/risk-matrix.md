# Risk Matrix — API Quality Engineering

## 1. Objetivo

Esta matriz relaciona riscos de qualidade, impacto, prioridade, camada de validação e estratégia de automação utilizada no projeto.

O objetivo não é medir qualidade apenas pela quantidade de testes executados, mas demonstrar quais riscos estão sendo mitigados e por qual mecanismo.

---

## 2. Critérios de avaliação

### Impacto

- Crítico: pode comprometer acesso, autorização ou integridade principal do sistema.
- Alto: afeta funcionalidade essencial ou consistência dos dados.
- Médio: afeta comportamento relevante, mas possui impacto limitado.
- Baixo: impacto reduzido ou facilmente contornável.

### Probabilidade

- Alta: cenário frequente ou naturalmente sujeito a regressão.
- Média: pode ocorrer dependendo de alterações ou condições específicas.
- Baixa: cenário pouco frequente ou dependente de condição excepcional.

### Prioridade

A prioridade é determinada considerando impacto e probabilidade.

---

## 3. Matriz de riscos

| ID | Área | Risco | Impacto | Probabilidade | Prioridade | Camada | Estratégia |
|---|---|---|---|---|---|---|---|
| R01 | Autenticação | Usuário válido não conseguir autenticar | Crítico | Média | Crítica | API | Teste positivo de login |
| R02 | Autenticação | Credenciais inválidas concederem acesso | Crítico | Média | Crítica | API | Teste negativo |
| R03 | Autorização | Endpoint protegido aceitar requisição sem token | Crítico | Média | Crítica | API | Chamada sem JWT |
| R04 | Autorização | Token válido não permitir acesso esperado | Crítico | Média | Crítica | API | Login + uso real do JWT |
| R05 | Usuários | API retornar sucesso sem persistir criação | Alto | Média | Alta | API | POST + GET posterior |
| R06 | Usuários | Atualização não refletir novo estado | Alto | Média | Alta | API | PUT + GET posterior |
| R07 | Usuários | Exclusão retornar sucesso sem remover recurso | Alto | Média | Alta | API | DELETE + validação posterior |
| R08 | Integridade | Usuários duplicados serem criados | Alto | Média | Alta | API | Teste negativo com e-mail duplicado |
| R09 | Validação | Campos obrigatórios ausentes serem aceitos | Alto | Alta | Alta | API | Testes negativos parametrizados |
| R10 | Contrato | Mudança estrutural quebrar consumidores | Alto | Média | Alta | Contrato | JSON Schema + AJV |
| R11 | Segurança | JWT inválido ou ausente ser aceito | Crítico | Média | Crítica | API | Validação de autenticação/autorização |
| R12 | Dados | Massa compartilhada provocar falsos resultados | Médio | Alta | Alta | Test Data | Dados dinâmicos com Faker |
| R13 | Ambiente | Instabilidade externa causar falso negativo | Médio | Média | Média | Ambiente | Análise antes de classificar defeito |
| R14 | Disponibilidade | Rate limit gerar comportamento inesperado | Médio | Baixa | Média | API / NFR | Execução opt-in |
| R15 | Automação | Falha de teste ser confundida com defeito de produto | Alto | Média | Alta | Quality Process | Classificação de falhas |

---

## 4. Relação entre risco e camada de teste

### API

A camada de API foi escolhida para validar:

- autenticação;
- autorização;
- regras funcionais dos endpoints;
- códigos HTTP;
- mensagens de resposta;
- persistência de estado;
- cenários negativos.

Esses comportamentos podem ser verificados diretamente no serviço, sem necessidade de interface gráfica.

---

### Contrato

Testes de contrato são utilizados quando o principal risco está relacionado à estrutura das respostas e à compatibilidade com consumidores.

Exemplo:

```text
API altera campo esperado
        ↓
Consumidor não consegue interpretar resposta
        ↓
Falha de integração
