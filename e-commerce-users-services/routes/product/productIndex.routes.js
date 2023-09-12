const express = require('express');

const productRoutes = require('./product.routes');


const router = express.Router();


router.use('/', productRoutes);



module.exports = router;