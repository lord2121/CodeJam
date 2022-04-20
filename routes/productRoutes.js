const productController = require('../controllers/productController.js');
const express = require('express');
const router = express.Router();

router.get('/all' , productController.getAllProducts);
router.post('/post' , productController.postProduct);
router.get('/:id' , productController.getProduct);

module.exports = router