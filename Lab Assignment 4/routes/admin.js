const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Admin Dashboard
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('admin/dashboard', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Render Add Product Form
router.get('/products/new', (req, res) => {
  res.render('admin/add-product');
});

// Handle Add Product
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;
    const newProduct = new Product({
      name,
      price,
      category,
      stock,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    await newProduct.save();
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Render Edit Product Form
router.get('/products/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.render('admin/edit-product', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Handle Edit Product
router.post('/products/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;
    const updateData = { name, price, category, stock, description };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Handle Delete Product
router.post('/products/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
