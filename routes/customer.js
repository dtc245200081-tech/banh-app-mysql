const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.use(customerController.requireCustomer);

router.get('/products', customerController.showProducts);
router.post('/add-to-cart', customerController.addToCart);
router.get('/cart', customerController.showCart);
router.post('/update-cart/:index', customerController.updateCart);
router.get('/remove-from-cart/:index', customerController.removeFromCart);
router.post('/place-order', customerController.placeOrder);
router.get('/my-orders', customerController.myOrders);
router.get('/cancel-order/:id', customerController.cancelOrder);

module.exports = router;