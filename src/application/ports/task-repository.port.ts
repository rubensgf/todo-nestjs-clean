import { Task } from '../../domain/entities/task';

export interface ITaskRepository {
  create(task: Partial<Task>): Promise<Task>;
  findByOwner(ownerId: string): Promise<Task[]>;
  findById(ownerId: string, id: string): Promise<Task | null>;
  update(task: Task): Promise<Task>;
  remove(task: Task): Promise<void>;
}
