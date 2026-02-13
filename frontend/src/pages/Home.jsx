import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Post from '../components/posts/Post';
import { Image, Send, Sparkles, TrendingUp, Users, Flame, Hash, Bookmark, Calendar, Link2, Upload, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { API_BASE } from '../services/api';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [postImage, setPostImage] = useState('');
    const [showPhotoMenu, setShowPhotoMenu] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_BASE}/posts`);
            const data = await res.json();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostSubmit = async () => {
        if (!content.trim() && !postImage) return;

        setIsPosting(true);
        try {
            const body = { content };
            if (postImage) body.image = postImage;

            const res = await fetch(`${API_BASE}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setContent('');
                setPostImage('');
                setShowPhotoMenu(false);
                setShowUrlInput(false);
                setImageUrl('');
                fetchPosts();
                toast.success('Posted successfully!');
            } else {
                toast.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Something went wrong');
        } finally {
            setIsPosting(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setPostImage(reader.result);
            setShowPhotoMenu(false);
        };
        reader.readAsDataURL(file);
    };

    const handleUrlSubmit = () => {
        if (imageUrl.trim()) {
            setPostImage(imageUrl.trim());
            setShowUrlInput(false);
            setShowPhotoMenu(false);
            setImageUrl('');
        }
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    // Trending topics (static for now)
    const trendingTopics = [
        { tag: 'Technology', posts: '2.1K posts' },
        { tag: 'Design', posts: '1.8K posts' },
        { tag: 'Programming', posts: '1.5K posts' },
        { tag: 'AI', posts: '3.2K posts' },
        { tag: 'Startups', posts: '890 posts' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="flex gap-8">

                    {/* ── Left Sidebar ── */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start space-y-5">
                        {/* Profile Card */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="glass-card rounded-2xl overflow-hidden"
                            >
                                <div className="h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient" />
                                <div className="px-5 pb-5 -mt-8">
                                    <img
                                        src={user.pic || 'https://via.placeholder.com/64'}
                                        alt={user.name}
                                        className="w-14 h-14 rounded-xl border-3 border-white shadow-md object-cover bg-white"
                                    />
                                    <h3 className="font-bold text-gray-900 mt-3 text-sm">{user.name}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                                    {user.isAdmin && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full mt-2">
                                            Admin
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="glass-card rounded-2xl p-4"
                        >
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Quick Links</h4>
                            <nav className="space-y-1 stagger-children">
                                {[
                                    { icon: Flame, label: 'Trending', to: '/explore', color: 'text-orange-500' },
                                    { icon: Bookmark, label: 'Saved', to: '#', color: 'text-indigo-500' },
                                    { icon: Users, label: 'Friends', to: '#', color: 'text-emerald-500' },
                                    { icon: Calendar, label: 'Events', to: '#', color: 'text-pink-500' },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 group"
                                    >
                                        <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </aside>

                    {/* ── Main Feed (Center) ── */}
                    <main className="flex-1 min-w-0 max-w-2xl">
                        {/* Welcome Banner */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-5 mb-6 text-white shadow-lg shadow-indigo-500/20 animate-gradient relative overflow-hidden"
                            >
                                {/* Floating decorative blobs */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full animate-float" />
                                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full animate-float-reverse" />
                                <h2 className="text-lg font-bold relative z-10">Welcome back, {user.name?.split(' ')[0]}! 👋</h2>
                                <p className="text-sm text-white/70 mt-1 relative z-10">What would you like to share today?</p>
                            </motion.div>
                        )}

                        {/* Create Post Widget */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="glass-card rounded-2xl p-5 mb-8"
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={user?.pic || 'https://via.placeholder.com/40'}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="What's on your mind?"
                                            rows={2}
                                            className="w-full bg-slate-50/80 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 border border-slate-100 resize-none text-sm"
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handlePostSubmit())}
                                        />
                                        {/* Image Preview */}
                                        {postImage && (
                                            <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200">
                                                <img src={postImage} alt="Preview" className="w-full max-h-60 object-cover" />
                                                <button
                                                    onClick={() => setPostImage('')}
                                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-3">
                                            <div className="relative">
                                                <button
                                                    onClick={() => { setShowPhotoMenu(!showPhotoMenu); setShowUrlInput(false); }}
                                                    className={`flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg text-xs font-medium ${showPhotoMenu ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50/50'
                                                        }`}
                                                >
                                                    <Image size={16} />
                                                    Photo
                                                </button>

                                                {/* Photo Menu Popover */}
                                                <AnimatePresence>
                                                    {showPhotoMenu && (
                                                        <>
                                                            {/* Click-outside backdrop */}
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => { setShowPhotoMenu(false); setShowUrlInput(false); }}
                                                            />
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="absolute left-0 bottom-full mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
                                                            >
                                                                <div className="p-2">
                                                                    {/* Header with close */}
                                                                    <div className="flex items-center justify-between px-3 py-2">
                                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add Photo</span>
                                                                        <button
                                                                            onClick={() => { setShowPhotoMenu(false); setShowUrlInput(false); }}
                                                                            className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                                        >
                                                                            <X size={24} strokeWidth={2.5} />
                                                                        </button>
                                                                    </div>
                                                                    {/* Upload from device */}
                                                                    <label className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-indigo-50/50 transition-colors group">
                                                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                                                                            <Upload size={16} className="text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-semibold text-gray-900">Upload Photo</p>
                                                                            <p className="text-[11px] text-gray-400">Choose from your device</p>
                                                                        </div>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={handleFileUpload}
                                                                        />
                                                                    </label>

                                                                    <div className="h-px bg-gray-100 mx-2 my-1" />

                                                                    {/* Paste URL */}
                                                                    <button
                                                                        onClick={() => setShowUrlInput(true)}
                                                                        className="flex items-center gap-3 px-3 py-3 rounded-lg w-full hover:bg-emerald-50/50 transition-colors group"
                                                                    >
                                                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                                                                            <Link2 size={16} className="text-white" />
                                                                        </div>
                                                                        <div className="text-left">
                                                                            <p className="text-sm font-semibold text-gray-900">Image Link</p>
                                                                            <p className="text-[11px] text-gray-400">Paste an image URL</p>
                                                                        </div>
                                                                    </button>
                                                                </div>

                                                                {/* URL Input */}
                                                                <AnimatePresence>
                                                                    {showUrlInput && (
                                                                        <motion.div
                                                                            initial={{ height: 0 }}
                                                                            animate={{ height: 'auto' }}
                                                                            exit={{ height: 0 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                                                                                <input
                                                                                    type="text"
                                                                                    value={imageUrl}
                                                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                                                    placeholder="https://example.com/image.jpg"
                                                                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                                                                                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                                                                    autoFocus
                                                                                />
                                                                                <button
                                                                                    onClick={handleUrlSubmit}
                                                                                    className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-xs font-bold hover:shadow-md transition-all"
                                                                                >
                                                                                    Add
                                                                                </button>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <button
                                                onClick={handlePostSubmit}
                                                disabled={(!content.trim() && !postImage) || isPosting}
                                                className={`btn-primary px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${((!content.trim() && !postImage) || isPosting) ? 'opacity-50 cursor-not-allowed !shadow-none !scale-100' : ''}`}
                                            >
                                                <Send size={13} />
                                                {isPosting ? 'Posting...' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Stats Strip */}
                        <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
                            {[
                                { label: 'Total Posts', value: posts.length, icon: Sparkles, color: 'from-indigo-400 to-indigo-600' },
                                { label: 'Total Likes', value: posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0), icon: Flame, color: 'from-orange-400 to-red-500' },
                                { label: 'Active Users', value: new Set(posts.map(p => p.user?._id)).size, icon: Users, color: 'from-emerald-400 to-teal-600' },
                            ].map((stat) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 min-w-[140px] flex-1"
                                >
                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                                        <stat.icon size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-900 leading-tight">{stat.value}</p>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Feed */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <div className="w-12 h-12 rounded-full border-[3px] border-indigo-100 border-t-indigo-500 animate-spin" />
                                <p className="text-sm text-gray-400 font-medium">Loading posts...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <Sparkles className="mx-auto text-indigo-300 mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
                                <p className="text-gray-400">Be the first to share something!</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-5">
                                <AnimatePresence>
                                    {posts.map((post, index) => (
                                        <motion.div
                                            key={post._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.04 }}
                                        >
                                            <Post post={post} onDelete={handleDeletePost} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </main>

                    {/* ── Right Sidebar ── */}
                    <aside className="hidden xl:block w-72 flex-shrink-0 sticky top-24 self-start space-y-5">
                        {/* Trending Topics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={18} className="text-indigo-500" />
                                <h3 className="font-bold text-gray-900 text-sm">Trending Topics</h3>
                            </div>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, i) => (
                                    <motion.div
                                        key={topic.tag}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 -mx-2 px-2 py-2 rounded-xl transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                <Hash size={14} className="text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{topic.tag}</p>
                                                <p className="text-[11px] text-gray-400">{topic.posts}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <Link to="/explore" className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-500 mt-4 pt-3 border-t border-gray-100">
                                Show more →
                            </Link>
                        </motion.div>
                    </aside>
                </div>

                {/* Footer */}
                <footer className="mt-12 py-8 border-t border-gray-200/60">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                            S
                        </div>
                        <p className="text-sm font-semibold text-gradient">SocialApp</p>
                        <p className="text-xs text-gray-400">© 2026 All Rights Reserved — Ankit</p>
                        <div className="flex gap-4 mt-1">
                            <span className="text-[11px] text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors">Privacy</span>
                            <span className="text-[11px] text-gray-300">·</span>
                            <span className="text-[11px] text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors">Terms</span>
                            <span className="text-[11px] text-gray-300">·</span>
                            <span className="text-[11px] text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors">About</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
