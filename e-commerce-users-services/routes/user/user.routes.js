const express = require('express');

const { userController } = require('../../controllers/index.controller');


const router = express.Router();


router.get('/profile', userController.getUserById);
router.get('/notifications', userController.getNotifications);
router.get('/delivery', userController.getDelivery);
router.patch('/', userController.updateUserData);
router.patch('/password', userController.updatePassword);



module.exports = router;