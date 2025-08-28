// src/application/use-cases/tasks/__tests__/list-tasks.usecase.spec.ts
import { ListTasksUseCase } from '../list-tasks.usecase';
import { ITaskRepository } from '../../../ports/task-repository.port';
import { AppLogger } from '../../../../infrastructure/logger/app-logger';

describe('ListTasksUseCase', () => {
  let useCase: ListTasksUseCase;
  let repo: ITaskRepository;
  let logger: AppLogger;

  beforeEach(() => {
    repo = { findByOwner: jest.fn() } as unknown as ITaskRepository;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as AppLogger;
    useCase = new ListTasksUseCase(repo, logger);
  });

  it('should list tasks for a user', async () => {
    const tasks = [{ id: 'task1', title: 'Task 1' }];
    (repo.findByOwner as jest.Mock).mockResolvedValue(tasks);

    const result = await useCase.execute('user1');

    expect(result).toEqual(tasks);
    expect(repo.findByOwner).toHaveBeenCalledWith('user1');
    expect(logger.log).toHaveBeenCalled();
  });
});
