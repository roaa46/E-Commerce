const express = require('express');
const request = require('supertest');
const router = express.Router();
const validateProduct = require('../../middlewares/validators/validateProduct');

describe('Product Validator Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/products', validateProduct, (req, res) => {
      res.status(200).json({ message: 'Validation passed' });
    });
  });

  it('should pass with valid product data', async () => {
    const res = await request(app).post('/products').send({
      title: 'Product A',
      price: 100,
      image: 'http://example.com/image.jpg',
      discount: 10,
      category: 'Electronics',
      description: 'A good product',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Validation passed');
  });

  it('should fail when required fields are missing', async () => {
    const res = await request(app).post('/products').send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'title' }),
        expect.objectContaining({ path: 'price' }),
        expect.objectContaining({ path: 'image' }),
      ])
    );
  });

  it('should fail when price is negative', async () => {
    const res = await request(app).post('/products').send({
      title: 'Product A',
      price: -50,
      image: 'http://example.com/image.jpg',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'price', msg: 'Price must be a positive number' }),
      ])
    );
  });

  it('should fail when discount is above 100', async () => {
    const res = await request(app).post('/products').send({
      title: 'Product A',
      price: 100,
      image: 'http://example.com/image.jpg',
      discount: 150,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'discount', msg: 'Discount must be between 0 and 100' }),
      ])
    );
  });

  it('should fail when category is not a string', async () => {
    const res = await request(app).post('/products').send({
      title: 'Product A',
      price: 100,
      image: 'http://example.com/image.jpg',
      category: 123,
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'category', msg: 'Category must be a string' }),
      ])
    );
  });
});

