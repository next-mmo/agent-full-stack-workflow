import { TodoPriority } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateTodoDto {
  @ApiProperty({ example: 'Review pull request' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string

  @ApiPropertyOptional({ enum: TodoPriority, default: TodoPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TodoPriority)
  priority?: TodoPriority

  @ApiPropertyOptional({ example: '2026-09-05T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string
}
