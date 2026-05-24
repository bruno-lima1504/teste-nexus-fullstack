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

export const configSchema = z.object({
  env: environmentSchema,
  port: z.coerce.number().positive().int(),
  database: databaseSchema,
  jwt: jwtSchema,
});
