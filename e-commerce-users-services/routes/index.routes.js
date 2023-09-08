const express = require('express');

const userRoutes = require('./user/userIndex.routes');
const productRoutes = require('./product/productIndex.routes');


const router = express.Router();


router.use('/product', productRoutes);

router.use('/', userRoutes);



module.exports = router;