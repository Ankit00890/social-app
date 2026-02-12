const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
        },
        isAdminReply: {
            type: Boolean,
            default: false,
        },
        likes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
