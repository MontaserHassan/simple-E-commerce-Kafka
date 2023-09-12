const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const { getCurrentUser } = require('../../middlewares/get-currentUser.middleware');


const router = express.Router();


router.use('/auth', authRoutes);

router.use(getCurrentUser);
router.use('/user', userRoutes);



module.exports = router;