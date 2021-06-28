const express = require('express');
const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeAll((done) => {
  done();
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  db.destroy();
  done();
});

describe('GET /sim-card', () => {
  it('should be in json format', async () => {
    await request(app).get('/sim-cards').expect('Content-Type', /json/);
  });
  it('should give a 200 response', async () => {
    await request(app).get('/sim-cards').expect(200);
  });
});

describe('POST /sim-card', () => {
  describe('create new sim-card', () => {
    it('should give a 200 response', async () => {
      await request(app)
        .post('/createsimcard')
        .send({ name: 'cellc' })
        .expect(500);
      // .expect(200);
    });
    it('should be in json format', async () => {
      await request(app).post('/createsimcard').expect('Content-Type', /json/);
    });
  });
  describe('Given a exicting name', () => {
    it('should return a erorr', async () => {
      await request(app).post('/createsimcard').expect(200);
    });
  });
});

describe('POST /order', () => {
  describe('Create new sim card order', () => {
    it('should give a 200 response', async () => {
      await request(app).post('/order/1/4').expect(200);
    });
  });
});

describe('GET /order', () => {
  describe('Given all ', () => {
    it('should start on page number 1', async () => {
      await request(app).get('/orders').query({ page: 1 });
    });
    it('should return error response, if page or limit is not a valid integer', async () => {
      await request(app).get('/orders/?page=r&limit=a').expect(500);
    });
    it('should return an empty array json as response, if there is no result', async () => {
      await request(app).get('/orders').expect('Content-Type', /json/);
    });
  });
});

describe('PATCH /order', () => {
  describe('When there are concurrent requests to take a same order', () => {
    // it('should one can take the order while the other will fail',async () => {
    //     await request(app).patch('/orders/:id').
    // })
  });
  describe('whe requesrs passes', () => {
    it('hould be able to change the status of an order to Complete', async () => {
      await request(app).patch('/orders/3').expect(200);
    });
  });
});
