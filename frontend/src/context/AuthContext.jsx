import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {

            const { data } = await api.post('/auth/login', { email, password });

            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            toast.success('Login successful');
            return data;
        } catch (error) {

            const message = error.response?.data?.message || 'Login failed - Check console for details';
            toast.error(message);
            throw error;
        }
    };

    const signup = async (name, email, password, pic) => {
        try {

            const { data } = await api.post('/auth/register', { name, email, password, pic });

            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            toast.success('Registration successful');
            return data;
        } catch (error) {

            const message = error.response?.data?.message || 'Registration failed - Check console for details';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
