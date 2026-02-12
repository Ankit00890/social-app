import React from 'react';
import Navbar from '../components/layout/Navbar';
import { MessageSquare } from 'lucide-react';

const Messages = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
                    <p className="text-gray-500">Chat with your friends privately. Coming soon!</p>
                </div>
            </main>
        </div>
    );
};

export default Messages;
