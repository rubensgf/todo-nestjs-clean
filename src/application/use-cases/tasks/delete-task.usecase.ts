import { Injectable, Inject } from '@nestjs/common';
import { ITaskRepository } from '../../ports/task-repository.port';
import { AppLogger } from 'src/infrastructure/logger/app-logger';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepo: ITaskRepository,
    private readonly logger: AppLogger,
  ) {}

  async execute(ownerId: string, id: string): Promise<void> {
    try {
      const task = await this.taskRepo.findById(ownerId, id);

      if (!task) {
        this.logger.warn(
          `Task not found or user ${ownerId} cannot delete task ${id}`,
        );
        return;
      }

      await this.taskRepo.remove(task);

      this.logger.log(`Task ${id} deleted by user ${ownerId}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete task ${id} for user ${ownerId}`,
        error.stack,
      );
      throw error;
    }
  }
}
