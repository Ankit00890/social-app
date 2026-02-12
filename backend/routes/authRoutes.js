const express = require('express');
const router = express.Router();
const { authUser, registerUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, (req, res) => res.send(req.user)).put(protect, updateUserProfile);

module.exports = router;
