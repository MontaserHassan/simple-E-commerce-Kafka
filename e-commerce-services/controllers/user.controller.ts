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
        const { userName, email, password } = req.body;
        for (const field in req.body) {
            if (!req.body[field][0] || req.body[field][0].trim() === '') return res.status(400).send({ error: `${field} cannot be empty.` });
        }
        const existingUser = await User.findOne({ email: email[0] });
        if (existingUser) return res.status(400).send({ error: 'This email already exists.' });
        const newUser = new User({
            userName: userName[0],
            email: email[0],
            password: password[0],
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const credential = {
            token: token,
            user: newUser
        };
        res.header('auth-token', token);
        publishEvent('user_created', credential);
        publishEvent('user_logged', credential);
        res.status(201).send({ message: 'User created and logged in successfully.', credential: credential });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'An error occurred while creating the user.' });
    };
};


// --------------------------------------------- login user ---------------------------------------------


const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        for (const field in req.body) {
            if (!req.body[field] || req.body[field][0].trim() === '') return res.status(400).send({ error: `${field} cannot be empty.` });
        }
        const userAuthentication = await User.findOne({ email: email[0] });
        if (!userAuthentication) return res.status(400).send({ error: 'Invalid email or password.' });
        const isPasswordValid = await userAuthentication.isValidPassword(password[0]);
        if (!isPasswordValid) return res.status(400).send({ error: 'Invalid email or password.' });
        const token = jwt.sign({ id: userAuthentication._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const credential = {
            token: token,
            user: userAuthentication
        };
        res.header('auth-token', token);
        publishEvent('user_logged', credential);
        res.status(200).send({ message: 'User logged in successfully.', credential: credential });
    } catch (error) {
        console.error('Error logging in user:', error);
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
        console.error('Error getting user by id:', error);
    };
};


// --------------------------------------------- update user ---------------------------------------------


const updateUserData = async (req: Request, res: Response) => {
    try {
        let userUpdating = await User.findById(req.user._id);
        const { password, ...updateFields } = req.body;
        const savingPassword = userUpdating.password;
        console.log('savingPassword: ', savingPassword);
        console.log('userUpdating Before: ', userUpdating);
        if (password) return res.status(400).send({ error: "Sorry, you can't change password from here" });
        const updateObject = {};
        for (const field in updateFields) {
            const fieldValue = updateFields[field][0].trim();
            if (fieldValue === '') return res.status(400).send({ error: `${field} cannot be empty.` });
            if (field === 'email') {
                const checkedEmail = await User.findOne({ email: fieldValue }).select('-password');
                if (checkedEmail) return res.status(400).send({ error: 'This email already exists' });
            };
            updateObject[field] = fieldValue;
        };
        await userUpdating.updateOne(updateObject);
        console.log('userUpdating After: ', userUpdating);
        publishEvent('user_updated', userUpdating);
        res.status(202).send({ message: 'User Data Updated Successfully', user: userUpdating });
    } catch (error) {
        console.error('Error updating user:', error);
    };
};


// --------------------------------------------- update user password ---------------------------------------------


const updatePassword = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        for (const field in req.body) {
            if (req.body[field][0].trim() === '') {
                return res.status(400).send({ error: `${field} cannot be empty.` });
            }
        }
        console.log('userBefore: ', user);
        if (req.body.oldPassword[0] === req.body.newPassword[0]) return res.status(400).send({ error: 'New password cannot be the same as the old password.' });
        const oldPasswordValid = await user.isValidPassword(req.body.oldPassword[0]);
        if (!oldPasswordValid) return res.status(400).send({ error: 'Invalid old password.' });
        // const newPasswordValid = await user.isValidPassword(req.body.newPassword[0]);
        // console.log(newPasswordValid);
        // if (newPasswordValid) return res.status(400).send({ error: 'New password cannot be the same as the old password.' });
        user.password = req.body.newPassword[0];
        const newData = await user.save();
        console.log('userAfter: ', user);
        console.log('newData: ', newData);
        publishEvent('user_updated_password', user);
        res.status(200).send({ message: 'User Password Updated Successfully', user: user });
    } catch (error) {
        console.error('Error updating user:', error);
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
        console.error('Error creating and publishing notification:', error);
        return res.status(error.status).send(error.message);
    };
};


// ----------------------------- delivery Sold Product -----------------------------------


const getDelivery = async (req: Request, res: Response) => {
    try {
        const delivery = await Delivery.findOne({ userId: req.user._id });
        if (!delivery) return res.status(404).send({ message: 'not found delivery' });
        return res.status(200).send({ delivery: delivery });
    } catch (error) {
        console.error('Error creating and publishing delivery:', error);
        return res.status(error.status).send(error.message);
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
        console.log(req.user._id);

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
        console.error('Error creating and publishing delivery:', error);
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
