const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  stock: {
    type: Number,
    default: 10,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Product', productSchema);
