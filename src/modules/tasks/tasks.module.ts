import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskOrm } from '../../infrastructure/orm/entities/task.orm-entity';
import { UserOrm } from '../../infrastructure/orm/entities/user.orm-entity';
import { TaskRepositoryTypeOrm } from '../../infrastructure/orm/repositories/task.repository.typeorm';
import { TasksController } from '../../interface/rest/controllers/tasks.controller';
import { CreateTaskUseCase } from '../../application/use-cases/tasks/create-task.usecase';
import { ListTasksUseCase } from '../../application/use-cases/tasks/list-tasks.usecase';
import { UpdateTaskUseCase } from '../../application/use-cases/tasks/update-task.usecase';
import { DeleteTaskUseCase } from '../../application/use-cases/tasks/delete-task.usecase';
import { AppLogger } from '../../infrastructure/logger/app-logger';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskOrm, UserOrm]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [TasksController],
  providers: [
    AppLogger,
    CreateTaskUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    { provide: 'ITaskRepository', useClass: TaskRepositoryTypeOrm },
  ],
  exports: ['ITaskRepository', JwtModule],
})
export class TasksModule {}
