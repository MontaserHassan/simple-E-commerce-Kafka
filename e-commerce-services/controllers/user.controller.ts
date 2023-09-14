import jwt from 'jsonwebtoken'
import { Request, Response } from "express";

import User from '../models/users.model'
import Notification from '../models/notification.model';
import Delivery from '../models/delivery.model';
import Product from '../models/product.model';
import SaleOperation from '../models/saleOperation.model';
import { publishEvent } from '../utils/publish-event.util';
import { runConsumerSoldProduct } from '../../messaging/consumer/soldProduct';

// --------------------------------------------- create user ---------------------------------------------


const createUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password,role } = req.body;
        for (const field in req.body) {
            if (!req.body[field] || req.body[field].trim() === '') return res.status(400).send({ error: `${field} cannot be empty.` });
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailRegex.test(email)) return res.status(400).send({ error: 'Invalid email format.' });
        const existingUser = await User.findOne({ email: email });
        if (existingUser) return res.status(400).send({ error: 'This email already exists.' });
        const newUser = new User({userName,email,password,role});
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const credential = {
            token: token,
            user: newUser
        };
        res.header('Authorization', token);
        res.status(201).send({ message: 'User created and logged in successfully.', credential });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while creating the user.' });
    };
};


// --------------------------------------------- login user ---------------------------------------------


const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        for (const field in req.body) {
            if (!req.body[field] || req.body[field].trim() === '') return res.status(400).send({ error: `${field} cannot be empty.` });
        }
        const userAuthentication = await User.findOne({ email: email });
        if (!userAuthentication) return res.status(400).send({ error: 'Invalid email or password.' });
        const isPasswordValid = await userAuthentication.isValidPassword(password);
        if (!isPasswordValid) return res.status(400).send({ error: 'Invalid email or password.' });
        const token = jwt.sign({ id: userAuthentication._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const credential = {
            token: token,
            user: userAuthentication
        };
        res.header('Authorization', token);
        publishEvent('user_logged', credential);
        res.status(200).send({ message: 'User logged in successfully.', credential: credential });
    } catch (error) {
        res.status(400).send({message : `Error logging in user: ${error.message}`});
    };
};


// --------------------------------------------- get user by id ---------------------------------------------


const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).send({ error: 'User not found.' });
        publishEvent('user_details', user);
        res.status(200).send({ user: user });
    } catch (error) {
        res.status(400).send({message : `Error getting user by id: ${error.message}`});
    };
};


// --------------------------------------------- update user ---------------------------------------------


const updateUserData = async (req: Request, res: Response) => {
    try {
        let userUpdating = await User.findById(req.user._id);
        const { password, ...updateFields } = req.body;
        if (password) return res.status(400).send({ error: "Sorry, you can't change password from here" });
        const updateObject = {};
        for (const field in updateFields) {  
            const fieldValue = updateFields[field].trim();
            if (fieldValue === '') return res.status(400).send({ error: `${field} cannot be empty.` });
            if (field === 'email') {
                const checkedEmail = await User.findOne({ email: fieldValue }).select('-password');
                if (checkedEmail) return res.status(400).send({ error: 'This email already exists' });
            };
            updateObject[field] = fieldValue;
        };
        await userUpdating.updateOne(updateObject);

        res.status(202).send({ message: 'User Data Updated Successfully', user: userUpdating });
    } catch (error) {
        res.status(400).send({message : `Error updating user: ${error.message}`});
    };
};


// --------------------------------------------- update user password ---------------------------------------------


const updatePassword = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        for (const field in req.body) {
            if (req.body[field].trim() === '') {
                return res.status(400).send({ error: `${field} cannot be empty.` });
            }
        }
        if (req.body.oldPassword === req.body.newPassword) return res.status(400).send({ error: 'New password cannot be the same as the old password.' });
        const oldPasswordValid = await user.isValidPassword(req.body.oldPassword);
        if (!oldPasswordValid) return res.status(400).send({ error: 'Invalid old password.' });
        user.password = req.body.newPassword;
        const newData = await user.save();
        res.status(200).send({ message: 'User Password Updated Successfully', user: user });
    } catch (error) {
        res.status(400).send({message : `Error updating user: ${error.message}`});
    };
};


// --------------------------------------------- notify new product ---------------------------------------------


const getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id });
        if (!notifications || notifications.length === 0) return res.status(404).send({ message: 'No notifications found' });
        notifications.forEach(notification => notification.read = true);
        const savedNotifications = await Promise.all(notifications.map(notification => notification.save()));
        return res.status(200).send({ notifications: savedNotifications });
    } catch (error) {
        res.status(400).send({message : `Error creating and publishing notification: ${error.message}`});
    };
};


// ----------------------------- delivery Sold Product -----------------------------------


const getDelivery = async (req: Request, res: Response) => {
    try {
        const delivery = await Delivery.findOne({ userId: req.user._id });
        if (!delivery) return res.status(404).send({ message: 'not found delivery' });
        return res.status(200).send({ delivery: delivery });
    } catch (error) {
        res.status(400).send({message : `Error creating and publishing delivery: ${error.message}`});
    };
};


// ----------------------------- buy Product -----------------------------------


const buyProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) return res.status(404).send({ message: 'not found product' });
        if (product.stock === 0) return res.status(404).send({ message: 'product is out of stock' });
        if (req.body.stock <= 0) return res.status(400).send({ message: 'Product stock is not available now' });
        if (req.body.quantity === undefined || req.body.quantity <= 0) return res.status(400).send({ message: 'Quantity must be a positive number' });
        if (req.body.quantity > product.stock) return res.status(400).send({ message: 'Insufficient stock for the requested quantity' });
        // payment 
        product.stock -= req.body.quantity;
        await product.save();

        const newSaleOperation = new SaleOperation({
            user: req.user._id,
            product: product._id,
            quantity: req.body.quantity,
        });
        const savedOperation = await newSaleOperation.save();
        if (savedOperation) {
            publishEvent('product_sold', newSaleOperation);
            runConsumerSoldProduct();
        };
        return res.status(200).json({ message: 'the process was been successfully', operation: newSaleOperation });
    } catch (error) {
        return res.status(error.status || 500).send({ error: error.message || 'internal server error' });
    };
};


export default {
    createUser,
    loginUser,
    getUserById,
    updateUserData,
    updatePassword,
    getNotifications,
    getDelivery,
    buyProduct,
}
