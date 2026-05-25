import { ExamModule } from '@examModule/exam.module';
import { IdentityModule } from '@identityModule/identity.module';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@sharedModule/throttler/throttler.module';

@Module({
  imports: [ThrottlerModule, IdentityModule, ExamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
