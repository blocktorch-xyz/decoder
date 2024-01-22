import request from 'supertest'
import app from "../../../src/app";

describe('health endpoint', () => {
  beforeEach(() => {
  }, 1500);

  it('Should return 200', (done) => {
    request(app)
      .get('/api/public/health')
      .expect(200)
      .end(done);
  });
})
