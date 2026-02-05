import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaEdit } from 'react-icons/fa';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await authAPI.getProfile();
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validate passwords match if changing
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setSaving(true);
        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone
            };

            // Only include password if it's being changed
            if (formData.password) {
                updateData.password = formData.password;
            }

            const updatedUser = await authAPI.updateProfile(updateData);

            // Update local auth context with new user data
            login(updatedUser);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch] flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch]">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                            My Profile
                        </h1>
                        <p className="text-neutral-500 mt-1">Manage your account information</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                    )}
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-6">
                        <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                            <span className="text-3xl font-bold text-violet-600">
                                {formData.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                                {formData.name}
                            </h2>
                            <p className="text-neutral-500">{formData.email}</p>
                            <span className="inline-block mt-1 text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 rounded-full">
                                {user?.role === 'admin' ? 'Administrator' : 'User'}
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                <FaUser className="text-violet-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full p-3 rounded-lg border ${isEditing
                                        ? 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                                        : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                <FaEnvelope className="text-violet-500" /> Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full p-3 rounded-lg border bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800 cursor-not-allowed text-neutral-500"
                            />
                            <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                <FaPhone className="text-violet-500" /> Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Enter your phone number"
                                className={`w-full p-3 rounded-lg border ${isEditing
                                        ? 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                                        : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Password Section (Only when editing) */}
                        {isEditing && (
                            <>
                                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                                        Change Password
                                    </h3>
                                    <p className="text-sm text-neutral-500 mb-4">
                                        Leave blank to keep your current password
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                        <FaLock className="text-violet-500" /> New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter new password"
                                        className="w-full p-3 rounded-lg border bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                        <FaLock className="text-violet-500" /> Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className="w-full p-3 rounded-lg border bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                                    />
                                </div>
                            </>
                        )}

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        fetchProfile(); // Reset form
                                    }}
                                    className="flex-1 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
