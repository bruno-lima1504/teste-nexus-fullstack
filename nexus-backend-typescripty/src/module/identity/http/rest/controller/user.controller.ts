import {
  Body,
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserManagementService } from '@identityModule/core/service/user-management.service';
import { CreateUserRequestDto } from '@identityModule/http/rest/dto/request/create-user-request-dto';
import { UserBadRequestException } from '@identityModule/core/exception/user-badrequest.exception';
import { registerThrottle } from '@sharedModule/throttler/util/throttle-limits.util';

@Controller('user')
export class UserController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('register')
  @Throttle(registerThrottle)
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerUserDto: CreateUserRequestDto) {
    try {
      return await this.userManagementService.create(registerUserDto);
    } catch (error: unknown) {
      if (error instanceof UserBadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
