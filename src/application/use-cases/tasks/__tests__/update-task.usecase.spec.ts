// src/application/use-cases/tasks/__tests__/update-task.usecase.spec.ts
import { UpdateTaskUseCase } from '../update-task.usecase';
import { ITaskRepository } from '../../../ports/task-repository.port';
import { AppLogger } from '../../../../infrastructure/logger/app-logger';
import { TaskStatusEnum } from '../../../../domain/entities/task';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let repo: ITaskRepository;
  let logger: AppLogger;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as ITaskRepository;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as AppLogger;
    useCase = new UpdateTaskUseCase(repo, logger);
  });

  it('should update a task successfully', async () => {
    const existingTask = { id: 'task1', title: 'Old Task', ownerId: 'user1' };
    (repo.findById as jest.Mock).mockResolvedValue(existingTask);
    (repo.update as jest.Mock).mockImplementation(async (task) => task);

    const result = await useCase.execute({
      id: 'task1',
      ownerId: 'user1',
      title: 'Updated Task',
      description: 'New desc',
      dueDate: new Date(),
      status: TaskStatusEnum.DONE,
    });

    expect(result!.title).toBe('Updated Task');
    expect(result!.status).toBe(TaskStatusEnum.DONE);
    expect(logger.log).toHaveBeenCalled();
  });

  it('should return null if task not found', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(null);

    const result = await useCase.execute({
      id: 'task1',
      ownerId: 'user1',
    });

    expect(result).toBeNull();
    expect(logger.warn).toHaveBeenCalled();
  });
});
