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

## Confirmed ServeRest ownership semantics (source inspection)

- Official `src/swagger/translations/pt-BR.js` specifies that `POST /carrinhos` associates the cart with the authenticated user, and `DELETE /carrinhos/concluir-compra` and `/cancelar-compra` act on the cart associated with the supplied token.
- Official `src/services/carrinhos-service.js` resolves the authenticated user's ID from the token and selects carts by `idUsuario`.
- Official `test/integration/carrinhos/concluirCompra.test.js` expects HTTP 200 with `Não foi encontrado carrinho para esse usuário` when the authenticated user has no cart.

### Proposed controlled cross-user regression

1. Start a local ServeRest instance and create users A and B with independent JWTs.
2. Create an administrator-owned product and a cart for A; capture cart ID.
3. Using B's JWT, call `DELETE /carrinhos/concluir-compra`; assert HTTP 200 and exact no-cart message.
4. Fetch A's cart by ID and assert that it still exists and belongs to A.
5. Using A's JWT, complete A's cart and assert it is removed.
6. Clean up users/product in dependency-safe order, including on failure.

**Important:** This validates token-to-cart isolation for the checkout operation, not a generic guarantee that every GET resource is private. `GET /carrinhos` and `GET /carrinhos/{id}` may be publicly readable by design. Do not assert 403/404 for those endpoints without a documented rule.

**Status:** Source/contract verified; proposed regression not yet implemented or executed. Shared public instance is unsuitable for deterministic destructive cross-user testing.

Source files: https://github.com/ServeRest/ServeRest/blob/trunk/src/swagger/translations/pt-BR.js ; https://github.com/ServeRest/ServeRest/blob/trunk/src/services/carrinhos-service.js ; https://github.com/ServeRest/ServeRest/blob/trunk/test/integration/carrinhos/concluirCompra.test.js
