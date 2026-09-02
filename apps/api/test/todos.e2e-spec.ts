import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TodoPriority } from '@prisma/client'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

type TodoResponse = {
  id: string
  title: string
  completed: boolean
  priority: TodoPriority
  dueDate: string | null
}

type TodoListResponse = {
  items: TodoResponse[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

describe('Todos API (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('api')
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )

    await app.init()
    prisma = app.get(PrismaService)
  })

  beforeEach(async () => {
    await prisma.todo.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates a todo with priority and due date', async () => {
    const dueDate = '2026-09-05T09:00:00.000Z'

    const created = await request(app.getHttpServer())
      .post('/api/todos')
      .send({
        title: 'Review release',
        priority: TodoPriority.HIGH,
        dueDate,
      })
      .expect(201)

    expect(created.body.title).toBe('Review release')
    expect(created.body.priority).toBe(TodoPriority.HIGH)
    expect(created.body.dueDate).toBe(dueDate)
  })

  it('uses backward-compatible defaults', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Existing-style todo' })
      .expect(201)

    expect(created.body.priority).toBe(TodoPriority.MEDIUM)
    expect(created.body.dueDate).toBeNull()
    expect(created.body.completed).toBe(false)
  })

  it('rejects invalid planning fields and unknown properties', async () => {
    await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Bad priority', priority: 'URGENT' })
      .expect(400)

    await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Bad date', dueDate: 'tomorrow-ish' })
      .expect(400)

    await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Unknown property', admin: true })
      .expect(400)
  })

  it('paginates, searches, and filters todos', async () => {
    await prisma.todo.createMany({
      data: [
        { title: 'Alpha incident', priority: TodoPriority.HIGH },
        { title: 'Beta cleanup', priority: TodoPriority.LOW },
        {
          title: 'Alpha release',
          priority: TodoPriority.HIGH,
          completed: true,
        },
      ],
    })

    const firstPage = await request(app.getHttpServer())
      .get('/api/todos?page=1&pageSize=2')
      .expect(200)

    const firstPageBody = firstPage.body as TodoListResponse
    expect(firstPageBody.items).toHaveLength(2)
    expect(firstPageBody.page).toBe(1)
    expect(firstPageBody.pageSize).toBe(2)
    expect(firstPageBody.total).toBe(3)
    expect(firstPageBody.totalPages).toBe(2)

    const filtered = await request(app.getHttpServer())
      .get('/api/todos?search=alpha&priority=HIGH&completed=false')
      .expect(200)

    const filteredBody = filtered.body as TodoListResponse
    expect(filteredBody.total).toBe(1)
    expect(filteredBody.items[0]?.title).toBe('Alpha incident')
  })

  it('rejects unbounded or malformed list queries', async () => {
    await request(app.getHttpServer())
      .get('/api/todos?pageSize=51')
      .expect(400)

    await request(app.getHttpServer())
      .get('/api/todos?page=0')
      .expect(400)

    await request(app.getHttpServer())
      .get('/api/todos?completed=maybe')
      .expect(400)
  })

  it('still supports completion and delete mutations', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Lifecycle todo' })
      .expect(201)

    const updated = await request(app.getHttpServer())
      .patch(`/api/todos/${created.body.id}`)
      .send({ completed: true })
      .expect(200)

    expect(updated.body.completed).toBe(true)

    await request(app.getHttpServer())
      .delete(`/api/todos/${created.body.id}`)
      .expect(200)

    const remaining = await prisma.todo.count({
      where: { id: created.body.id as string },
    })

    expect(remaining).toBe(0)
  })
})
