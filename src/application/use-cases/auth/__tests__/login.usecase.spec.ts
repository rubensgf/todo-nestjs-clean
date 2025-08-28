// src/application/use-cases/users/__tests__/login.usecase.spec.ts
import { LoginUseCase } from '../login.usecase';
import { IUserRepository } from '../../../ports/user-repository.port';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AppLogger } from '../../../../infrastructure/logger/app-logger';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepo: IUserRepository;
  let jwtService: JwtService;
  let logger: AppLogger;

  beforeEach(() => {
    userRepo = { findByEmail: jest.fn() } as unknown as IUserRepository;
    jwtService = { sign: jest.fn() } as unknown as JwtService;
    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as AppLogger;

    useCase = new LoginUseCase(userRepo, jwtService, logger);
  });

  it('should login successfully', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);
    (userRepo.findByEmail as jest.Mock).mockResolvedValue({
      id: 'user1',
      email: 'test@example.com',
      passwordHash,
    });
    (jwtService.sign as jest.Mock).mockReturnValue('fake-jwt-token');

    const result = await useCase.execute('test@example.com', '123456');

    expect(result).toEqual({ accessToken: 'fake-jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user1',
      email: 'test@example.com',
    });
  });

  it('should throw an error if user does not exist', async () => {
    (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('test@example.com', '123456')).rejects.toThrow(
      'Credenciais inválidas',
    );
  });

  it('should throw an error if password is incorrect', async () => {
    const passwordHash = await bcrypt.hash('wrongpassword', 10);
    (userRepo.findByEmail as jest.Mock).mockResolvedValue({
      id: 'user1',
      email: 'test@example.com',
      passwordHash,
    });

    await expect(useCase.execute('test@example.com', '123456')).rejects.toThrow(
      'Credenciais inválidas',
    );
  });
});
