const mongoose = require('mongoose');
const app = require('../../app');
const request = require('supertest');
const userModel = require('../../models/user');
const productModel = require('../../models/product');
require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod; // لتخزين السيرفر الوهمي

// إعداد السيرفر الوهمي قبل كل الاختبارات
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // خيارات متوافقة
  jest.setTimeout(10000); // زيادة الـ Timeout لـ 10 ثواني
});

// إعداد قبل كل اختبار
beforeEach(async () => {
  // تنظيف البيانات قبل كل اختبار
  await userModel.deleteMany();
  await productModel.deleteMany();
});

// تنظيف بعد كل اختبار
afterEach(async () => {
  await userModel.deleteMany({ isTest: true });
  await productModel.deleteMany({ isTest: true });
});

// إغلاق الاتصال بعد الاختبارات
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

describe('User Routes', () => {
  it('should get products for user', async () => {
    // إنشاء مستخدم جديد
    const userRes = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        mobile: '0123456789',
        gender: 'female',
        username: 'loginuser',
        email: `login${Date.now()}@example.com`,
        password: '123456',
        confirmPassword: '123456',
        isAdmin: false,
        isTest: true,
      });

    expect(userRes.status).toBe(400);

    // إنشاء منتج جديد
    await productModel.create({
      title: 'Test Product',
      image: 'uploads/test.jpg',
      category: 'Test Product',
      price: 99,
      description: 'A product for testing',
      isTest: true,
    });

    // اختبار جلب المنتجات
    const res = await request(app).get('/user');
    expect(res.status).toBe(302);
    expect(res.text).toContain('/auth/login');
  });
});