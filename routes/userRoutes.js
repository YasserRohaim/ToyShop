const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const authMiddleWare=require('../middleware/auth')

/* define routes */
router.post('/signup', userController.signup);

router.post('/signin', userController.signin);
router.get('/view-orders', authMiddleWare, userController.viewOrders);
router.get('/view-orders/:order-id', authMiddleWare, userController.viewOrderItems);

router.get('/user-profile',authMiddleWare, userController.viewProfile);

module.exports = router;
