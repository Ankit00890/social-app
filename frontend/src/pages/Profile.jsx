import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { User, Mail, Camera, Pencil, X, Check, Loader2, ShieldCheck } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { API_BASE } from '../services/api';

const Profile = () => {
    const { user, login } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        pic: user?.pic || '',
        password: '',
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            const body = { name: formData.name, email: formData.email, pic: formData.pic };
            if (formData.password.trim()) {
                body.password = formData.password;
            }

            const res = await fetch(`${API_BASE}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const updated = await res.json();
                // Update localStorage so the whole app reflects changes
                localStorage.setItem('user', JSON.stringify(updated));
                // Reload user state — we can force by setting it directly
                window.location.reload();
                toast.success('Profile updated!');
            } else {
                const err = await res.json();
                toast.error(err.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            pic: user?.pic || '',
            password: '',
        });
        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card rounded-2xl overflow-hidden"
                >
                    {/* Cover Photo */}
                    <div className="h-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Profile Info Section */}
                    <div className="px-6 sm:px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-5 flex items-end justify-between">
                            <div className="relative group">
                                <img
                                    src={editing ? (formData.pic || 'https://via.placeholder.com/150') : (user?.pic || 'https://via.placeholder.com/150')}
                                    alt={user?.name}
                                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white object-cover shadow-lg bg-white"
                                />
                                {user?.isAdmin && (
                                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-1.5 rounded-lg shadow-md">
                                        <ShieldCheck size={14} />
                                    </div>
                                )}
                            </div>

                            {/* Edit / Save buttons */}
                            {!editing ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setEditing(true)}
                                    className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                                >
                                    <Pencil size={15} />
                                    Edit Profile
                                </motion.button>
                            ) : (
                                <div className="flex gap-2">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCancel}
                                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                                    >
                                        <X size={15} />
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                                    >
                                        {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                                        {saving ? 'Saving...' : 'Save'}
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Display Mode */}
                        <AnimatePresence mode="wait">
                            {!editing ? (
                                <motion.div
                                    key="display"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                        {user?.name}
                                        {user?.isAdmin && (
                                            <span className="text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                Admin
                                            </span>
                                        )}
                                    </h1>
                                    <p className="text-gray-500 flex items-center gap-2 text-sm">
                                        <Mail size={14} />
                                        {user?.email}
                                    </p>

                                    {/* Info Cards */}
                                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                                            <p className="text-gray-800 font-medium flex items-center gap-2">
                                                <User size={16} className="text-indigo-400" />
                                                {user?.name}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                                            <p className="text-gray-800 font-medium flex items-center gap-2">
                                                <Mail size={16} className="text-indigo-400" />
                                                {user?.email}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Profile Photo</p>
                                            <p className="text-gray-800 font-medium flex items-center gap-2">
                                                <Camera size={16} className="text-indigo-400" />
                                                {user?.pic ? 'Custom photo' : 'Default avatar'}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Role</p>
                                            <p className="text-gray-800 font-medium flex items-center gap-2">
                                                <ShieldCheck size={16} className={user?.isAdmin ? 'text-amber-500' : 'text-indigo-400'} />
                                                {user?.isAdmin ? 'Administrator' : 'Member'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* Edit Mode */
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white text-sm"
                                                placeholder="Your name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white text-sm"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Profile Picture URL</label>
                                        <div className="relative">
                                            <Camera size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.pic}
                                                onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white text-sm"
                                                placeholder="https://example.com/avatar.jpg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                            New Password <span className="text-gray-300 normal-case">(leave blank to keep current)</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;
