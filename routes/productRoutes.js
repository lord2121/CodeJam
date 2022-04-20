const productController = require('../controllers/productController.js');
const express = require('express');
const router = express.Router();

router.get('/:id' , productController.getProduct);
router.post('/')

module.exports = router