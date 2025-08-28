import { RegisterUseCase } from '../register.usecase';
import { IUserRepository } from '../../../ports/user-repository.port';
import { AppLogger } from '../../../../infrastructure/logger/app-logger';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepo: IUserRepository;
  let logger: AppLogger;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as IUserRepository;

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as AppLogger;

    useCase = new RegisterUseCase(userRepo, logger);
  });

  it('should create a new user', async () => {
    (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);
    (userRepo.create as jest.Mock).mockImplementation(async (email, hash) => ({
      id: 'user1',
      email,
      passwordHash: hash,
    }));

    const result = await useCase.execute('test@example.com', '123456');

    expect(result).toEqual({ id: 'user1', email: 'test@example.com' });
    expect(userRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(userRepo.create).toHaveBeenCalled();
  });

  it('should throw an error if email already exists', async () => {
    (userRepo.findByEmail as jest.Mock).mockResolvedValue({
      id: 'user1',
      email: 'test@example.com',
    });

    await expect(useCase.execute('test@example.com', '123456')).rejects.toThrow(
      'Email já cadastrado',
    );
  });
});
