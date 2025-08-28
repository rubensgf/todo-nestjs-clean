// src/interface/rest/controllers/tasks.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTaskUseCase } from '../../../application/use-cases/tasks/create-task.usecase';
import { ListTasksUseCase } from '../../../application/use-cases/tasks/list-tasks.usecase';
import { UpdateTaskUseCase } from '../../../application/use-cases/tasks/update-task.usecase';
import { DeleteTaskUseCase } from '../../../application/use-cases/tasks/delete-task.usecase';
import { AppLogger } from '../../../infrastructure/logger/app-logger';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt.guard';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createUC: CreateTaskUseCase,
    private readonly listUC: ListTasksUseCase,
    private readonly updateUC: UpdateTaskUseCase,
    private readonly deleteUC: DeleteTaskUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    try {
      const task = await this.createUC.execute({
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        ownerId: req.user.userId,
      });
      this.logger.log(`Task ${task.id} criada por ${req.user.userId}`);
      return task;
    } catch (error) {
      this.logger.error('Erro ao criar task', error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas retornada' })
  async list(@Req() req: any) {
    try {
      const tasks = await this.listUC.execute(req.user.userId);
      this.logger.log(`Listadas ${tasks.length} tasks para ${req.user.userId}`);
      return tasks;
    } catch (error) {
      this.logger.error('Erro ao listar tasks', error.stack);
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa existente' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    try {
      const updated = await this.updateUC.execute({
        id: id, // mantendo o campo como "id"
        ownerId: req.user.userId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        status: dto.status,
      });
      this.logger.log(`Task ${id} atualizada por ${req.user.userId}`);
      return updated;
    } catch (error) {
      this.logger.error(`Erro ao atualizar task ${id}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso' })
  async delete(@Req() req: any, @Param('id') id: string) {
    try {
      await this.deleteUC.execute(req.user.userId, id);
      this.logger.log(`Task ${id} deletada por ${req.user.userId}`);
      return { message: 'Task deletada com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao deletar task ${id}`, error.stack);
      throw error;
    }
  }
}
