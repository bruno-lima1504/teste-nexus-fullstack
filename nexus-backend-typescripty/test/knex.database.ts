import knex from 'knex';

const databaseUrl = `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

export const testDbClient = knex({
  client: 'pg',
  connection: databaseUrl,
  searchPath: ['public'],
});

const examDatabaseUrl = `postgres://${process.env.EXAM_DATABASE_USERNAME}:${process.env.EXAM_DATABASE_PASSWORD}@${process.env.EXAM_DATABASE_HOST}:${process.env.EXAM_DATABASE_PORT}/${process.env.EXAM_DATABASE_NAME}`;

export const testExamDbClient = knex({
  client: 'pg',
  connection: examDatabaseUrl,
  searchPath: [process.env.EXAM_DATABASE_SCHEMA ?? 'central_teste'],
});
