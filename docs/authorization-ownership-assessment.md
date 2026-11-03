# Authorization and ownership — assessment

## Status

**Coverage: Partial / Not yet verified for BOLA-IDOR.** This is a test-coverage gap, not a confirmed vulnerability.

## Existing evidence (static review)

- `src/tests/users/jwt-auth.spec.ts` covers valid JWT, absent JWT, malformed JWT and invalid JWT against `DELETE /carrinhos/concluir-compra`.
- `src/requests/users.request.ts` provides CRUD helpers, but does not establish a per-user ownership policy.
- `src/client/apiClient.ts` currently targets the shared public ServeRest instance.
- `docs/traceability-matrix.md` correctly classifies the general authorization risk as partial.

## Prerequisites before writing a BOLA assertion

1. Identify a resource with an explicit ownership/role rule in the ServeRest contract or implementation.
2. Establish two independent users (A and B), authenticate separately, and create a resource owned by A.
3. Confirm the expected behavior for B from documented authorization rules (not from a guessed status code).
4. Run tests against a controlled local ServeRest instance; do not perform destructive cross-account probes against the shared public instance.
5. Verify both HTTP response and unchanged resource state, with deterministic teardown.
6. Add risk-to-test mapping and execution evidence only after the scenario is implemented and validated.

## Decision

Do not add a BOLA/IDOR test with an assumed 403/404 expectation until ownership semantics are confirmed. If the educational API has no such rule, mark the risk **not applicable to this SUT** and demonstrate ownership enforcement in a separate controlled application with an explicit contract. Do not label expected behavior as a security defect.

## Validation

Documentation-only change. No automated tests executed. No merge requested.
