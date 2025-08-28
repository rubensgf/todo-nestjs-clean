// src/application/use-cases/tasks/__tests__/delete-task.usecase.spec.ts
import { DeleteTaskUseCase } from '../delete-task.usecase';
import { ITaskRepository } from '../../../ports/task-repository.port';
import { AppLogger } from '../../../../infrastructure/logger/app-logger';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let repo: ITaskRepository;
  let logger: AppLogger;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      remove: jest.fn(),
    } as unknown as ITaskRepository;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as AppLogger;
    useCase = new DeleteTaskUseCase(repo, logger);
  });

  it('should delete a task successfully', async () => {
    const existingTask = { id: 'task1', ownerId: 'user1' };
    (repo.findById as jest.Mock).mockResolvedValue(existingTask);
    (repo.remove as jest.Mock).mockResolvedValue(undefined);

    await useCase.execute('user1', 'task1');

    expect(repo.remove).toHaveBeenCalledWith(existingTask);
    expect(logger.log).toHaveBeenCalled();
  });

  it('should do nothing if task not found', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(null);

    await useCase.execute('user1', 'task1');

    expect(repo.remove).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });
});
