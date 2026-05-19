const express = require('express');
const router = express.Router();
const Order = require('../../../../models/Order');
const Product = require('../../../../models/Product');

router.get('/', async (req, res) => {
  try {
    // 1. Calculate Total Revenue
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 2. Calculate Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Top-Selling Product
    const topSellingResult = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } }
    ]);

    const topProduct = topSellingResult.length > 0 && topSellingResult[0].productInfo
      ? { name: topSellingResult[0].productInfo.name, quantity: topSellingResult[0].totalQuantity }
      : { name: "N/A", quantity: 0 };

    res.json({
      totalRevenue,
      totalOrders,
      topProduct
    });
  } catch (error) {
    console.error('Error fetching API sales data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
