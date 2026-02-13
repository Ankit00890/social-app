import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Post from '../components/posts/Post';
import { Search, TrendingUp, Hash, Flame, Zap, Compass, Filter, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { API_BASE } from '../services/api';

const Explore = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { name: 'All', icon: Compass, color: 'from-indigo-500 to-purple-500' },
        { name: 'Trending', icon: Flame, color: 'from-orange-500 to-red-500' },
        { name: 'Popular', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
        { name: 'Latest', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    ];

    const trendingTopics = [
        { tag: 'Technology', posts: '2.1K', emoji: '💻', color: 'from-blue-500 to-indigo-500' },
        { tag: 'Artificial Intelligence', posts: '3.2K', emoji: '🤖', color: 'from-purple-500 to-pink-500' },
        { tag: 'Design', posts: '1.8K', emoji: '🎨', color: 'from-pink-500 to-rose-500' },
        { tag: 'Programming', posts: '1.5K', emoji: '⚡', color: 'from-amber-500 to-orange-500' },
        { tag: 'Startups', posts: '890', emoji: '🚀', color: 'from-emerald-500 to-teal-500' },
        { tag: 'Web Development', posts: '2.4K', emoji: '🌐', color: 'from-cyan-500 to-blue-500' },
    ];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_BASE}/posts`);
            const data = await res.json();
            setPosts(data);
            setFilteredPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = [...posts];

        // Search filter
        if (searchQuery.trim()) {
            result = result.filter(post =>
                post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (activeCategory === 'Trending') {
            result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        } else if (activeCategory === 'Popular') {
            result = result.filter(p => (p.likes?.length || 0) >= 1);
            result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        } else if (activeCategory === 'Latest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredPosts(result);
    }, [searchQuery, activeCategory, posts]);

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

                {/* Hero Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 animate-bounce-subtle">
                        <Compass size={14} />
                        Discover
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                        Explore what's <span className="text-gradient">happening</span>
                    </h1>
                    <p className="text-gray-500 max-w-md mx-auto text-sm mb-6">
                        Search for posts, discover trending topics, and find content that interests you.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        {/* Animated glow behind search */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl animate-pulse-ring -z-10" />
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts, people..."
                            className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2 mb-8 justify-center flex-wrap"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === cat.name
                                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <cat.icon size={15} />
                            {cat.name}
                        </button>
                    ))}
                </motion.div>

                <div className="flex gap-8">
                    {/* ── Main Content ── */}
                    <main className="flex-1 min-w-0">
                        {/* Trending Topics Grid */}
                        {!searchQuery && activeCategory === 'All' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="mb-8"
                            >
                                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                    <Flame size={16} className="text-orange-500" />
                                    Trending Topics
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {trendingTopics.map((topic, i) => (
                                        <motion.div
                                            key={topic.tag}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="relative group cursor-pointer"
                                        >
                                            <div className={`bg-gradient-to-br ${topic.color} rounded-2xl p-4 text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
                                                <span className="text-2xl mb-2 block">{topic.emoji}</span>
                                                <h3 className="font-bold text-sm leading-tight">{topic.tag}</h3>
                                                <p className="text-xs text-white/70 mt-1">{topic.posts} posts</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Search Results Header */}
                        {searchQuery && (
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold text-gray-900">{filteredPosts.length}</span> result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                                </p>
                            </div>
                        )}

                        {/* Posts Feed */}
                        <div className="mb-4">
                            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                <Filter size={14} className="text-gray-400" />
                                {activeCategory === 'All' ? 'All Posts' : `${activeCategory} Posts`}
                                <span className="text-xs font-normal text-gray-400 ml-1">({filteredPosts.length})</span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <div className="w-12 h-12 rounded-full border-[3px] border-purple-100 border-t-purple-500 animate-spin" />
                                <p className="text-sm text-gray-400 font-medium">Discovering content...</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 glass-card rounded-2xl"
                            >
                                <Search className="mx-auto text-gray-200 mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                                    {searchQuery ? 'No results found' : 'No posts yet'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {searchQuery ? 'Try a different search term' : 'Be the first to create a post!'}
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-5">
                                <AnimatePresence>
                                    {filteredPosts.map((post, index) => (
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
                    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start space-y-5">
                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <h3 className="font-bold text-sm text-gray-900 mb-4">Community Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Total Posts</span>
                                    <span className="text-sm font-bold text-gray-900">{posts.length}</span>
                                </div>
                                <div className="h-px bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Total Likes</span>
                                    <span className="text-sm font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}</span>
                                </div>
                                <div className="h-px bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Active Authors</span>
                                    <span className="text-sm font-bold text-gray-900">{new Set(posts.map(p => p.user?._id)).size}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Authors */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <h3 className="font-bold text-sm text-gray-900 mb-4">Top Authors</h3>
                            <div className="space-y-3">
                                {(() => {
                                    // Calculate top authors by post count
                                    const authorCounts = {};
                                    posts.forEach(p => {
                                        if (p.user) {
                                            const key = p.user._id;
                                            if (!authorCounts[key]) {
                                                authorCounts[key] = { user: p.user, count: 0 };
                                            }
                                            authorCounts[key].count++;
                                        }
                                    });
                                    return Object.values(authorCounts)
                                        .sort((a, b) => b.count - a.count)
                                        .slice(0, 5)
                                        .map((author, i) => (
                                            <div key={author.user._id} className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                                                <img
                                                    src={author.user.profilePic || 'https://via.placeholder.com/32'}
                                                    alt={author.user.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{author.user.name}</p>
                                                    <p className="text-[11px] text-gray-400">{author.count} post{author.count !== 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                        ));
                                })()}
                                {posts.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-2">No authors yet</p>
                                )}
                            </div>
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

export default Explore;
