const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.use(staffController.requireStaff);

router.get('/orders', staffController.listOrders);
router.post('/update-status/:id', staffController.updateStatus);
router.get('/production-plan', staffController.productionPlan);

module.exports = router;