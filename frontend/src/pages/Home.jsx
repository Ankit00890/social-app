import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Post from '../components/posts/Post';
import { Image, Send } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
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
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ content }),
            });

            if (res.ok) {
                setContent('');
                fetchPosts(); // Refresh feed
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

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-xl mx-auto px-4 py-8">
                {/* Create Post Widget */}
                {user && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                        <div className="flex gap-4">
                            <img
                                src={user?.pic || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="w-full bg-gray-50 rounded-full px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handlePostSubmit()}
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                                        <Image size={20} />
                                        <span className="text-sm font-medium">Photo</span>
                                    </button>
                                    <button
                                        onClick={handlePostSubmit}
                                        disabled={!content.trim() || isPosting}
                                        className={`bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2 ${(!content.trim() || isPosting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Send size={16} />
                                        {isPosting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feed */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <Post key={post._id} post={post} onDelete={handleDeletePost} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
