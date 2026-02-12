import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join our community today</p>
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
                        className="w-full mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default Signup;
