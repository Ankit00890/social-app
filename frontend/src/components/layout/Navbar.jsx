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
        <nav className="sticky top-0 z-50 glass mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform duration-200">
                            S
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
                            SocialApp
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/" className="flex flex-col items-center px-4 py-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 group">
                                <Home size={24} className="group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-[10px] font-semibold mt-1">Home</span>
                            </Link>
                            <Link to="/explore" className="flex flex-col items-center px-4 py-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 group">
                                <Search size={24} className="group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-[10px] font-semibold mt-1">Explore</span>
                            </Link>
                            <Link to="/notifications" className="flex flex-col items-center px-4 py-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 group">
                                <Bell size={24} className="group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-[10px] font-semibold mt-1">Notifications</span>
                            </Link>
                            <Link to="/messages" className="flex flex-col items-center px-4 py-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 group">
                                <MessageSquare size={24} className="group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-[10px] font-semibold mt-1">Messages</span>
                            </Link>
                        </div>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all duration-200">
                                    <img
                                        src={user.pic || 'https://via.placeholder.com/40'}
                                        alt={user.name}
                                        className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-700 leading-tight">
                                            {user.name}
                                        </span>
                                        {user.isAdmin && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold">
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
