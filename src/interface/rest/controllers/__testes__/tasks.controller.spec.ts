// src/interface/rest/controllers/__testes__/tasks.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { CreateTaskUseCase } from '../../../../application/use-cases/tasks/create-task.usecase';
import { ListTasksUseCase } from '../../../../application/use-cases/tasks/list-tasks.usecase';
import { UpdateTaskUseCase } from '../../../../application/use-cases/tasks/update-task.usecase';
import { DeleteTaskUseCase } from '../../../../application/use-cases/tasks/delete-task.usecase';
import { AppLogger } from '../../../../infrastructure/logger/app-logger';
import { CreateTaskDto } from '../../dtos/create-task.dto';
import { UpdateTaskDto } from '../../dtos/update-task.dto';
import { TaskStatusEnum } from '../../../../domain/entities/task';
import { JwtAuthGuard } from '../../../../infrastructure/auth/jwt.guard';
import { ExecutionContext } from '@nestjs/common';

describe('TasksController (unit)', () => {
  let controller: TasksController;
  let createUC: CreateTaskUseCase;
  let listUC: ListTasksUseCase;
  let updateUC: UpdateTaskUseCase;
  let deleteUC: DeleteTaskUseCase;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  } as unknown as AppLogger;

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: CreateTaskUseCase, useValue: { execute: jest.fn() } },
        { provide: ListTasksUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateTaskUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteTaskUseCase, useValue: { execute: jest.fn() } },
        { provide: AppLogger, useValue: mockLogger },
      ],
    });

    // Mock do JwtAuthGuard para testes unitários
    moduleBuilder.overrideGuard(JwtAuthGuard).useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = { userId: 'user1' }; // garante que userId exista
        return true;
      },
    });

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<TasksController>(TasksController);
    createUC = module.get<CreateTaskUseCase>(CreateTaskUseCase);
    listUC = module.get<ListTasksUseCase>(ListTasksUseCase);
    updateUC = module.get<UpdateTaskUseCase>(UpdateTaskUseCase);
    deleteUC = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
  });

  const mockReq = { user: { userId: 'user1' } } as any;

  it('should create a task', async () => {
    const dto: CreateTaskDto = { title: 'Task 1' };
    (createUC.execute as jest.Mock).mockResolvedValue({ id: 'task1', ...dto });

    const result = await controller.create(mockReq, dto);
    expect(result.id).toBe('task1');
    expect(createUC.execute).toHaveBeenCalledWith({
      title: 'Task 1',
      description: undefined,
      dueDate: null,
      ownerId: 'user1',
    });
  });

  it('should list tasks', async () => {
    const tasks = [{ id: 'task1', title: 'Task 1' }];
    (listUC.execute as jest.Mock).mockResolvedValue(tasks);

    const result = await controller.list(mockReq);
    expect(result).toEqual(tasks);
    expect(listUC.execute).toHaveBeenCalledWith('user1');
  });

  it('should update a task', async () => {
    const dto: UpdateTaskDto = {
      title: 'Updated Task',
      status: TaskStatusEnum.DONE,
    };
    (updateUC.execute as jest.Mock).mockResolvedValue({ id: 'task1', ...dto });

    const result = await controller.update(mockReq, 'task1', dto);
    expect(result!.title).toBe('Updated Task');
    expect(updateUC.execute).toHaveBeenCalledWith({
      id: 'task1',
      ownerId: 'user1',
      title: 'Updated Task',
      description: undefined,
      dueDate: null,
      status: TaskStatusEnum.DONE,
    });
  });

  it('should delete a task', async () => {
    (deleteUC.execute as jest.Mock).mockResolvedValue(undefined);

    const result = await controller.delete(mockReq, 'task1');
    expect(result).toEqual({ message: 'Task deletada com sucesso' });
    expect(deleteUC.execute).toHaveBeenCalledWith('user1', 'task1');
  });
});
