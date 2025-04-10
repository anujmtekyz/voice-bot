import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('System API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/system/status', () => {
    it('should return system health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/system/status')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveProperty('redis');
    });
  });

  describe('GET /api/system/version', () => {
    it('should return system version information', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/system/version')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('nodeVersion');
      expect(response.body).toHaveProperty('nestVersion');
    });
  });
});
