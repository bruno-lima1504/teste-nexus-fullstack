import { z } from 'zod';

export const environmentSchema = z.enum(['test', 'development', 'production']);

export const databaseSchema = z.object({
  host: z.string(),
  database: z.string(),
  password: z.string(),
  port: z.coerce.number(),
  url: z.string().startsWith('postgresql://'),
  username: z.string(),
  schema: z.string().default('public'),
});

export const movieDbSchema = z.object({
  apiToken: z.string(),
  url: z.string(),
});

export const billingApiSchema = z.object({
  url: z.string(),
});

export const jwtSchema = z.object({
  secret: z.string(),
});

export const throttlerSchema = z.object({
  ttl: z.coerce.number().default(60_000),
  limit: z.coerce.number().default(100),
  signInLimit: z.coerce.number().default(5),
  registerLimit: z.coerce.number().default(3),
});

export const examDatabaseSchema = z.object({
  host: z.string(),
  database: z.string(),
  password: z.string(),
  port: z.coerce.number().default(5432),
  username: z.string(),
  schema: z.string().default('central_teste'),
});

export const configSchema = z.object({
  env: environmentSchema,
  port: z.coerce.number().positive().int(),
  database: databaseSchema,
  examDatabase: examDatabaseSchema,
  jwt: jwtSchema,
  throttler: throttlerSchema,
});
