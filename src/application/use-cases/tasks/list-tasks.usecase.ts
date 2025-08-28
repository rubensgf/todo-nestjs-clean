import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../../../domain/entities/task';
import { ITaskRepository } from '../../ports/task-repository.port';
import { AppLogger } from 'src/infrastructure/logger/app-logger';

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepo: ITaskRepository,
    private readonly logger: AppLogger,
  ) {}

  async execute(ownerId: string): Promise<Task[]> {
    try {
      const tasks = await this.taskRepo.findByOwner(ownerId);

      this.logger.log(`Listed ${tasks.length} tasks for user ${ownerId}`);

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to list tasks for user ${ownerId}`,
        error.stack,
      );
      throw error;
    }
  }
}
