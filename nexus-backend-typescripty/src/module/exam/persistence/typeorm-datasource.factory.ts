import { ConfigService } from '@sharedModule/config/service/config.service';
import { join } from 'path';
import { PostgresDataSourceOptions } from 'typeorm/driver/postgres/PostgresDataSourceOptions';

export const examDataSourceOptionsFactory = (
  configService: ConfigService,
): PostgresDataSourceOptions => ({
  type: 'postgres',
  host: configService.get('examDatabase.host'),
  port: configService.get('examDatabase.port'),
  username: configService.get('examDatabase.username'),
  password: configService.get('examDatabase.password'),
  database: configService.get('examDatabase.database'),
  schema: configService.get('examDatabase.schema'),
  synchronize: false,
  migrationsRun: false,
  migrations: [],
  ...(process.env.NODE_ENV !== 'test'
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
  entities: [join(__dirname, 'entity', '*.entity.{ts,js}')],
  logging: false,
});
