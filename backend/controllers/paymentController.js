const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createPaymentOrder = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        const razorpayInstance = getRazorpayInstance();
        
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${orderId}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Update sequence in our DB
        const dbOrder = await Order.findById(orderId);
        if(dbOrder) {
            dbOrder.razorpayOrderId = razorpayOrder.id;
            await dbOrder.save();
        }

        res.status(200).json({
            success: true,
            order: razorpayOrder,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update order status in DB
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'Completed';
                order.razorpayPaymentId = razorpay_payment_id;
                await order.save();
                res.status(200).json({ success: true, message: 'Payment verified successfully' });
            } else {
                res.status(404).json({ success: false, message: 'Order not found' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentOrder, verifyPayment };
