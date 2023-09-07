const { Product } = require('../models/product.model');
const { publishUserEvent } = require('../utils/publish-event.util');


// --------------------------------------------- create product ---------------------------------------------


const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const product = new Product(productData);
        await product.save();
        publishUserEvent('product_created', product);
        res.status(201).send({ message: 'Product created successfully', product: product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};


// --------------------------------------------- sell product ---------------------------------------------


const sellProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (req.body.stock <= 0) return res.status(400).send({ message: 'Product stock is not available now' });
        if (req.body.quantity === undefined || req.body.quantity <= 0) return res.status(400).send({ message: 'Quantity must be a positive number' });
        if (req.body.quantity > product.stock) return res.status(400).send({ message: 'Insufficient stock for the requested quantity' });
        product.stock -= req.body.quantity;
        await product.save();
        res.status(200).json({ message: 'Product sold successfully', product });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error });
    }
};


// --------------------------------------------- refund product ---------------------------------------------


const refundProduct = async (req, res) => {
    console.log("refund product");
};


// --------------------------------------------- get all product ---------------------------------------------


const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send({ products: products });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error });
    }
};



module.exports = {
    createProduct,
    sellProduct,
    refundProduct,
    getProducts,
};