import { Router } from "express";

import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"

import { getCurrentUser, userAuth } from '../../middlewares/get-currentUser.middleware';


const router = Router();


router.use('/auth', authRoutes);

router.use(userAuth);
router.use('/user', userRoutes);



export default router;