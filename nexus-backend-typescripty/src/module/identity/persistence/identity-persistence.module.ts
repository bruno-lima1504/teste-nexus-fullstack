import { UserRepository } from '@identityModule/persistence/repository/user.repository';
import { dataSourceOptionsFactory } from '@identityModule/persistence/typeorm-datasource.factory';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@sharedModule/config/config.module';
import { ConfigService } from '@sharedModule/config/service/config.service';
import { TypeOrmPersistenceModule } from '@sharedModule/persistence/typeorm/typeorm-persistence.module';

@Module({
  imports: [
    TypeOrmPersistenceModule.forRoot({
      name: 'identity',
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...dataSourceOptionsFactory(configService),
          name: 'identity',
        };
      },
    }),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class IdentityPersistenceModule {}
