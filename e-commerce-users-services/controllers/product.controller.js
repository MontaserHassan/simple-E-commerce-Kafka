const { Product } = require('../models/product.model');
const { publishUserEvent } = require('../utils/publish-event.util');
const { runConsumerNotify } = require('../../messaging/consumer/notifyUser');


// --------------------------------------------- create product ---------------------------------------------


const createProduct = async (req, res) => {
    try {
        const existingName = await Product.findOne({ name: req.body.name });
        if (existingName) return res.status(400).send({ message: 'Product name already exists' });
        const newProduct = new Product({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            color: req.body.color
        });
        const savedProduct = await newProduct.save();
        if (savedProduct) {
            publishUserEvent('product_created', savedProduct);
            runConsumerNotify();
        };
        return res.status(201).send({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    };
};


// --------------------------------------------- get all product ---------------------------------------------


const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).send({ message: 'No products found' });
        }
        return res.status(200).send({ products: products });
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error', error });
    }
};



module.exports = {
    createProduct,
    getProducts,
};