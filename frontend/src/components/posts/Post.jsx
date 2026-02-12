import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Post = ({ post, onDelete }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.likes?.some(like => like.user === user?._id) || false);
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [isAdminReplyMode, setIsAdminReplyMode] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    const handleLike = async () => {
        try {
            const res = await fetch(`/api/posts/${post._id}/like`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                setLiked(!liked);
                setLikeCount(prev => liked ? prev - 1 : prev + 1);
                if (!liked) toast.success('Post liked!');
            }
        } catch (error) {
            console.error('Error liking post:', error);
            toast.error('Failed to like post');
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (res.ok) {
                toast.success('Post deleted successfully');
                if (onDelete) onDelete(post._id);
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Error deleting post');
        }
    };

    const fetchComments = async () => {
        if (showComments) {
            setShowComments(false);
            return;
        }

        setLoadingComments(true);
        try {
            const res = await fetch(`/api/posts/${post._id}/comments`);
            const data = await res.json();
            setComments(data);
            setShowComments(true);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        const endpoint = isAdminReplyMode
            ? `/api/posts/${post._id}/comments/admin`
            : `/api/posts/${post._id}/comments`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ content: commentContent }),
            });

            if (res.ok) {
                const newComment = await res.json();
                const populatedComment = {
                    ...newComment,
                    user: user
                };
                setComments([...comments, populatedComment]);
                setCommentContent('');
                setIsAdminReplyMode(false);
                toast.success('Comment added!');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            const res = await fetch(`/api/posts/${post._id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                setComments(comments.filter(c => c._id !== commentId));
                toast.success('Comment deleted');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const res = await fetch(`/api/posts/${post._id}/comments/${commentId}/like`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (res.ok) {
                const updatedLikes = await res.json();
                setComments(comments.map(c => {
                    if (c._id === commentId) {
                        return { ...c, likes: updatedLikes };
                    }
                    return c;
                }));
            }
        } catch (error) {
            console.error('Error liking comment:', error);
            toast.error('Failed to like comment');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={post.user?.profilePic || 'https://via.placeholder.com/40'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900">{post.user?.name || 'Unknown User'}</h3>
                            <p className="text-gray-500 text-xs">
                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    {/* Actions Menu */}
                    <div className="flex items-center gap-2">
                        {(user?._id === post.user?._id || user?.isAdmin) && (
                            <button
                                onClick={handleDeletePost}
                                className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                                title="Delete Post"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

                {post.image && (
                    <div className="relative -mx-4 mb-4">
                        <img
                            src={post.image}
                            alt="Post content"
                            className="w-full h-auto object-cover max-h-[500px]"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            <Heart size={20} fill={liked ? "currentColor" : "none"} />
                            <span className="text-sm font-medium">{likeCount}</span>
                        </button>
                        <button
                            onClick={fetchComments}
                            className={`flex items-center gap-2 transition-colors ${showComments ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                        >
                            <MessageCircle size={20} />
                            <span className="text-sm font-medium">Comment</span>
                        </button>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-gray-50"
                        >
                            {/* Comment Input */}
                            {user ? (
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <div className="flex gap-3">
                                        <img
                                            src={user.pic || 'https://via.placeholder.com/32'}
                                            alt="User"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                placeholder={isAdminReplyMode ? "Write an official reply..." : "Write a comment..."}
                                                className={`w-full px-4 py-2 rounded-2xl bg-gray-50 border focus:outline-none transition-all ${isAdminReplyMode ? 'border-red-200 focus:ring-2 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-100'}`}
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                {user.isAdmin && (
                                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                                                        <input
                                                            type="checkbox"
                                                            checked={isAdminReplyMode}
                                                            onChange={(e) => setIsAdminReplyMode(e.target.checked)}
                                                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                        />
                                                        <ShieldCheck size={14} className={isAdminReplyMode ? "text-red-600" : "text-gray-400"} />
                                                        Post as Admin Reply
                                                    </label>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={!commentContent.trim()}
                                                    className={`ml-auto p-2 rounded-full transition-colors ${!commentContent.trim() ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : (isAdminReplyMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700')}`}
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <p className="text-center text-sm text-gray-500 mb-4">Log in to comment</p>
                            )}

                            {/* Comments List */}
                            {loadingComments ? (
                                <div className="text-center py-4 text-gray-500 text-sm">Loading comments...</div>
                            ) : comments.length > 0 ? (
                                <div className="space-y-4">
                                    {comments.map((comment) => {
                                        const isCommentLiked = comment.likes?.some(l => l.user === user?._id);
                                        return (
                                            <div key={comment._id} className={`flex gap-3 ${comment.isAdminReply ? 'bg-red-50 p-3 rounded-lg border border-red-100' : ''}`}>
                                                <img
                                                    src={comment.user?.profilePic || 'https://via.placeholder.com/32'}
                                                    alt={comment.user?.name}
                                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-semibold text-sm ${comment.isAdminReply ? 'text-red-700' : 'text-gray-900'}`}>
                                                                {comment.user?.name}
                                                            </span>
                                                            {comment.isAdminReply && (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                                                    <ShieldCheck size={10} /> Admin
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleLikeComment(comment._id)}
                                                                className={`flex items-center gap-1 text-xs transition-colors p-1 ${isCommentLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                                            >
                                                                <Heart size={14} fill={isCommentLiked ? "currentColor" : "none"} />
                                                                {comment.likes?.length > 0 && <span>{comment.likes.length}</span>}
                                                            </button>
                                                            {(user?._id === comment.user?._id || user?.isAdmin) && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                                    title="Delete comment"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className={`text-sm mt-1 leading-relaxed ${comment.isAdminReply ? 'text-gray-800' : 'text-gray-700'}`}>{comment.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-sm italic">No comments yet.</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Post;
