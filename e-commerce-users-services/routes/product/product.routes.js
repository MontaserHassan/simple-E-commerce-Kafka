const express = require('express');


const { productController } = require('../../controllers/index.controller');


const router = express.Router();


router.get('/', productController.getProducts);





module.exports = router;