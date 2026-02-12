import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', pic: '' });
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Helper for basic base64 (for demo simplicity, normally use Cloudinary)
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, upload to Cloudinary here. 
            // For now, we'll just set the name or a placeholder if logic existed.
            // We will skip actual file upload logic for this MVF to keep it simple unless requested.
            // But we can check if the user wants file upload. 
            // The backend expects a string URL.
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(formData.name, formData.email, formData.password, formData.pic);
            navigate('/');
        } catch (error) {
            // Error handled
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] animate-blob animate-float-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] animate-blob animate-float-reverse" />
            <div className="absolute top-[40%] left-[15%] w-[15%] h-[15%] bg-purple-400/15 rounded-full blur-[80px] animate-float" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card rounded-2xl p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mx-auto mb-4">
                            S
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500">Join the SocialApp community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Input
                            label="Profile Picture URL (Optional)"
                            placeholder="https://example.com/me.jpg"
                            value={formData.pic}
                            onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                        />

                        <Button
                            type="submit"
                            className="w-full btn-primary py-3 rounded-xl font-semibold text-lg mt-6"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
