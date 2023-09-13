import { Router } from "express";

import { userController } from '../../controllers/index.controller'

const router = Router();


router.get('/profile', userController.getUserById);
router.get('/notifications', userController.getNotifications);
router.get('/delivery', userController.getDelivery);
router.post('/:id', userController.buyProduct);
router.patch('/', userController.updateUserData);
router.patch('/password', userController.updatePassword);



export default router;