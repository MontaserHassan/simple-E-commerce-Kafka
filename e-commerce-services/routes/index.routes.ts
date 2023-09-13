import { Router } from "express";

const userRoutes = require('./user/userIndex.routes');
const productRoutes = require('./product/productIndex.routes');


const router = Router();


router.use('/product', productRoutes);

router.use('/', userRoutes);



module.exports = router;