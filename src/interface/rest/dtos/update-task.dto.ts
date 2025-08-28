// src/interface/rest/dtos/update-task.dto.ts
import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Task, TaskStatusEnum } from '../../../domain/entities/task';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'Estudar NestJS',
    description: 'Título da tarefa',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Ler documentação',
    description: 'Descrição da tarefa',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '2025-09-15T12:00:00Z',
    description: 'Data limite da tarefa',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    enum: TaskStatusEnum,
    description: 'Status da tarefa',
  })
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;
}
