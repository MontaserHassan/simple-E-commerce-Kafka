const express = require('express');

const userRoutes = require('./user/userIndex.routes');
const productRoutes = require('./product/productIndex.routes');


const router = express.Router();


router.use('/', userRoutes);
router.use('/product', productRoutes);



module.exports = router;