import { Router } from "express";
const productRoutes = require('./product.routes');


const router = Router();


router.use('/', productRoutes);



module.exports = router;