import { AuthService } from '@identityModule/core/service/authentication.service';
import { UserManagementService } from '@identityModule/core/service/user-management.service';
import { AuthController } from '@identityModule/http/rest/controller/auth.controller';
import { UserController } from '@identityModule/http/rest/controller/user.controller';
import { IdentityPersistenceModule } from '@identityModule/persistence/identity-persistence.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '@sharedModule/auth/auth.module';

@Module({
  imports: [IdentityPersistenceModule, AuthModule],
  controllers: [UserController, AuthController],
  providers: [AuthService, UserManagementService],
})
export class IdentityModule {}
