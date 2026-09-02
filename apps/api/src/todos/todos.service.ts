import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  create(dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        title: dto.title.trim(),
      },
    })
  }

  async update(id: string, dto: UpdateTodoDto) {
    const existing = await this.prisma.todo.findUnique({ where: { id } })

    if (!existing) {
      throw new NotFoundException('Todo not found')
    }

    return this.prisma.todo.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
      },
    })
  }

  async remove(id: string) {
    const existing = await this.prisma.todo.findUnique({ where: { id } })

    if (!existing) {
      throw new NotFoundException('Todo not found')
    }

    await this.prisma.todo.delete({ where: { id } })

    return { success: true }
  }
}
