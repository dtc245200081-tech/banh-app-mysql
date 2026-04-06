const express = require('express');
const router = express.Router();
const { Product } = require('../models');

router.get('/', async (req, res) => {
  const products = await Product.findAll({ limit: 3 });
  res.render('index', { products });
});

module.exports = router;