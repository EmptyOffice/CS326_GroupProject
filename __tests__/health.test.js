import express from 'express';
import healthRouter from '../routes/health.js';

let server;
let baseUrl;

beforeAll(async () => {
  const app = express();
  app.use('/health', healthRouter);
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

afterAll(() => new Promise((resolve) => server.close(resolve)));

test('GET /health returns 200 with JSON content type and status "ok"', async () => {
  const res = await fetch(`${baseUrl}/health`);
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toMatch(/application\/json/);
  const body = await res.json();
  expect(body.status).toBe('ok');
});

test('GET /health works with no cookie or auth token', async () => {
  const res = await fetch(`${baseUrl}/health`, { headers: {} });
  expect(res.status).toBe(200);
  expect(res.headers.get('set-cookie')).toBeNull();
});