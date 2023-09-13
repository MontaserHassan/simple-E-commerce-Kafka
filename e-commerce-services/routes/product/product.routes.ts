import { Router } from "express";

const { productController } = require('../../controllers/index.controller');


const router = Router();


router.get('/', productController.getProducts);
router.post('/create', productController.createProduct);



module.exports = router;