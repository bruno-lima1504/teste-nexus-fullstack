import { UserUnauthorizedException } from '@identityModule/core/exception/user-unauthorized.exception';
import { UserRepository } from '@identityModule/persistence/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getProfile(userId: string): Promise<{ email: string }> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new UserUnauthorizedException('Unauthorized');
    }

    return { email: user.email };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UserUnauthorizedException(`Cannot authorize user: ${email}`);
    }

    //TODO add more fields to the JWT
    const payload = { sub: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        // Using HS256 algorithm to prenvent from security risk
        // https://book.hacktricks.xyz/pentesting-web/hacking-jwt-json-web-tokens#modify-the-algorithm-to-none-cve-2015-9235
        algorithm: 'HS256',
      }),
    };
  }
  private async comparePassword(
    password: string,
    actualPassword: string,
  ): Promise<boolean> {
    return compare(password, actualPassword);
  }
}
