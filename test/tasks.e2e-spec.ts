import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TaskStatusEnum } from '../src/domain/entities/task';

describe('TasksController (E2E)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    await request(app.getHttpServer())
      .post('/users/register')
      .send({ email: 'test@example.com', password: '123456' })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'test@example.com', password: '123456' })
      .expect(201);

    jwtToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  let taskId: string;

  it('POST /tasks - should create a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'E2E Task',
        description: 'desc',
        status: TaskStatusEnum.PENDING,
      })
      .expect(201);

    expect(res.body.title).toBe('E2E Task');
    expect(res.body.status).toBe(TaskStatusEnum.PENDING);
    taskId = res.body.id;
  });

  it('GET /tasks - should list tasks', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('PUT /tasks/:id - should update a task', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Updated Task', status: TaskStatusEnum.DONE })
      .expect(200);

    expect(res.body.title).toBe('Updated Task');
    expect(res.body.status).toBe(TaskStatusEnum.DONE);
  });

  it('DELETE /tasks/:id - should delete a task', async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.find((t) => t.id === taskId)).toBeUndefined();
  });
});
