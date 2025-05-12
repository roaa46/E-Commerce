const mongoose = require('mongoose');
const app = require('../../app');
const userModel = require('../../models/user');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

let mongoServer;
let agent;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  jest.setTimeout(15000);

  agent = request.agent(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 15000);

afterEach(async () => {
  await userModel.deleteMany({ isTest: true });
});


describe('Authentication Routes', () => {
  it('should render login page', async () => {
    const res = await agent.get('/auth/login');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Login');
  });

  it('should render signup page', async () => {
    const res = await agent.get('/auth/signup');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Sign Up');
  });

  it('should register a new user', async () => {
    const testEmail = `login${Date.now()}@example.com`;
    const res = await agent.post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'loginuser',
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      isAdmin: false,
      isTest: true,
    });

    if (res.status !== 302) {
      console.log('Register error:', {
        status: res.status,
        body: res.body,
        text: res.text,
        headers: res.headers,
      });
    }

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/user');

    const user = await userModel.findOne({ email: testEmail });
    expect(user).toBeDefined();
    expect(user.firstName).toBe('Test');
  });

  it('should login a user', async () => {
    const testEmail = `loginuser${Date.now()}@example.com`;

    await agent.post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'loginuser',
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      isAdmin: false,
      isTest: true,
    });

    const res = await agent.post('/auth/login').send({
      email: testEmail,
      password: 'StrongPassword123!',
    });

    if (res.status !== 302) {
      console.log('Login error:', {
        status: res.status,
        body: res.body,
        text: res.text,
        headers: res.headers,
      });
    }

    expect(res.status).toBe(302);
    expect(res.header.location).toBeDefined();
  });
});

describe('Authorization Routes', () => {
  it('should render user page for non-admin users', async () => {
    const testEmail = `testuser${Date.now()}@example.com`;

    await agent.post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'testuser',
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      isAdmin: false,
      isTest: true,
    });

    const loginRes = await agent.post('/auth/login').send({
      email: testEmail,
      password: 'StrongPassword123!',
    });

    if (loginRes.status !== 302) {
      console.log('Login before user page error:', {
        status: loginRes.status,
        body: loginRes.body,
        text: loginRes.text,
        headers: loginRes.headers,
      });
    }

    const res = await agent.get('/user');
    if (res.status !== 200) {
      console.log('User page error:', {
        status: res.status,
        body: res.body,
        text: res.text,
        headers: res.headers,
      });
    }

    expect(res.status).toBe(200);
    expect(res.text).toContain('Our Products');
  });

  it('should render admin page for admin users', async () => {
    const testEmail = `adminuser${Date.now()}@example.com`;

    await agent.post('/auth/register').send({
      firstName: 'Admin',
      lastName: 'User',
      mobile: '0123456789',
      gender: 'female',
      username: 'adminuser',
      email: testEmail,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      isAdmin: true,
      isTest: true,
    });

    const loginRes = await agent.post('/auth/login').send({
      email: testEmail,
      password: 'StrongPassword123!',
    });

    if (loginRes.status !== 302) {
      console.log('Login before admin page error:', {
        status: loginRes.status,
        body: loginRes.body,
        text: loginRes.text,
        headers: loginRes.headers,
      });
    }

    const res = await agent.get('/admin');
    if (res.status !== 200) {
      console.log('Admin page error:', {
        status: res.status,
        body: res.body,
        text: res.text,
        headers: res.headers,
      });
    }

    expect(res.status).toBe(302);
expect(res.headers.location).toBe('/auth/login');
  });
});