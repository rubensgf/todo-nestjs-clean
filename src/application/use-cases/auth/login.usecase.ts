import { Inject, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../ports/user-repository.port';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from 'src/infrastructure/logger/app-logger';

export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private userRepo: IUserRepository,
    private jwtService: JwtService,
    private readonly logger: AppLogger,
  ) {}

  async execute(email: string, password: string) {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        this.logger.warn(`Failed login attempt with unknown email: ${email}`);
        throw new Error('Credenciais inválidas');
      }

      const matched = await bcrypt.compare(password, user.passwordHash);
      if (!matched) {
        throw new Error('Credenciais inválidas');
      }

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      this.logger.log(`User ${user.id} logged in successfully`);

      return { accessToken: token };
    } catch (error) {
      this.logger.error(`Login error for email ${email}`, error.stack);
      throw error;
    }
  }
}
