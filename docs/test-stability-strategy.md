# Test Stability Strategy

## Objetivo

Definir uma estratégia para identificar, investigar e tratar instabilidades na suíte automatizada, evitando falsos positivos, falsos negativos e perda de confiança no Quality Gate.

A automação deve fornecer um sinal confiável sobre a qualidade do produto. Um teste que falha de forma intermitente precisa ser tratado como um problema de engenharia e não apenas executado novamente até passar.

---

## Princípios

- Testes automatizados devem ser determinísticos.
- Retry não deve esconder defeitos.
- Falhas devem ser classificadas antes de qualquer correção.
- Evidências devem permitir reproduzir e investigar o problema.
- Dados de teste devem ser isolados sempre que possível.
- Testes instáveis não devem permanecer indefinidamente bloqueando ou enfraquecendo o Quality Gate.
- A causa raiz deve ser priorizada em vez de soluções paliativas.

---

## Classificação de Falhas

Toda falha encontrada durante uma execução deve ser classificada em uma das categorias abaixo.

### 1. Product Failure

Falha causada pelo comportamento incorreto da aplicação ou API.

Exemplos:

- status HTTP diferente do esperado;
- regra de negócio incorreta;
- contrato da API quebrado;
- autenticação ou autorização incorreta;
- persistência de dados incorreta.

Resultado:

**Defeito de produto.**

---

### 2. Test Automation Failure

Falha causada pelo próprio código de automação.

Exemplos:

- assertion incorreta;
- implementação inadequada do teste;
- fixture defeituosa;
- tratamento incorreto dos dados;
- expectativa desatualizada.

Resultado:

**Correção necessária na automação.**

---

### 3. Environment Failure

Falha provocada por indisponibilidade ou instabilidade do ambiente.

Exemplos:

- API indisponível;
- timeout de infraestrutura;
- serviço externo indisponível;
- falha de rede;
- ambiente de teste degradado.

Resultado:

**Investigar infraestrutura ou ambiente antes de classificar como defeito de produto.**

---

### 4. Test Data Failure

Falha relacionada aos dados utilizados durante a execução.

Exemplos:

- usuário previamente existente;
- dados compartilhados entre testes;
- registro removido por outra execução;
- estado inadequado criado por teste anterior.

Resultado:

**Corrigir isolamento e ciclo de vida dos dados.**

---

### 5. Flaky Test

Teste que apresenta resultados diferentes sem alteração correspondente no produto.

Exemplo:

```text
Execução 1 → Passed
Execução 2 → Failed
Execução 3 → Passed