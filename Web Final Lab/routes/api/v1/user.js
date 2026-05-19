const express = require('express');
const router = express.Router();
const User = require('../../../models/User');
const { verifyToken } = require('../../../middleware/apiAuth');

// GET /api/v1/user/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // req.user is appended by verifyToken middleware (contains user_id and role)
    const user = await User.findById(req.user.user_id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
