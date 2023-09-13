import { Router } from "express";

import { productController } from '../../controllers/index.controller'

const router = Router();


router.get('/', productController.getProducts);
router.post('/create', productController.createProduct);



export default router;