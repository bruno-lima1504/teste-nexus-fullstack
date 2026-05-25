import { ConfigException } from '@sharedModule/config/exception/config.exception';
import { configSchema } from '@sharedModule/config/util/config.schema';
import { Config } from '@sharedModule/config/util/config.type';

export const factory = (): Config => {
  const result = configSchema.safeParse({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      url: process.env.DATABASE_URL,
      username: process.env.DATABASE_USERNAME,
      schema: process.env.DATABASE_SCHEMA ?? 'public',
    },
    examDatabase: {
      host: process.env.EXAM_DATABASE_HOST,
      database: process.env.EXAM_DATABASE_NAME,
      password: process.env.EXAM_DATABASE_PASSWORD,
      port: process.env.EXAM_DATABASE_PORT,
      username: process.env.EXAM_DATABASE_USERNAME,
      schema: process.env.EXAM_DATABASE_SCHEMA ?? 'central_teste',
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    throttler: {
      ttl: process.env.THROTTLER_TTL,
      limit: process.env.THROTTLER_LIMIT,
      signInLimit: process.env.THROTTLER_SIGN_IN_LIMIT,
      registerLimit: process.env.THROTTLER_REGISTER_LIMIT,
    },
  });

  if (result.success) {
    return result.data;
  }

  throw new ConfigException(
    `Invalid application configuration: ${result.error.message}`,
  );
};
