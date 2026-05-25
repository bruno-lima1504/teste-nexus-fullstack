import { User } from '@identityModule/persistence/entity/user.entity';
import { UserRepository } from '@identityModule/persistence/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserBadRequestException } from '@identityModule/core/exception/user-badrequest.exception';
import { AppLogger } from '@sharedModule/logger/service/app-logger.service';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

//TODO move to a configuration
export const PASSWORD_HASH_SALT = 10;

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: AppLogger,
  ) {}
  async create(user: CreateUserDto) {
    const newUser = new User({
      ...user,
      password: await hash(user.password, PASSWORD_HASH_SALT),
    });

    const createdUser = await this.userRepository.save(newUser);

    if (!createdUser) {
      throw new UserBadRequestException('Failed to create user');
    }

    this.logger.log(`User ${createdUser.email} created`, {
      createdUser,
    });

    return newUser;
  }

  async getUserById(id: string) {
    return this.userRepository.findOneById(id);
  }
}
