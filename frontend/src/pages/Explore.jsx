import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Search } from 'lucide-react';

const Explore = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore</h1>
                    <p className="text-gray-500">Discover new people and trending posts. Coming soon!</p>
                </div>
            </main>
        </div>
    );
};

export default Explore;
