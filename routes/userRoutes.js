const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

/* define routes */
router.post('/signup', userController.signup);

router.post('/signin', userController.signin);
router.get('/view-orders', userController.viewOrders);

module.exports = router;
