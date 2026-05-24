import { BaseGeralService } from '@examModule/core/service/base-geral.service';
import { BaseGeralFilterMapper } from '@examModule/core/util/base-geral-filter.mapper';
import { BaseGeralController } from '@examModule/http/rest/controller/base-geral.controller';
import { ExamPersistenceModule } from '@examModule/persistence/exam-persistence.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '@sharedModule/auth/auth.module';

@Module({
  imports: [ExamPersistenceModule, AuthModule],
  controllers: [BaseGeralController],
  providers: [BaseGeralService, BaseGeralFilterMapper],
})
export class ExamModule {}
