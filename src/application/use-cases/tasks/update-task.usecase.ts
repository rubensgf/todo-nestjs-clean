import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Task } from '../../../domain/entities/task';
import { ITaskRepository } from '../../ports/task-repository.port';
import { AppLogger } from 'src/infrastructure/logger/app-logger';
import { TaskStatusEnum } from '../../../domain/entities/task';

interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
  status?: TaskStatusEnum;
  ownerId: string;
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepo: ITaskRepository,
    private readonly logger: AppLogger,
  ) {}

  async execute(dto: UpdateTaskDTO): Promise<Task | null> {
    try {
      const task = await this.taskRepo.findById(dto.ownerId, dto.id);

      if (!task) {
        this.logger.warn(
          `Task not found or user ${dto.ownerId} cannot update task ${dto.id}`,
        );
        return null;
      }

      if (dto.title !== undefined) task.title = dto.title;
      if (dto.description !== undefined) task.description = dto.description;
      if (dto.dueDate !== undefined) task.dueDate = dto.dueDate;
      if (dto.status !== undefined) {
        task.status = dto.status; // ✅ já é do tipo TaskStatusEnum
      }

      const updatedTask = await this.taskRepo.update(task);

      this.logger.log(`Task ${task.id} updated by user ${dto.ownerId}`);

      return updatedTask;
    } catch (error) {
      this.logger.error(
        `Failed to update task ${dto.id} for user ${dto.ownerId}`,
        error.stack,
      );
      throw error;
    }
  }
}
