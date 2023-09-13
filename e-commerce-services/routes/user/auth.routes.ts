import { Router } from "express";

import { userController } from '../../controllers/index.controller';


const router = Router();


router.post('/sign-up', userController.createUser);
router.post('/login', userController.loginUser);



export default router;