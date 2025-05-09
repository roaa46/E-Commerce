const mongoose = require('mongoose');
const app = require('../../app');
const request = require('supertest');
const userModel = require('../../models/user');
const productModel = require('../../models/product');
require('dotenv').config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
  await userModel.deleteMany({ isTest: true });
  await productModel.deleteMany({ isTest: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  it('should get products for user', async () => {
    const userRes = await request(app).post('/auth/register').send({
      firstName: "Test",
      lastName: "User",
      mobile: "0123456789",
      gender: "female",
      username: "loginuser",
      email: `login${Date.now()}@example.com`,
      password: "123456",
      confirmPassword: "123456",
      isAdmin: false,
      isTest: true,
    });

    expect(userRes.status).toBe(302);

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
