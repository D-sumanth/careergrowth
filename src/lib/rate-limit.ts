const store = new Map<string, { count: number; expiresAt: number }>();

export function assertRateLimit(key: string, maxRequests = 8, windowMs = 60_000) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.expiresAt < now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return;
  }

  if (current.count >= maxRequests) {
    throw new Error("Too many requests. Please wait a moment and try again.");
  }

  current.count += 1;
  store.set(key, current);
}
