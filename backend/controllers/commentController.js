const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create a comment
// @route   POST /api/posts/:postId/comments
// @access  Private
const createComment = async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comment = await Comment.create({
        post: req.params.postId,
        user: req.user._id,
        content,
        isAdminReply: false,
    });

    res.status(201).json(comment);
};

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'name profilePic isAdmin');
    res.json(comments);
};

// @desc    Reply as Admin
// @route   POST /api/posts/:postId/comments/admin
// @access  Private/Admin
const adminReply = async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comment = await Comment.create({
        post: req.params.postId,
        user: req.user._id,
        content,
        isAdminReply: true,
    });

    res.status(201).json(comment);
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:postId/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
        if (
            comment.user.toString() !== req.user._id.toString() &&
            !req.user.isAdmin
        ) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
};

// @desc    Like a comment
// @route   PUT /api/posts/:postId/comments/:id/like
// @access  Private
const likeComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
        if (comment.likes.find((like) => like.user.toString() === req.user._id.toString())) {
            comment.likes = comment.likes.filter((like) => like.user.toString() !== req.user._id.toString());
        } else {
            comment.likes.unshift({ user: req.user._id });
        }

        await comment.save();
        res.json(comment.likes);
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
};

module.exports = { createComment, getComments, adminReply, deleteComment, likeComment };
