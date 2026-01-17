type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const globalStore = global as unknown as {
  _rateLimitStore?: Map<string, RateLimitRecord>;
};
const store = globalStore._rateLimitStore || new Map<string, RateLimitRecord>();
if (!globalStore._rateLimitStore) globalStore._rateLimitStore = store;

setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) {
        store.delete(key);
      }
    }
  },
  10 * 60 * 1000,
);

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > record.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
