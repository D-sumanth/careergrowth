const store = new Map<string, { count: number; expiresAt: number }>();

export class RateLimitError extends Error {
  constructor() {
    super("Too many requests. Please wait a moment and try again.");
  }
}

export function assertRateLimit(key: string, maxRequests = 8, windowMs = 60_000) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.expiresAt < now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return;
  }

  if (current.count >= maxRequests) {
    throw new RateLimitError();
  }

  current.count += 1;
  store.set(key, current);
}
