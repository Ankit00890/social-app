import React from 'react';
import Navbar from '../components/layout/Navbar';
import { User } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-4">
                            <img
                                src={user?.pic || 'https://via.placeholder.com/150'}
                                alt={user?.name}
                                className="w-32 h-32 rounded-full border-4 border-white object-cover"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                        <p className="text-gray-500">{user?.email}</p>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-500">
                            <User size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No posts yet.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
