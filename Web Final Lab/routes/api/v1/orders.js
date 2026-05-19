const express = require('express');
const router = express.Router();
const Order = require('../../../models/Order');
const Product = require('../../../models/Product');
const { verifyToken } = require('../../../middleware/apiAuth');

// POST /api/v1/orders
router.post('/', verifyToken, async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of products.' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
      }

      const quantity = item.quantity || 1;
      const price = product.price;

      totalAmount += price * quantity;
      
      orderItems.push({
        product: product._id,
        quantity,
        price
      });
    }

    const newOrder = new Order({
      user: req.user.user_id, // decoded from JWT payload
      products: orderItems,
      totalAmount
    });

    await newOrder.save();
    
    // Optionally populate product details
    await newOrder.populate('products.product', 'name price');

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
