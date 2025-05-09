// __tests__/unit/product.controller.test.js
const Products = require('../../models/product');
const controller = require('../../controllers/product.controller');

jest.mock('../../models/product');

describe('Product Controller - Unit Tests', () => {
  it('should fetch all products', async () => {
    const mockProducts = [{ title: 'Product1' }];
    Products.find.mockResolvedValue(mockProducts);

    const req = {};
    const res = {
      render: jest.fn()
    };

    await controller.getProducts(req, res);

    expect(res.render).toHaveBeenCalledWith('admin', expect.objectContaining({
      products: mockProducts
    }));
  });

  it('should create a product', async () => {
    const save = jest.fn().mockResolvedValue();
    Products.mockImplementation(() => ({ save }));

    const req = {
      body: {
        title: 'New Product',
        description: 'desc',
        category: 'cat',
        price: 100,
        image: 'image.png',
        discount: 0,
        isTest: true
      }
    };
    const res = { redirect: jest.fn() };

    await controller.createProduct(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/admin');
  });

  it('should update a product', async () => {
    const updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
    Products.updateOne = updateOne;

    const req = {
      params: { id: '1' },
      body: {
        title: 'Updated Product',
        description: 'Updated desc',
        category: 'cat',
        price: 150,
        image: 'updated_image.png',
        discount: 10
      }
    };
    const res = { redirect: jest.fn() };

    await controller.updateProduct(req, res);

    expect(updateOne).toHaveBeenCalledWith(
      { _id: '1' },
      expect.objectContaining({
        $set: expect.objectContaining({
          title: 'Updated Product',
          description: 'Updated desc',
          category: 'cat',
          price: 150,
          image: 'updated_image.png',
          discount: 10
        })
      })
    );
    expect(res.redirect).toHaveBeenCalledWith('/admin');
  });

  it('should delete a product', async () => {
    const deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
    Products.deleteOne = deleteOne;

    const req = { params: { id: '1' } };
    const res = { redirect: jest.fn() };

    await controller.deleteProduct(req, res);

    expect(deleteOne).toHaveBeenCalledWith({ _id: '1' });
    expect(res.redirect).toHaveBeenCalledWith('/admin');
  });
});

it('should handle error when getting products', async () => {
  Products.find.mockRejectedValue(new Error('DB Error'));

  const req = {};
  const res = { render: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

  await controller.getProducts(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Server Error');
});

it('should handle error when editing product', async () => {
  Products.findById.mockRejectedValue(new Error('DB Error'));

  const req = { params: { id: '123' } };
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

  await controller.getEditProductForm(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Server Error');
});
