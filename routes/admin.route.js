const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');


router.get('/', controller.getProducts);
router.post('/products', controller.createProduct);
router.get('/add-product', controller.getAddProductForm);


router.get('/edit/:id', controller.getEditProductForm);



// ✅ تعديل منتج
router.post('/products/:id/update', controller.updateProduct);

// ✅ حذف منتج
router.post('/products/delete/:id', controller.deleteProduct);

// ✅ تطبيق خصم
router.post('/apply-discount/:id', controller.applyDiscount);

// ✅ إزالة خصم
router.post('/remove-discount/:id', controller.removeDiscount);

module.exports = router;
