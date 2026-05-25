import { UserUnauthorizedException } from '@identityModule/core/exception/user-unauthorized.exception';
import { AuthService } from '@identityModule/core/service/authentication.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@sharedModule/auth/guard/auth.guard';
import { signInThrottle } from '@sharedModule/throttler/util/throttle-limits.util';
import { ClsService } from 'nestjs-cls';
import { SignInRequestDto } from '../dto/request/sign-in-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService,
  ) {}

  @Post('sign-in')
  @Throttle(signInThrottle)
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInRequestDto) {
    try {
      return await this.authService.signIn(signInDto.email, signInDto.password);
    } catch (error: unknown) {
      if (error instanceof UserUnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile() {
    try {
      return await this.authService.getProfile(this.clsService.get('userId'));
    } catch (error: unknown) {
      if (error instanceof UserUnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
