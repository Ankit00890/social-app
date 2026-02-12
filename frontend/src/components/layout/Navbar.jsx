import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Home, Search, Bell, User, LogOut, MessageSquare } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">SocialApp</span>
                    </Link>

                    {/* Navigation Links */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="flex flex-col items-center text-blue-600">
                                <Home size={24} />
                                <span className="text-xs mt-1 font-medium">Home</span>
                            </Link>
                            <Link to="/explore" className="flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors">
                                <Search size={24} />
                                <span className="text-xs mt-1 font-medium">Explore</span>
                            </Link>
                            <Link to="/notifications" className="flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors">
                                <Bell size={24} />
                                <span className="text-xs mt-1 font-medium">Notifications</span>
                            </Link>
                            <Link to="/messages" className="flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors">
                                <MessageSquare size={24} />
                                <span className="text-xs mt-1 font-medium">Messages</span>
                            </Link>
                        </div>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                    <img
                                        src={user.pic || 'https://via.placeholder.com/40'}
                                        alt={user.name}
                                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                    />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        {user.name}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
