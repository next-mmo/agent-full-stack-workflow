import { NotFoundException } from '@nestjs/common'
import { TodoPriority } from '@prisma/client'
import { TodosService } from './todos.service'

describe('TodosService', () => {
  const prisma = {
    $transaction: jest.fn(async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    ),
    todo: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  const service = new TodosService(prisma as never)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('trims a title when creating a todo', async () => {
    prisma.todo.create.mockResolvedValue({
      id: '1',
      title: 'Ship feature',
      completed: false,
      priority: TodoPriority.MEDIUM,
      dueDate: null,
    })

    await service.create({ title: '  Ship feature  ' })

    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { title: 'Ship feature' },
    })
  })

  it('builds a bounded filtered page query', async () => {
    prisma.todo.findMany.mockResolvedValue([
      {
        id: '2',
        title: 'Review security PR',
        completed: false,
        priority: TodoPriority.HIGH,
      },
    ])
    prisma.todo.count.mockResolvedValue(3)

    const result = await service.list({
      page: 2,
      pageSize: 2,
      search: ' security ',
      priority: TodoPriority.HIGH,
      completed: false,
    })

    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: 'security', mode: 'insensitive' },
        completed: false,
        priority: TodoPriority.HIGH,
      },
      orderBy: { createdAt: 'desc' },
      skip: 2,
      take: 2,
    })
    expect(prisma.todo.count).toHaveBeenCalledWith({
      where: {
        title: { contains: 'security', mode: 'insensitive' },
        completed: false,
        priority: TodoPriority.HIGH,
      },
    })
    expect(result).toMatchObject({
      page: 2,
      pageSize: 2,
      total: 3,
      totalPages: 2,
    })
  })

  it('throws when updating a missing todo', async () => {
    prisma.todo.findUnique.mockResolvedValue(null)

    await expect(
      service.update('missing', { completed: true }),
    ).rejects.toBeInstanceOf(NotFoundException)
  })
})
