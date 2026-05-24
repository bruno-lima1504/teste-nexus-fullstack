import knex from 'knex';

const databaseUrl = `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

export const testDbClient = knex({
  client: 'pg',
  connection: databaseUrl,
  searchPath: ['public'],
});
