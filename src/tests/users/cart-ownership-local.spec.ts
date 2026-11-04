import { test, expect, request, APIRequestContext } from '@playwright/test';
import { createValidUser } from '../../data/user.data';

/**
 * Controlled ServeRest ownership regression.
 * Explicit opt-in and loopback-only to avoid mutating the shared public instance.
 */
test('cart checkout must not affect another authenticated user', { tag: ['@security', '@local-only'] }, async () => {
  test.skip(process.env.RUN_OWNERSHIP_TEST !== 'true', 'Local ownership regression is opt-in.');

  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) throw new Error('Set API_BASE_URL to a local ServeRest instance.');
  const url = new URL(baseURL);
  if (!['localhost', '127.0.0.1', '::1'].includes(url.hostname)) {
    throw new Error('Ownership regression must run against loopback ServeRest only.');
  }

  const api = await request.newContext({ baseURL });
  const authContexts: APIRequestContext[] = [];
  const userIds: string[] = [];
  let productId: string | undefined;
  let cartId: string | undefined;

  async function createUser(administrador: 'true' | 'false') {
    const data = { ...createValidUser(), administrador };
    const response = await api.post('/usuarios', { data });
    expect(response.status()).toBe(201);
    const body = await response.json() as { _id: string };
    userIds.push(body._id);
    const login = await api.post('/login', { data: { email: data.email, password: data.password } });
    expect(login.status()).toBe(200);
    const token = (await login.json() as { authorization: string }).authorization;
    const ctx = await request.newContext({ baseURL, extraHTTPHeaders: { Authorization: token } });
    authContexts.push(ctx);
    return { id: body._id, ctx };
  }

  try {
    const admin = await createUser('true');
    const userA = await createUser('false');
    const userB = await createUser('false');

    const product = await admin.ctx.post('/produtos', {
      data: { nome: `ownership-${Date.now()}-${Math.random().toString(36).slice(2)}`, preco: 10, descricao: 'Controlled ownership regression', quantidade: 5 },
    });
    expect(product.status()).toBe(201);
    productId = (await product.json() as { _id: string })._id;

    const cart = await userA.ctx.post('/carrinhos', { data: { produtos: [{ idProduto: productId, quantidade: 1 }] } });
    expect(cart.status()).toBe(201);
    cartId = (await cart.json() as { _id: string })._id;

    const foreignCheckout = await userB.ctx.delete('/carrinhos/concluir-compra');
    expect(foreignCheckout.status()).toBe(200);
    expect((await foreignCheckout.json() as { message: string }).message)
      .toBe('Não foi encontrado carrinho para esse usuário');

    const stillOwned = await api.get(`/carrinhos/${cartId}`);
    expect(stillOwned.status()).toBe(200);
    const saved = await stillOwned.json() as { idUsuario: string; _id: string };
    expect(saved._id).toBe(cartId);
    expect(saved.idUsuario).toBe(userA.id);

    const ownCheckout = await userA.ctx.delete('/carrinhos/concluir-compra');
    expect(ownCheckout.status()).toBe(200);
    const afterCheckout = await api.get(`/carrinhos/${cartId}`);
    expect(afterCheckout.status()).toBe(400);
    cartId = undefined;
  } finally {
    // Dependency-safe best-effort teardown, without hiding an earlier test failure.
    if (cartId && authContexts[1]) {
      await authContexts[1].delete('/carrinhos/cancelar-compra').catch(() => undefined);
    }
    if (productId && authContexts[0]) {
      await authContexts[0].delete(`/produtos/${productId}`).catch(() => undefined);
    }
    for (const id of userIds.reverse()) {
      await api.delete(`/usuarios/${id}`).catch(() => undefined);
    }
    for (const ctx of authContexts) await ctx.dispose();
    await api.dispose();
  }
});
