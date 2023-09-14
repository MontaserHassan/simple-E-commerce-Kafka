import { Router } from "express";

import { productController } from '../../controllers/index.controller'
import { adminAuth } from "../../middlewares/get-currentUser.middleware";

const router = Router();


router.get('/', productController.getProducts);
router.post('/create', adminAuth, productController.createProduct);



export default router;