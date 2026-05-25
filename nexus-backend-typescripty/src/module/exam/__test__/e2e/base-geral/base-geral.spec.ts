import { ExamModule } from '@examModule/exam.module';
import { UserManagementService } from '@identityModule/core/service/user-management.service';
import { IdentityModule } from '@identityModule/identity.module';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Tables } from '@testInfra/enum/table.enum';
import { bootstrapExamTestSchema } from '@testInfra/exam-database.bootstrap';
import { testDbClient, testExamDbClient } from '@testInfra/knex.database';
import request from 'supertest';
import { createNestApp } from '../../../../../../test/jest-e2e.setup';

const seedRecords = [
  {
    id: 1,
    ticket: '155430',
    nome_colaborador: 'TAIS',
    tipo_exame: 'Admissional',
    status: 'Finalizado no SOC/GED',
  },
  {
    id: 2,
    ticket: '155431',
    nome_colaborador: 'JOAO',
    tipo_exame: 'Periodico',
    status: 'Pendente',
  },
  {
    id: 3,
    ticket: '155432',
    nome_colaborador: 'MARIA',
    tipo_exame: 'Admissional',
    status: 'Finalizado no SOC/GED',
  },
];

async function getAccessToken(
  app: INestApplication,
  userManagementService: UserManagementService,
): Promise<string> {
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

  return response.body.accessToken;
}

async function seedBaseGeral() {
  await testExamDbClient(Tables.BaseGeral).insert(seedRecords);
}

describe('BaseGeralController (e2e)', () => {
  let app: INestApplication;
  let userManagementService: UserManagementService;
  let module: TestingModule;

  beforeAll(async () => {
    await bootstrapExamTestSchema(testExamDbClient);

    const nestTestSetup = await createNestApp([IdentityModule, ExamModule]);
    app = nestTestSetup.app;
    module = nestTestSetup.module;

    userManagementService = module.get<UserManagementService>(
      UserManagementService,
    );
  });

  beforeEach(async () => {
    await testDbClient(Tables.User).del();
    await testExamDbClient(Tables.BaseGeral).del();
  });

  afterAll(async () => {
    await testDbClient(Tables.User).del();
    await testExamDbClient(Tables.BaseGeral).del();
    if (app) {
      await app.close();
    }
    if (module) {
      await module.close();
    }
    await testDbClient.destroy();
    await testExamDbClient.destroy();
  });

  describe('authentication', () => {
    it('returns 401 without Authorization header', async () => {
      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('returns 401 with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .set('Authorization', 'Bearer fake-token')
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });
  });

  describe('GET /exam/base-geral', () => {
    it('returns 200 with empty list', async () => {
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.meta).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it('returns 200 with seeded data and correct PaginatedResult structure', async () => {
      await seedBaseGeral();
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.meta).toEqual({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
      });
      expect(response.body.data[0]).toMatchObject({
        id: 1,
        ticket: '155430',
        nomeColaborador: 'TAIS',
        tipoExame: 'Admissional',
        status: 'Finalizado no SOC/GED',
      });
    });

    it('filters by nomeColaborador', async () => {
      await seedBaseGeral();
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ nomeColaborador: 'TAIS' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nomeColaborador).toBe('TAIS');
      expect(response.body.meta.total).toBe(1);
    });

    it('filters by ticket', async () => {
      await seedBaseGeral();
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ ticket: '155431' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].ticket).toBe('155431');
      expect(response.body.meta.total).toBe(1);
    });

    it('filters by tipoExame', async () => {
      await seedBaseGeral();
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ tipoExame: 'Periodico' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].tipoExame).toBe('Periodico');
      expect(response.body.meta.total).toBe(1);
    });

    it('filters by status', async () => {
      await seedBaseGeral();
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ status: 'Pendente' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('Pendente');
      expect(response.body.meta.total).toBe(1);
    });

    it('returns second page with page=2 and limit=1', async () => {
      await seedBaseGeral();
      const token = await getAccessToken(app, userManagementService);

      const page1 = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ page: 1, limit: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const page2 = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ page: 2, limit: 1 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(page2.body.data).toHaveLength(1);
      expect(page2.body.meta).toEqual({
        page: 2,
        limit: 1,
        total: 3,
        totalPages: 3,
      });
      expect(page2.body.data[0].id).not.toBe(page1.body.data[0].id);
    });

    it('reflects custom limit in meta.limit', async () => {
      await seedBaseGeral();
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ limit: 2 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.limit).toBe(2);
      expect(response.body.meta.totalPages).toBe(2);
    });

    it('returns 400 for page=0', async () => {
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ page: 0 })
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.message).toContain('page must not be less than 1');
    });

    it('returns 400 for limit=101', async () => {
      const token = await getAccessToken(app, userManagementService);

      const response = await request(app.getHttpServer())
        .get('/exam/base-geral')
        .query({ limit: 101 })
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.message).toContain(
        'limit must not be greater than 100',
      );
    });
  });
});
