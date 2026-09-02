import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TodoPriority } from '@prisma/client'
import request from 'supertest'
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

    const body = created.body as TodoResponse
    expect(body.title).toBe('Review release')
    expect(body.priority).toBe(TodoPriority.HIGH)
    expect(body.dueDate).toBe(dueDate)
  })

  it('uses backward-compatible defaults', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Existing-style todo' })
      .expect(201)

    const body = created.body as TodoResponse
    expect(body.priority).toBe(TodoPriority.MEDIUM)
    expect(body.dueDate).toBeNull()
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
      .send({ title: 'Bad input', admin: true })
      .expect(400)
  })

  it('paginates, searches, and filters todos', async () => {
    await prisma.todo.createMany({
      data: [
        { title: 'Review security PR', priority: TodoPriority.HIGH },
        { title: 'Review frontend PR', priority: TodoPriority.MEDIUM },
        {
          title: 'Ship completed release',
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
    expect(firstPageBody.total).toBe(3)
    expect(firstPageBody.totalPages).toBe(2)

    const highPriority = await request(app.getHttpServer())
      .get('/api/todos?priority=HIGH&pageSize=20')
      .expect(200)

    const highBody = highPriority.body as TodoListResponse
    expect(highBody.items).toHaveLength(2)
    expect(highBody.items.every((todo) => todo.priority === TodoPriority.HIGH)).toBe(true)

    const completed = await request(app.getHttpServer())
      .get('/api/todos?completed=true')
      .expect(200)

    const completedBody = completed.body as TodoListResponse
    expect(completedBody.items).toHaveLength(1)
    expect(completedBody.items[0]?.completed).toBe(true)

    const searched = await request(app.getHttpServer())
      .get('/api/todos?search=security')
      .expect(200)

    const searchedBody = searched.body as TodoListResponse
    expect(searchedBody.items).toHaveLength(1)
    expect(searchedBody.items[0]?.title).toBe('Review security PR')
  })

  it('rejects unbounded or malformed list queries', async () => {
    await request(app.getHttpServer())
      .get('/api/todos?pageSize=51')
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

    const todo = created.body as TodoResponse

    const updated = await request(app.getHttpServer())
      .patch(`/api/todos/${todo.id}`)
      .send({ completed: true })
      .expect(200)

    expect((updated.body as TodoResponse).completed).toBe(true)

    await request(app.getHttpServer()).delete(`/api/todos/${todo.id}`).expect(200)

    const list = await request(app.getHttpServer()).get('/api/todos').expect(200)
    expect((list.body as TodoListResponse).total).toBe(0)
  })
})
