const mongoose = require('mongoose');
const app = require('../../app');
const request = require('supertest');
const productModel = require('../../models/product');

require('dotenv').config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await productModel.deleteMany({ isTest: true });
  await mongoose.connection.close();
});

describe("Product Integration Tests", () => {
  it("should create a new product (admin)", async () => {
    const productData = {
      title: 'Test Product',
      image: 'uploads/test.jpg',
      category: 'Test Product',
      price: 99,
      description: 'A product for testing',
      isTest: true
    };    

    const res = await request(app).post("/admin/products").send(productData);
    expect(res.statusCode).toBe(302); 
  });

  it("should get list of products for user", async () => {
    const res = await request(app).get("/user");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Test Product"); 
  });
});
