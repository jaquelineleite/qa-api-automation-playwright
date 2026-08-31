# Non-Functional Testing Strategy

## Objetivo

Definir uma estratégia segura e mensurável para validações não funcionais da API, separando esse tipo de execução da regressão funcional e evitando carga indevida em ambientes públicos ou compartilhados.

---

## Escopo Atual

O projeto possui um baseline não funcional de API identificado pela tag:

`@non-functional`

O cenário coleta métricas sobre uma quantidade controlada de requisições executadas contra uma instância local do ServeRest.

O objetivo atual é gerar um baseline técnico, e não declarar um SLA de performance inexistente.

---

## Ambiente

Testes não funcionais deste projeto devem ser executados apenas contra ambiente local.

Hosts permitidos:

- localhost
- 127.0.0.1
- ::1

A própria automação impede execução contra hosts externos.

Isso reduz o risco de gerar carga acidental em APIs públicas.

---

## Execução Opt-In

O teste somente executa quando:

`RUN_NON_FUNCTIONAL_TEST=true`

A URL pode ser informada através de:

`NON_FUNCTIONAL_BASE_URL`

Valor padrão:

`http://127.0.0.1:3000`

Também é possível controlar:

`NF_TOTAL_REQUESTS`

e:

`NF_CONCURRENCY`

Valores padrão:

- total de requisições: 50
- concorrência: 5

---

## Baseline Atual

A execução coleta:

- total de requisições;
- nível de concorrência;
- requisições com sucesso;
- requisições com falha;
- taxa de erro;
- duração total;
- tempo médio de resposta;
- p95 de tempo de resposta;
- requisições por segundo;
- distribuição de status HTTP.

---

## Evidência

Exemplo:

```json
{
  "totalRequests": 50,
  "concurrency": 5,
  "successfulRequests": 50,
  "failedRequests": 0,
  "errorRate": 0,
  "durationMs": 1250,
  "averageResponseTimeMs": 102.4,
  "p95ResponseTimeMs": 148,
  "requestsPerSecond": 40,
  "statusDistribution": {
    "200": 50
  }
}