import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

type HealthResponse = {
  status: string
  timestamp: string
}

describe('Health API (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns non-sensitive liveness data', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200)

    const body = response.body as HealthResponse

    expect(body.status).toBe('ok')
    expect(typeof body.timestamp).toBe('string')
    expect(Object.keys(body).sort()).toEqual(['status', 'timestamp'])
  })
})
