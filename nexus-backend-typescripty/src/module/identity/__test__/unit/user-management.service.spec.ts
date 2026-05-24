import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementService } from '@identityModule/core/service/user-management.service';
import { UserRepository } from '@identityModule/persistence/repository/user.repository';

describe('UserManagementService', () => {
  let service: UserManagementService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserManagementService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserManagementService>(UserManagementService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    it('creates a new user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest
        .spyOn(userRepository, 'save')
        .mockImplementation(async (user) => user);

      const createdUser = await service.create(user);
      const { email, firstName, lastName } = createdUser;

      expect(email).toEqual(user.email);
      expect(firstName).toEqual(user.firstName);
      expect(lastName).toEqual(user.lastName);
    });
  });
});
