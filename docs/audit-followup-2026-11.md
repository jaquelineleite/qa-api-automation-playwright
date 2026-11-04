# Auditoria complementar — API Quality Engineering

Data: 2026-11-03
Base: main após merge dos PRs #16 e #17.
Escopo: inspeção estática de README, package.json, playwright.config.ts, testes JWT, contrato, CRUD, negativos, matriz de rastreabilidade e GitHub Actions.
**Não representa auditoria OWASP completa nem comparação exaustiva com publicações externas.** As publicações específicas de Lilian Borba ainda precisam ser identificadas e vinculadas por URL/texto para comparação item a item.

## Evidência de execução anterior
GitHub Actions run 41740013743: 19/19 testes aprovados, TypeScript, Smoke, Regression e Quality Gate aprovados. Isso comprova os cenários executados, não ausência de vulnerabilidades.

## Matriz de achados e decisões

| ID | Área | Evidência no código | Status | Próximo passo | Prioridade |
| --- | --- | --- | --- | --- | --- |
| A01 | JWT ausente/malformado | src/tests/users/jwt-auth.spec.ts | Cobertura presente | Revisar variações de autorização por recurso | Alta |
| A02 | BOLA/IDOR | Não identificado nos testes revisados | Lacuna a confirmar com semântica da API | Determinar se endpoints possuem ownership; só então escrever teste válido | Alta |
| A03 | Exposição de password | src/schemas/users.schema.ts e README documentam campo password em GET /usuarios | Risco de exposição a investigar | Avaliar contrato real e requisitos; não normalizar exposição como segura | Alta |
| A04 | Content-Type | users-contract.spec.ts e users-crud.spec.ts | Cobertura parcial | Ampliar assertions para respostas JSON relevantes | Média |
| A05 | Rate limit | users-crud.spec.ts classifica HTTP 429 / texto Rate exceeded. | Diagnóstico presente, limite não comprovado | Não gerar carga na API pública; criar testes determinísticos locais com mock | Média |
| A06 | Risco e rastreabilidade | docs/traceability-matrix.md e docs/risk-matrix.md | Documentação presente | Relacionar novas verificações aos IDs e evidências | Média |
| A07 | Resiliência/timeout | playwright.config.ts define timeout 30000 e retries 0 | Política básica presente | Testar parsing de respostas inesperadas e classificação sem mascarar falhas | Média |
| A08 | CI/CD | .github/workflows/api-tests.yml | Quality Gate presente | Validar cada PR e conferir artefatos; não fazer merge sem revisão | Alta |

## Implementação no PR #18 (estado em 2026-11-04)

- Classificador determinístico HTTP implementado em `src/utils/api-failure.ts`, com sete cenários em `src/tests/users/api-failure.spec.ts` marcados `@regression`.
- Verificações de status e Content-Type antes de interpretar JSON adicionadas em `users-contract.spec.ts` e na listagem de `users-crud.spec.ts`.
- `API_BASE_URL` configurável em `src/client/apiClient.ts` e `playwright.config.ts`, com padrão `https://serverest.dev`.
- Matriz de rastreabilidade atualizada com R16 e R17.
- Pendente: cenário automatizado de isolamento entre usuários A/B em instância local, revisão da exposição de `password` e evidência de execução específica do cenário A/B.
- Os checks anteriores ao último commit não comprovam a aprovação dos commits futuros; conferir GitHub Actions no head antes do merge.
- Este documento não comprova uma auditoria OWASP integral nem análise de posts específicos de Lilian Borba.

## Critérios de aceite
1. Testes novos devem comprovar comportamento especificado, sem pressupor que a ServeRest implementa ownership/BOLA.
2. Não fazer testes de carga ou rate-limit agressivos contra serverest.dev.
3. Não expor tokens, senhas, payloads sensíveis ou dados pessoais em logs e artefatos.
4. `npm run typecheck`, `npm run test:smoke`, `npm run test:regression` e Quality Gate devem passar antes do merge.
5. Cada alteração terá cenário, risco, resultado esperado e evidência rastreáveis.
6. Manter PR em Draft até concluir revisão. Nenhum merge automático.

## Publicações de Lilian Borba
Pendente de coleta de URLs/textos exatos. Não atribuir estes critérios à autora sem fonte verificável. Registrar para cada publicação: URL, afirmação verificável, evidência no repositório, lacuna e decisão.
