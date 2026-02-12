const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { content, image } = req.body;

    if (!content) {
        res.status(400);
        throw new Error('Please add content to your post');
    }

    const post = await Post.create({
        user: req.user._id,
        content,
        image,
    });

    res.status(201).json(post);
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('user', 'name profilePic').sort({ createdAt: -1 });
    res.json(posts);
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('user', 'name profilePic');

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.likes.find((like) => like.user.toString() === req.user._id.toString())) {
            post.likes = post.likes.filter((like) => like.user.toString() !== req.user._id.toString());
        } else {
            post.likes.unshift({ user: req.user._id });
        }

        await post.save();
        res.json(post.likes);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        console.log('DeletePost Debug:');
        console.log('Post User:', post.user.toString());
        console.log('Req User:', req.user._id.toString());
        console.log('Is Admin:', req.user.isAdmin);

        if (post.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

module.exports = { createPost, getPosts, getPostById, likePost, deletePost };
