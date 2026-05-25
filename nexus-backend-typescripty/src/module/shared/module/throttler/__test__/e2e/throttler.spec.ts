import { IdentityModule } from '@identityModule/identity.module';
import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ThrottlerGuard,
  ThrottlerModule as NestThrottlerModule,
} from '@nestjs/throttler';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@sharedModule/config/config.module';
import { ConfigService } from '@sharedModule/config/service/config.service';
import { Tables } from '@testInfra/enum/table.enum';
import { testDbClient } from '@testInfra/knex.database';
import request from 'supertest';

describe('Throttler (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        NestThrottlerModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => [
            {
              name: 'default',
              ttl: configService.get('throttler.ttl'),
              limit: configService.get('throttler.limit'),
            },
          ],
        }),
        IdentityModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
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

  it('returns 429 when register rate limit is exceeded', async () => {
    for (let index = 0; index < 3; index++) {
      await request(app.getHttpServer())
        .post('/user/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: `user${index}@example.com`,
          password: 'password123',
        })
        .expect(201);
    }

    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'user4@example.com',
        password: 'password123',
      })
      .expect(429);

    expect(response.body.message).toEqual(
      'ThrottlerException: Too Many Requests',
    );
  });
});
