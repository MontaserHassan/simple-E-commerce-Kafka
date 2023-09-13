import { Router } from "express";

import productRoutes from './product.routes'

const router = Router();


router.use('/', productRoutes);



export default router;