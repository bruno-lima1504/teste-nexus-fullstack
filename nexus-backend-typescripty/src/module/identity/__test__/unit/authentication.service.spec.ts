/* eslint-disable @typescript-eslint/unbound-method */
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserUnauthorizedException } from '@identityModule/core/exception/user-unauthorized.exception';
import { User } from '@identityModule/persistence/entity/user.entity';
import { AuthService } from '@identityModule/core/service/authentication.service';
import { UserRepository } from '@identityModule/persistence/repository/user.repository';
import bcrypt from 'bcrypt';

describe('AuthenticationService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('returns an access token with valid credentials', async () => {
      const user = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'testpassword',
      };
      const token = 'testtoken';
      const encryptedPassword = bcrypt.hashSync(user.password, 10);
      userRepository.findOneByEmail = jest
        .fn()
        .mockResolvedValue(new User({ ...user, password: encryptedPassword }));
      jwtService.signAsync = jest.fn().mockResolvedValue(token);

      const result = await authService.signIn(user.email, 'testpassword');

      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(user.email);
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: token });
    });

    it('throws an UnauthorizedException with invalid credentials', async () => {
      const user = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'testpassword',
      };
      userRepository.findOneByEmail = jest
        .fn()
        .mockResolvedValue(new User(user));

      await expect(
        authService.signIn(user.email, 'invalidpassword'),
      ).rejects.toThrow(UserUnauthorizedException);
    });
  });
});
