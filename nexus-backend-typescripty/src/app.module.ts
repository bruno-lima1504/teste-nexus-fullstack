import { ExamModule } from '@examModule/exam.module';
import { IdentityModule } from '@identityModule/identity.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [IdentityModule, ExamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
