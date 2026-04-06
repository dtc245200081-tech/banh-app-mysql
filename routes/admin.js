const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.use(adminController.requireAdmin);

// Products
router.get('/products', adminController.listProducts);
router.post('/products/add', adminController.addProduct);
router.post('/products/edit/:id', adminController.editProduct);
router.post('/products/delete/:id', adminController.deleteProduct);

// Users
router.get('/users', adminController.listUsers);
router.post('/users/add', adminController.addUser);
router.post('/users/delete/:id', adminController.deleteUser);

// Debts
router.get('/debts', adminController.listDebts);
router.post('/debts/pay/:orderId', adminController.payDebt);

// Reports
router.get('/reports', adminController.reports);

// Settings
router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.updateSettings);

module.exports = router;