const mongoose = require('mongoose');
const app = require('../../app');
const userModel = require('../../models/user');
const request = require('supertest');
require('dotenv').config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
  await userModel.deleteMany({ isTest: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication Routes', () => {

  it('should render login page', async () => {
    const res = await request(app).get('/auth/login');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Login');
  });

  it('should render signup page', async () => {
    const res = await request(app).get('/auth/signup');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Sign Up');
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
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

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/user');
  });

  it('should login a user', async () => {
    const testEmail = `loginuser${Date.now()}@example.com`;

    await request(app).post('/auth/register').send({
      firstName: "Test",
      lastName: "User",
      mobile: "0123456789",
      gender: "female",
      username: "loginuser",
      email: testEmail,
      password: "123456",  
      confirmPassword: "123456",  
      isAdmin: false,
      isTest: true,
    });

    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    });

    expect(res.status).toBe(302);
  });

});
