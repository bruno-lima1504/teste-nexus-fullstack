const ttl = Number(process.env.THROTTLER_TTL ?? 60_000);

export const signInThrottle = {
  default: {
    limit: Number(process.env.THROTTLER_SIGN_IN_LIMIT ?? 5),
    ttl,
  },
};

export const registerThrottle = {
  default: {
    limit: Number(process.env.THROTTLER_REGISTER_LIMIT ?? 3),
    ttl,
  },
};
