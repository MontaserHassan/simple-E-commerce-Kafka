const express = require('express');


const { productController } = require('../../controllers/index.controller');


const router = express.Router();


router.get('/', productController.getProducts);
router.post('/create', productController.createProduct);



module.exports = router;