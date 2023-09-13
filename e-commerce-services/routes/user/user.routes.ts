import { Router } from "express";

const { userController } = require('../../controllers/index.controller');


const router = Router();


router.get('/profile', userController.getUserById);
router.get('/notifications', userController.getNotifications);
router.get('/delivery', userController.getDelivery);
router.post('/:id', userController.buyProduct);
router.patch('/', userController.updateUserData);
router.patch('/password', userController.updatePassword);



module.exports = router;