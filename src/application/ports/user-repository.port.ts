import { User } from '../../domain/entities/user';

export interface IUserRepository {
  create(email: string, passwordHash: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
