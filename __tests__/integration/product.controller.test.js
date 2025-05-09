const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Products = require('../../models/product');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Products.deleteMany({});
});

describe('Product Routes - Integration Tests', () => {
  it('should get products (GET /admin)', async () => {
    const res = await request(app).get('/admin');
    expect(res.statusCode).toBe(200);
  });

  it('should create product (POST /admin/products)', async () => {
    const res = await request(app)
      .post('/admin/products')
      .send({
        title: 'Integration Test',
        description: 'desc',
        category: 'tech',
        price: 10,
        image: 'test.jpg',
        discount: 0,
        isTest: true,
      });

    expect(res.statusCode).toBe(302); // redirect
    const product = await Products.findOne({ title: 'Integration Test' });
    expect(product).toBeDefined();
  });

  it('should update a product (POST /admin/products/:id/update)', async () => {
    const product = await Products.create({
      title: 'Product to Update',
      description: 'desc',
      category: 'cat',
      price: 100,
      image: 'image.png',
      discount: 0,
      isTest: true,
    });

    const res = await request(app)
      .post(`/admin/products/${product._id}/update`)
      .send({
        title: 'Updated Product',
        description: 'Updated description',
        category: 'new category',
        price: 150,
        image: 'updated_image.png',
        discount: 5,
      });

    expect(res.statusCode).toBe(302); // redirect
    const updatedProduct = await Products.findById(product._id);
    expect(updatedProduct.title).toBe('Updated Product');
  });

  it('should delete a product (POST /admin/products/delete/:id)', async () => {
    const product = await Products.create({
      title: 'Product to Delete',
      description: 'desc',
      category: 'cat',
      price: 100,
      image: 'image.png',
      discount: 0,
      isTest: true,
    });

    const res = await request(app).post(`/admin/products/delete/${product._id}`);
    expect(res.statusCode).toBe(302); // redirect
    const deletedProduct = await Products.findById(product._id);
    expect(deletedProduct).toBeNull();
  });


  it('should get add product form (GET /admin/add-product)', async () => {
    const res = await request(app).get('/admin/add-product');
    expect(res.statusCode).toBe(200);
  });

  it('should get edit product form (GET /admin/edit/:id)', async () => {
    const product = await Products.create({
      title: 'Product to Edit',
      description: 'desc',
      category: 'cat',
      price: 100,
      image: 'image.png',
      discount: 0,
      isTest: true,
    });

    const res = await request(app).get(`/admin/edit/${product._id}`);
    expect(res.statusCode).toBe(200);
  });

  
});

  it('should apply a discount to a product (POST /admin/apply-discount/:id)', async () => {
    const product = await Products.create({
      title: 'Discounted Product',
      description: 'desc',
      category: 'cat',
      price: 200,
      image: 'image.jpg',
      discount: 0,
      isTest: true,
    });

    const res = await request(app)
      .post(`/admin/apply-discount/${product._id}`)
      .send({ discount: 20 });

    expect(res.statusCode).toBe(302);
    const updatedProduct = await Products.findById(product._id);
    expect(updatedProduct.discount).toBe(20);
  });

  it('should remove discount from a product (POST /admin/remove-discount/:id)', async () => {
    const product = await Products.create({
      title: 'Product With Discount',
      description: 'desc',
      category: 'cat',
      price: 100,
      image: 'image.jpg',
      discount: 15,
      isTest: true,
    });

    const res = await request(app)
      .post(`/admin/remove-discount/${product._id}`);

    expect(res.statusCode).toBe(302);
    const updatedProduct = await Products.findById(product._id);
    expect(updatedProduct.discount).toBe(0);
  });

  it('should return 404 when applying discount to a non-existent product', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/admin/apply-discount/${nonExistentId}`)
      .send({ discount: 10 });

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Product not found');
  });

  it('should return 404 when removing discount from a non-existent product', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/admin/remove-discount/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Product not found');
  });
  it('should return 404 when trying to edit a non-existent product', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/admin/edit/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Product not found');
  }); 
  it('should return 404 when trying to delete a non-existent product', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).post(`/admin/products/delete/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Product not found');
  }); 


  
