import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateTodoDto } from './dto/create-todo.dto'
import { ListTodosQueryDto } from './dto/list-todos-query.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodosService } from './todos.service'

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  list(@Query() query: ListTodosQueryDto) {
    return this.todosService.list(query)
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id)
  }
}
