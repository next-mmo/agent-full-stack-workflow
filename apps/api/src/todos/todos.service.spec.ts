import { NotFoundException } from '@nestjs/common'
import { TodosService } from './todos.service'

describe('TodosService', () => {
  const prisma = {
    todo: {
      findMany: jest.fn(),
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
    })

    await service.create({ title: '  Ship feature  ' })

    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { title: 'Ship feature' },
    })
  })

  it('throws when updating a missing todo', async () => {
    prisma.todo.findUnique.mockResolvedValue(null)

    await expect(
      service.update('missing', { completed: true }),
    ).rejects.toBeInstanceOf(NotFoundException)
  })
})
