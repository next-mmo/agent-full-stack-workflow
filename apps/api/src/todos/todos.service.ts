import { Prisma } from '@prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { ListTodosQueryDto } from './dto/list-todos-query.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListTodosQueryDto) {
    const search = query.search?.trim()
    const where: Prisma.TodoWhereInput = {
      ...(search
        ? {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.completed !== undefined
        ? { completed: query.completed }
        : {}),
      ...(query.priority !== undefined ? { priority: query.priority } : {}),
    }

    const skip = (query.page - 1) * query.pageSize

    const [items, total] = await this.prisma.$transaction([
      this.prisma.todo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.pageSize,
      }),
      this.prisma.todo.count({ where }),
    ])

    return {
      items,
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    }
  }

  create(dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        title: dto.title.trim(),
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(dto.dueDate !== undefined
          ? { dueDate: new Date(dto.dueDate) }
          : {}),
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
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(dto.dueDate !== undefined
          ? { dueDate: dto.dueDate === null ? null : new Date(dto.dueDate) }
          : {}),
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
