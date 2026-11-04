/** Classify HTTP failures without recording response bodies or credentials. */
export function classifyApiFailure(status: number, contentType: string): string {
  if (status === 429) return 'rate-limited';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status >= 500) return 'server-error';
  if (status >= 400) return 'client-error';
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) return 'unexpected-content-type';
  return 'none';
}
