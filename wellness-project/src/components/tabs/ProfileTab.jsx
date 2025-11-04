import React, { useState } from 'react';
import api from '../../services/api';

const ProfileTab = ({ user }) => {
    // State to toggle between viewing and editing mode
    const [isEditing, setIsEditing] = useState(false);
    
    // State to manage the form data
    const [name, setName] = useState(user.name);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State for handling feedback messages
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        
        // --- Client-side Validation ---
        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }
        if (newPassword && newPassword.length < 6) {
            setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', type: '' });

        // Prepare the data to send to the backend.
        // Only include the fields that are being changed.
        const payload = { name };
        if (newPassword) {
            payload.password = newPassword;
        }
        
        try {
            // Send the update request to the backend route
            await api.put('/auth/profile', payload);
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            
            // Clear password fields and exit edit mode
            setNewPassword('');
            setConfirmPassword('');
            setIsEditing(false);
        } catch (err) {
            setMessage({ text: err.response?.data?.msg || 'Failed to update profile. Please try again.', type: 'error' });
        } finally {
            setIsLoading(false);
            // Clear the feedback message after a few seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    const handleCancel = () => {
        // Reset all form fields to their original state and exit edit mode
        setName(user.name);
        setNewPassword('');
        setConfirmPassword('');
        setIsEditing(false);
    };

    return (
        <div>
            <h3 className="text-3xl font-bold text-slate-700 mb-6">My Profile</h3>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                {isEditing ? (
                    // --- Edit View ---
                    <form onSubmit={handleSaveChanges} className="space-y-4 animate-fade-in">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Student ID (Cannot be changed)</label>
                            <p className="mt-1 text-slate-500 p-2 bg-slate-100 rounded-md">{user.studentId}</p>
                        </div>
                        <hr/>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-600">New Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <button type="button" onClick={handleCancel} className="bg-slate-200 text-slate-800 font-semibold px-5 py-2 rounded-lg hover:bg-slate-300 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400">
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    // --- Display View ---
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Full Name</label>
                            <p className="mt-1 text-lg font-semibold text-slate-800">{name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Student ID</label>
                            <p className="mt-1 text-lg font-semibold text-slate-800">{user.studentId}</p>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={() => setIsEditing(true)} className="bg-slate-800 text-white font-semibold px-5 py-2 rounded-lg hover:bg-slate-900 transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Feedback Message */}
                {message.text && (
                    <div className={`mt-4 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileTab;

