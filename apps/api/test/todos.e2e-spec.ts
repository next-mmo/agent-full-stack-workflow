import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Todos API (e2e)', () => {
  let app: INestApplication

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
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates and lists a todo', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Human review' })
      .expect(201)

    expect(created.body.title).toBe('Human review')

    const list = await request(app.getHttpServer())
      .get('/api/todos')
      .expect(200)

    expect(list.body.some((todo: { id: string }) => todo.id === created.body.id)).toBe(true)
  })

  it('rejects unknown properties', async () => {
    await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Bad input', admin: true })
      .expect(400)
  })
})
