const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Render Register Form
router.get('/register', (req, res) => {
  res.render('register', { layout: false });
});

// Handle Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error', 'A user with that email already exists.');
      return res.redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters long.');
      return res.redirect('/register');
    }

    user = new User({ name, email, password });
    await user.save();
    
    req.flash('success', 'Successfully registered! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong during registration.');
    res.redirect('/register');
  }
});

// Render Login Form
router.get('/login', (req, res) => {
  res.render('login', { layout: false });
});

// Handle Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // Set session user
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong during login.');
    res.redirect('/login');
  }
});

// Handle Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    // Cannot use req.flash here since session is destroyed
    res.redirect('/login');
  });
});

module.exports = router;
