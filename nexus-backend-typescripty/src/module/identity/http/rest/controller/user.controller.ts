import {
  Body,
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserManagementService } from '@identityModule/core/service/user-management.service';
import { CreateUserRequestDto } from '@identityModule/http/rest/dto/request/create-user-request-dto';
import { UserBadRequestException } from '@identityModule/core/exception/user-badrequest.exception';

@Controller('user')
export class UserController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('register')
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
