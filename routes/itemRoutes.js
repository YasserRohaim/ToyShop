const express = require('express');
const router = express.Router();

//import controllers
const itemsController = require('../controllers/ItemsController');

/* define routes */
router.get('/', itemsController.getItems);
router.get('/:item_id', itemsController.getItemByID);

// define route to catch the items under which brand
router.get('/brand/:brand', itemsController.getItemsByBrand);

router.get('/search', itemsController.search);


module.exports = router;
    

