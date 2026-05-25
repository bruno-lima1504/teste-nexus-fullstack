import { BaseGeralRepository } from '@examModule/persistence/repository/base-geral.repository';
import { examDataSourceOptionsFactory } from '@examModule/persistence/typeorm-datasource.factory';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@sharedModule/config/config.module';
import { ConfigService } from '@sharedModule/config/service/config.service';
import { TypeOrmPersistenceModule } from '@sharedModule/persistence/typeorm/typeorm-persistence.module';

@Module({
  imports: [
    TypeOrmPersistenceModule.forRoot({
      name: 'exam',
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...examDataSourceOptionsFactory(configService),
          name: 'exam',
        };
      },
    }),
  ],
  providers: [BaseGeralRepository],
  exports: [BaseGeralRepository],
})
export class ExamPersistenceModule {}
