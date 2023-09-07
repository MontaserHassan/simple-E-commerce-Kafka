const express = require('express');


const { productController } = require('../../controllers/index.controller');
const { getCurrentUser } = require('../../middlewares/get-currentUser.middleware');



const router = express.Router();


router.use(getCurrentUser);

router.post('/buyProduct', productController.buyProduct);
router.post('/refundProduct', productController.refundProduct);



module.exports = router;