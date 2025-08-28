// src/application/use-cases/tasks/__tests__/create-task.usecase.spec.ts
import { CreateTaskUseCase } from '../create-task.usecase';
import { ITaskRepository } from '../../../ports/task-repository.port';
import { AppLogger } from '../../../../infrastructure/logger/app-logger';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let repo: ITaskRepository;
  let logger: AppLogger;

  beforeEach(() => {
    repo = { create: jest.fn() } as unknown as ITaskRepository;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as AppLogger;
    useCase = new CreateTaskUseCase(repo, logger);
  });

  it('should create a task', async () => {
    const dto = {
      title: 'Task 1',
      ownerId: 'user1',
      description: 'desc',
      dueDate: new Date(),
    };
    const fakeTask = { id: 'task1', ...dto };
    (repo.create as jest.Mock).mockResolvedValue(fakeTask);

    const result = await useCase.execute(dto);
    expect(result).toEqual(fakeTask);
    expect(repo.create).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalled();
  });
});
