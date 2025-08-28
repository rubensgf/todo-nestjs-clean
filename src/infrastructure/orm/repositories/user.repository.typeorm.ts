import { IUserRepository } from '../../../application/ports/user-repository.port';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrm } from '../entities/user.orm-entity';
import { User } from '../../../domain/entities/user';

export class UserRepositoryTypeOrm implements IUserRepository {
  constructor(@InjectRepository(UserOrm) private repo: Repository<UserOrm>) {}

  async create(email: string, passwordHash: string): Promise<User> {
    const u = this.repo.create({ email, passwordHash });
    const saved = await this.repo.save(u);
    return new User(saved.id, saved.email, saved.passwordHash);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email } });
    if (!found) return null;
    return new User(found.id, found.email, found.passwordHash);
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    return new User(found.id, found.email, found.passwordHash);
  }
}
