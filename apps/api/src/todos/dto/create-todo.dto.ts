import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateTodoDto {
  @ApiProperty({ example: 'Review pull request' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string
}
