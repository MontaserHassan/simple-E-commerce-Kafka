import { Request, Response } from "express";

import Product from '../models/product.model';
import { publishEvent } from "../utils/publish-event.util";
import User from "../models/users.model";


// --------------------------------------------- create product ---------------------------------------------


const createProduct = async (req: Request, res: Response) => {
    try {
        // const existingName = await Product.findOne({ name: req.body.name });
        // if (existingName) return res.status(400).send({ message: 'Product name already exists' });
        const newProduct = new Product({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            color: req.body.color
        });
        let messageKafka: object;
        const savedProduct = await newProduct.save();
        const users = await User.find();
        if (savedProduct) {
            messageKafka = {
                product: savedProduct,
                users: users
            };
            publishEvent('product_created', messageKafka);
        };
        return res.status(201).send({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' });
    };
};


// --------------------------------------------- get all product ---------------------------------------------


const getProducts = async (req: Request, res: Response) => {
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


export default {
    createProduct,
    getProducts,
}
