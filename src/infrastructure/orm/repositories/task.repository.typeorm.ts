import { ITaskRepository } from '../../../application/ports/task-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskOrm } from '../entities/task.orm-entity';
import { Task } from '../../../domain/entities/task';

export class TaskRepositoryTypeOrm implements ITaskRepository {
  constructor(@InjectRepository(TaskOrm) private repo: Repository<TaskOrm>) {}

  private toDomain(o: TaskOrm): Task {
    return new Task(
      o.id,
      o.title,
      o.description ?? null,
      o.createdAt,
      o.dueDate ?? null,
      o.status as any,
      o.user.id,
    );
  }

  async create(task: Partial<Task>): Promise<Task> {
    const saved = await this.repo.save({
      id: task.id,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt,
      dueDate: task.dueDate,
      status: task.status,
      user: { id: task.ownerId },
    } as any);
    return this.toDomain(saved);
  }

  async findByOwner(ownerId: string): Promise<Task[]> {
    const res = await this.repo.find({
      where: { user: { id: ownerId } },
      relations: ['user'],
    });
    return res.map(this.toDomain);
  }

  async findById(ownerId: string, id: string): Promise<Task | null> {
    const found = await this.repo.findOne({
      where: { id, user: { id: ownerId } },
      relations: ['user'],
    });
    if (!found) return null;
    return this.toDomain(found);
  }

  async update(task: Task): Promise<Task> {
    await this.repo.update({ id: task.id }, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
    } as any);
    const updated = await this.repo.findOne({
      where: { id: task.id },
      relations: ['user'],
    });
    return this.toDomain(updated!);
  }

  async remove(task: Task): Promise<void> {
    await this.repo.delete({ id: task.id });
  }
}
