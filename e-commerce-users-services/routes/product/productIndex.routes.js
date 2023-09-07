const express = require('express');

const authProductRoutes = require('./productAuth.routes');
const productRoutes = require('./product.routes');
const { getCurrentUser } = require('../../middlewares/get-currentUser.middleware');


const router = express.Router();


router.use('/', productRoutes);

router.use(getCurrentUser);
router.use('/auth', authProductRoutes);





module.exports = router;