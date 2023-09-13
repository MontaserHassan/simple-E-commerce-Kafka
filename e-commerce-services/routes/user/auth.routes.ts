import { Router } from "express";

const { userController } = require('../../controllers/index.controller');


const router = Router();


router.post('/sign-up', userController.createUser);
router.post('/login', userController.loginUser);



module.exports = router;