import { Router } from "express";

import productRoutes from "./product/productIndex.routes"
import userRoutes from "./user/userIndex.routes"

const router = Router();


router.use('/product', productRoutes);
router.use('/', userRoutes);



export default router;