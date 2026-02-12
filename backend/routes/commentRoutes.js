const express = require('express');
const router = express.Router({ mergeParams: true });
const { createComment, getComments, adminReply, deleteComment, likeComment } = require('../controllers/commentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createComment).get(getComments);
router.route('/admin').post(protect, admin, adminReply);
router.route('/:id').delete(protect, deleteComment);
router.route('/:id/like').put(protect, likeComment);

module.exports = router;
