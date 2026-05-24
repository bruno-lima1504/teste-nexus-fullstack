import { INestApplication } from '@nestjs/common';
import { IdentityModule } from '@identityModule/identity.module';
import { testDbClient } from '@testInfra/knex.database';
import { createNestApp } from '../../../../../../test/jest-e2e.setup';
import request from 'supertest';
import { Tables } from '@testInfra/enum/table.enum';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([IdentityModule]);
    app = nestTestSetup.app;
  });

  beforeEach(async () => {
    await testDbClient(Tables.User).del();
  });

  afterAll(async () => {
    await testDbClient(Tables.User).del();
    await app.close();
    await testDbClient.destroy();
  });

  describe('Identity - createUser', () => {
    it('creates a new user', async () => {
      const createUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(createUserInput);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(createUserInput.email);
      expect(response.body.firstName).toBe(createUserInput.firstName);
      expect(response.body.lastName).toBe(createUserInput.lastName);
      expect(response.body.password).toBeUndefined();
    });

    it('throws error for invalid email validation', async () => {
      const createUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalidemail',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(createUserInput)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining(['email must be an email']),
      );
    });
  });
});
