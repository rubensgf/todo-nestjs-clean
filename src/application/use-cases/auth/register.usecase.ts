import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../ports/user-repository.port';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AppLogger } from 'src/infrastructure/logger/app-logger';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    private readonly logger: AppLogger,
  ) {}

  async execute(email: string, password: string) {
    try {
      const exists = await this.userRepo.findByEmail(email);
      if (exists) {
        this.logger.warn(`Attempt to register with existing email: ${email}`);
        throw new Error('Email já cadastrado');
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const id = uuidv4();
      const user = await this.userRepo.create(email, hash);

      this.logger.log(
        `User ${user.id} registered successfully with email ${email}`,
      );

      return { id: user.id, email: user.email };
    } catch (error) {
      this.logger.error(
        `Failed to register user with email ${email}`,
        error.stack,
      );
      throw error;
    }
  }
}
