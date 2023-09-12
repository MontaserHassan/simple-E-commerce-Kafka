const express = require('express');

const { userController } = require('../../controllers/index.controller');


const router = express.Router();


router.post('/sign-up', userController.createUser);
router.post('/login', userController.loginUser);



module.exports = router;