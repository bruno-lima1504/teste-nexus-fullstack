import { UserManagementService } from '@identityModule/core/service/user-management.service';
import { IdentityModule } from '@identityModule/identity.module';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Tables } from '@testInfra/enum/table.enum';
import { testDbClient } from '@testInfra/knex.database';
import { createNestApp } from '../../../../../../test/jest-e2e.setup';

import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userManagementService: UserManagementService;
  let module: TestingModule;

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([IdentityModule]);
    app = nestTestSetup.app;
    module = nestTestSetup.module;

    userManagementService = module.get<UserManagementService>(
      UserManagementService,
    );
  });

  beforeEach(async () => {
    await testDbClient(Tables.User).del();
  });

  afterAll(async () => {
    await testDbClient(Tables.User).del();
    await app.close();
    await module.close();
    await testDbClient.destroy();
  });

  describe('signIn', () => {
    it('returns accessToken for valid credentials', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      await userManagementService.create({
        firstName: 'John',
        lastName: 'Doe',
        email: signInInput.email,
        password: signInInput.password,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInInput)
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
    });

    it('returns unauthorized if the user does not exist', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInInput)
        .expect(401);

      expect(response.body.message).toEqual(
        'Cannot authorize user: johndoe@example.com',
      );
    });
  });

  describe('getProfile', () => {
    // Used in examples about module to module calls, its skiped because the default is to use local calls
    it('returns the authenticated user - USING HTTP for module to module calls', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      await userManagementService.create({
        firstName: 'John',
        lastName: 'Doe',
        email: signInInput.email,
        password: signInInput.password,
      });

      const accessTokenResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInInput)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessTokenResponse.body.accessToken}`)
        .expect(200);

      expect(response.body.email).toEqual(signInInput.email);
    });

    it('returns unauthorized for invalid tokens', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer fake-token')
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });
  });
});
