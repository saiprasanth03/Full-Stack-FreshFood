const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/user').get(protect, getUserOrders);

router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
