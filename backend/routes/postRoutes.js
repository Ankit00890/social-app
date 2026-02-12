const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, likePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const commentRouter = require('./commentRoutes');

// Re-route into other resource routers
router.use('/:postId/comments', commentRouter);

router.route('/').post(protect, createPost).get(getPosts);
router.route('/:id').get(getPostById).delete(protect, deletePost);
router.route('/:id/like').put(protect, likePost);

module.exports = router;
