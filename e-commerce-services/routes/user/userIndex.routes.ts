import { Router } from "express";

import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"

import { getCurrentUser } from '../../middlewares/get-currentUser.middleware';


const router = Router();


router.use('/auth', authRoutes);

router.use(getCurrentUser);
router.use('/user', userRoutes);



export default router;