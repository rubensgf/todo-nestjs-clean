import { Injectable, Inject } from '@nestjs/common';
import { Task, TaskStatusEnum } from '../../../domain/entities/task';
import { ITaskRepository } from '../../ports/task-repository.port';
import { v4 as uuid } from 'uuid';
import { AppLogger } from 'src/infrastructure/logger/app-logger';

interface CreateTaskDTO {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  ownerId: string;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepo: ITaskRepository,
    private readonly logger: AppLogger,
  ) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    try {
      const task = new Task(
        uuid(),
        dto.title,
        dto.description ?? null,
        new Date(),
        dto.dueDate ?? null,
        TaskStatusEnum.PENDING,
        dto.ownerId,
      );

      const createdTask = await this.taskRepo.create(task);

      this.logger.log(`Task ${createdTask.id} created by user ${dto.ownerId}`);

      return createdTask;
    } catch (error) {
      this.logger.error(
        `Failed to create task for user ${dto.ownerId}`,
        error.stack,
      );
      throw error;
    }
  }
}
