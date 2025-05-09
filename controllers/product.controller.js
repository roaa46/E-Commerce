const Products = require('../models/product');

// ✅ عرض صفحة كل المنتجات
const getProducts = async (req, res) => {
    const { showDiscount, calculateNewPrice } = require('../helpers/discount');
    const { convertToUppercase}=require('../helpers/productFormat');

    try {
        const products = await Products.find();
        res.render('admin', {
            products,
            helpers: {
                showDiscount,
                calculateNewPrice,
                convertToUppercase
            }
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
const getProductsForUser = async (req, res) => {
    const { showDiscount, calculateNewPrice } = require('../helpers/discount');
    const { convertToUppercase}=require('../helpers/productFormat');

    try {
        const products = await Products.find();
        res.render('user', {
            products,
            helpers: {
                showDiscount,
                calculateNewPrice,
                convertToUppercase
            }
        });
        
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
// ✅ عرض فورم إضافة منتج
const getAddProductForm = (req, res) => {
    res.render('product-form', {
        product: {},
        isEdit: false
    });
};

// ✅ عرض فورم تعديل منتج
const getEditProductForm = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');

        res.render('product-form', {
            product,
            isEdit: true
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// ✅ إضافة منتج
const createProduct = async (req, res) => {
    try {
        console.log(req.body); 
        const newProduct = new Products({
          
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            image: req.body.image,
            discount: req.body.discount || 0,
            isTest: req.body.isTest === 'true' || req.body.isTest === true
        });

        await newProduct.save();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};

// ✅ تعديل منتج
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const result = await Products.updateOne(
            { _id: productId },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    image: req.body.image,
                    discount: req.body.discount || 0,
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};

// ✅ حذف منتج
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const result = await Products.deleteOne({ _id: productId });
        if (result.deletedCount === 0) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// ✅ تطبيق خصم
const applyDiscount = async (req, res) => {
    const productId = req.params.id;
    const discount = parseFloat(req.body.discount);

    try {
        const product = await Products.findById(productId);
        if (!product) return res.status(404).send('Product not found');

        product.discount = discount;
        await product.save();

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// ✅ إزالة خصم
const removeDiscount = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Products.findById(productId);
        if (!product) return res.status(404).send('Product not found');

        product.discount = 0;
        await product.save();

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getProducts,
    getAddProductForm,
    getEditProductForm,
    createProduct,
    updateProduct,
    deleteProduct,
    applyDiscount,
    removeDiscount,
    getProductsForUser
};
