import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, ShieldCheck, Trash2, Clock } from 'lucide-react';
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

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const handleLike = async () => {
        if (!user) {
            toast.error('Login to like posts');
            return;
        }
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
                toast.success(isAdminReplyMode ? 'Admin reply posted!' : 'Comment added!');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
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
        if (!user) return;
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
        }
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden group">
            <div className="p-5">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={post.user?.profilePic || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-[15px]">{post.user?.name || 'Unknown User'}</h3>
                            <div className="flex items-center gap-1 text-gray-400">
                                <Clock size={12} />
                                <span className="text-xs">{timeAgo(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Actions Menu */}
                    <div className="flex items-center gap-1">
                        {(user?._id === post.user?._id || user?.isAdmin) && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleDeletePost}
                                className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                                title="Delete Post"
                            >
                                <Trash2 size={18} />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 mb-4 leading-relaxed text-[15px]">{post.content}</p>

                {post.image && (
                    <div className="relative -mx-5 mb-4">
                        <img
                            src={post.image}
                            alt="Post content"
                            className="w-full h-auto object-cover max-h-[500px]"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Interaction Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100/80">
                    <div className="flex gap-1">
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${liked ? 'text-red-500 bg-red-50/80' : 'text-gray-400 hover:text-red-500 hover:bg-red-50/50'}`}
                        >
                            <motion.div
                                animate={liked ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart size={20} fill={liked ? "currentColor" : "none"} />
                            </motion.div>
                            <span className="text-sm font-semibold">{likeCount}</span>
                        </motion.button>
                        <button
                            onClick={fetchComments}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${showComments ? 'text-indigo-600 bg-indigo-50/80' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50/50'}`}
                        >
                            <MessageCircle size={20} />
                            <span className="text-sm font-semibold">Comment</span>
                        </button>
                    </div>
                    <button className="text-gray-300 hover:text-gray-500 transition-colors p-2 rounded-xl hover:bg-gray-50">
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-gray-100/80"
                        >
                            {/* Comment Input */}
                            {user ? (
                                <form onSubmit={handleCommentSubmit} className="mb-5">
                                    <div className="flex gap-3">
                                        <img
                                            src={user.pic || 'https://via.placeholder.com/32'}
                                            alt="User"
                                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                placeholder={isAdminReplyMode ? "Write an official admin reply..." : "Write a comment..."}
                                                className={`w-full px-4 py-2.5 rounded-2xl border text-sm focus:outline-none transition-all duration-200 ${isAdminReplyMode
                                                        ? 'border-amber-200 focus:ring-2 focus:ring-amber-100 bg-amber-50/50 placeholder-amber-400'
                                                        : 'border-gray-200 focus:ring-2 focus:ring-indigo-100 bg-gray-50/50 placeholder-gray-400'
                                                    }`}
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                {user.isAdmin && (
                                                    <label className="flex items-center gap-2 cursor-pointer text-xs transition-colors group">
                                                        <input
                                                            type="checkbox"
                                                            checked={isAdminReplyMode}
                                                            onChange={(e) => setIsAdminReplyMode(e.target.checked)}
                                                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                                        />
                                                        <ShieldCheck size={14} className={isAdminReplyMode ? "text-amber-600" : "text-gray-400"} />
                                                        <span className={isAdminReplyMode ? 'text-amber-700 font-semibold' : 'text-gray-500'}>
                                                            Reply as Admin
                                                        </span>
                                                    </label>
                                                )}
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    type="submit"
                                                    disabled={!commentContent.trim()}
                                                    className={`ml-auto p-2.5 rounded-xl transition-all duration-200 ${!commentContent.trim()
                                                            ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                                            : (isAdminReplyMode
                                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                                                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20')
                                                        }`}
                                                >
                                                    <Send size={14} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <p className="text-center text-sm text-gray-400 mb-4 py-2">Log in to comment</p>
                            )}

                            {/* Comments List */}
                            {loadingComments ? (
                                <div className="text-center py-4">
                                    <div className="w-6 h-6 rounded-full border-2 border-indigo-100 border-t-indigo-500 animate-spin mx-auto" />
                                </div>
                            ) : comments.length > 0 ? (
                                <div className="space-y-3">
                                    {comments.map((comment) => {
                                        const isCommentLiked = comment.likes?.some(l => l.user === user?._id);
                                        return (
                                            <motion.div
                                                key={comment._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex gap-3 p-3 rounded-xl transition-all ${comment.isAdminReply
                                                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 shadow-sm'
                                                        : 'hover:bg-gray-50/50'
                                                    }`}
                                            >
                                                <img
                                                    src={comment.user?.profilePic || comment.user?.pic || 'https://via.placeholder.com/32'}
                                                    alt={comment.user?.name}
                                                    className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${comment.isAdminReply ? 'border-2 border-amber-300 shadow-sm' : 'border border-gray-100'
                                                        }`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`font-semibold text-sm ${comment.isAdminReply ? 'text-amber-800' : 'text-gray-900'
                                                                }`}>
                                                                {comment.user?.name}
                                                            </span>
                                                            {comment.isAdminReply && (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                                                    <ShieldCheck size={10} /> Official Reply
                                                                </span>
                                                            )}
                                                            <span className="text-[11px] text-gray-400">
                                                                {timeAgo(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleLikeComment(comment._id)}
                                                                className={`flex items-center gap-1 text-xs transition-colors p-1.5 rounded-lg ${isCommentLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                                                                    }`}
                                                            >
                                                                <Heart size={13} fill={isCommentLiked ? "currentColor" : "none"} />
                                                                {comment.likes?.length > 0 && <span className="font-medium">{comment.likes.length}</span>}
                                                            </button>
                                                            {(user?._id === comment.user?._id || user?.isAdmin) && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg"
                                                                    title="Delete comment"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className={`text-sm mt-1 leading-relaxed ${comment.isAdminReply ? 'text-amber-900/80' : 'text-gray-600'
                                                        }`}>
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    <MessageCircle className="mx-auto mb-2 text-gray-200" size={24} />
                                    No comments yet. Be the first!
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Post;
