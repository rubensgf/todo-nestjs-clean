import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Estudar NestJS', description: 'Título da tarefa' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Ler documentação oficial',
    description: 'Descrição da tarefa',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '2025-09-15T12:00:00Z',
    description: 'Data limite da tarefa (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Se a tarefa já foi concluída',
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean = false;
}
