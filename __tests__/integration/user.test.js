const mongoose = require('mongoose');
const app = require('../../app');
const request = require('supertest');
const userModel = require('../../models/user');
const productModel = require('../../models/product');
require('dotenv').config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await userModel.deleteMany({ isTest: true });
  await productModel.deleteMany({ isTest: true });
  await mongoose.connection.close();
});

describe('User Routes', () => {
  it('should get products for user', async () => {
    await productModel.create({
      title: 'Test Product',
      image: 'uploads/test.jpg', 
      category: 'Test Product',
      price: 99,
      description: 'A product for testing',
      isTest: true
    });

    const res = await request(app).get('/user');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Test Product'); 
  });
});
