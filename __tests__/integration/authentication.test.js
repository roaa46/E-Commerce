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

describe('Authorization Routes', () => {

  // اختبارات لحالة المستخدم العادي
  it('should render user page for non-admin users', async () => {
    const testEmail = `testuser${Date.now()}@example.com`;

    // تسجيل المستخدم العادي
    await request(app).post('/auth/register').send({
      firstName: "Test",
      lastName: "User",
      mobile: "0123456789",
      gender: "female",
      username: "testuser",
      email: testEmail,
      password: "123456",
      confirmPassword: "123456",
      isAdmin: false,
      isTest: true,
    });

    // تسجيل الدخول للمستخدم العادي
    const resLogin = await request(app).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    });

    // اختبار أن الجلسة تحتوي على المستخدم العادي
    const res = await request(app)
      .get('/user')  // المسار الذي يوجه المستخدم العادي إليه
      .set('Cookie', resLogin.headers['set-cookie']);  // ارسال الكوكيز الخاصة بالجلسة

    expect(res.status).toBe(200);
    expect(res.text).toContain('Our Products');  // تأكد من أن الصفحة تحتوي على نص معين
  });

  // اختبارات لحالة المستخدم admin
  it('should render admin page for admin users', async () => {
    const testEmail = `adminuser${Date.now()}@example.com`;

    // تسجيل المستخدم admin
    await request(app).post('/auth/register').send({
      firstName: "Admin",
      lastName: "User",
      mobile: "0123456789",
      gender: "female",
      username: "adminuser",
      email: testEmail,
      password: "123456",
      confirmPassword: "123456",
      isAdmin: true,
      isTest: true,
    });

    // تسجيل الدخول للمستخدم admin
    const resLogin = await request(app).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    });

    // اختبار أن الجلسة تحتوي على المستخدم admin
    const res = await request(app)
      .get('/admin')  // المسار الذي يوجه المستخدم admin إليه
      .set('Cookie', resLogin.headers['set-cookie']);  // ارسال الكوكيز الخاصة بالجلسة

    expect(res.status).toBe(200);
    expect(res.text).toContain('Admin Dashboard');  // تأكد من أن الصفحة تحتوي على نص معين
  });

});
