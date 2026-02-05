import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[80vh] lg:px-28 md:px-16 sm:px-7 px-4 mt-[10ch] flex items-center justify-center">
            <div className="w-full max-w-md bg-neutral-100 dark:bg-neutral-900/40 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-neutral-800 dark:text-neutral-100">
                    Create Account
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              bg-neutral-200/60 dark:bg-neutral-900/60 px-4 h-12 
              border border-neutral-200 dark:border-neutral-800 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              bg-neutral-200/60 dark:bg-neutral-900/60 px-4 h-12 
              border border-neutral-200 dark:border-neutral-800 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              bg-neutral-200/60 dark:bg-neutral-900/60 px-4 h-12 
              border border-neutral-200 dark:border-neutral-800 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              bg-neutral-200/60 dark:bg-neutral-900/60 px-4 h-12 
              border border-neutral-200 dark:border-neutral-800 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block mb-2 font-medium text-neutral-700 dark:text-neutral-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              bg-neutral-200/60 dark:bg-neutral-900/60 px-4 h-12 
              border border-neutral-200 dark:border-neutral-800 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-violet-600 hover:bg-violet-700 
            text-white font-medium rounded-md transition-colors duration-300
            disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-neutral-600 dark:text-neutral-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
