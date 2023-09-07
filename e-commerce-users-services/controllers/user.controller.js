const jwt = require('jsonwebtoken');

const { User } = require('../models/users.model');
const { Notification } = require('../models/notification.model');
const { publishUserEvent } = require('../utils/publish-event.util');
const { consumer } = require('../../messaging/consumer-services-messaging-notifyUser');
const { Delivery } = require('../models/delivery.model');



// --------------------------------------------- create user ---------------------------------------------


const createUser = async (req, res) => {
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
        publishUserEvent('user_created', credential);
        publishUserEvent('user_logged', credential);
        res.status(201).send({ message: 'User created and logged in successfully.', credential: credential });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'An error occurred while creating the user.' });
    };
};


// --------------------------------------------- login user ---------------------------------------------


const loginUser = async (req, res) => {
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
        publishUserEvent('user_logged', credential);
        res.status(200).send({ message: 'User logged in successfully.', credential: credential });
    } catch (error) {
        console.error('Error logging in user:', error);
    };
};


// --------------------------------------------- get user by id ---------------------------------------------


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).send({ error: 'User not found.' });
        publishUserEvent('user_details', user);
        res.status(200).send({ user: user });
    } catch (error) {
        console.error('Error getting user by id:', error);
    };
};


// --------------------------------------------- update user ---------------------------------------------


const updateUserData = async (req, res) => {
    try {
        let userUpdating = await User.findById(req.user.id);
        const { password, ...updateFields } = req.body; // Exclude password from updateFields
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
        publishUserEvent('user_updated', userUpdating);
        res.status(202).send({ message: 'User Data Updated Successfully', user: userUpdating });
    } catch (error) {
        console.error('Error updating user:', error);
    };
};


// --------------------------------------------- update user ---------------------------------------------


const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
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
        publishUserEvent('user_updated_password', user);
        res.status(200).send({ message: 'User Password Updated Successfully', user: user });
    } catch (error) {
        console.error('Error updating user:', error);
    };
};

// --------------------------------------------- notify new product ---------------------------------------------

const getNotifications = async (req, res, next) => {
    try {
        console.log(req.user);
        const notifications = await Notification.findOne({ userId: req.user.id });
        if (!notifications) return res.status(404).send({ message: 'not found notifications' });
        return res.status(200).send({ notifications: notifications });
    } catch (error) {
        console.error('Error creating and publishing notification:', error);
        return res.status(error.status).send(error.message);
    }
};
// -----------------------------Delivery Sold Product-----------------------------------

const getDelivery = async (req, res, next) => {
    try {
        const delivery = await Delivery.findOne({ userId: req.user.id });
        if (!delivery) return res.status(404).send({ message: 'not found delivery' });
        return res.status(200).send({ delivery });
    } catch (error) {
        console.error('Error creating and publishing delivery:', error);
        return res.status(error.status).send(error.message);
    }
};


module.exports = {
    createUser,
    loginUser,
    getUserById,
    updateUserData,
    updatePassword,
    getNotifications,
    getDelivery
};