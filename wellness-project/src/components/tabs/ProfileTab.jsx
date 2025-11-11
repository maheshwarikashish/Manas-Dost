import React, { useState, useEffect } from 'react';
import { default as api } from '../../services/api';
import FileUpload from '../FileUpload'; // Assuming this component handles the upload icon and logic

// --- SVG Icons ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .996-3.184 3.3-5.757 6.1-6.918M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 4.407A9.953 9.953 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7a9.953 9.953 0 01-2.093-.21L4.407 4.407m13.186 0L4.407 17.593" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

// --- Helper Components ---
const StatusBadge = ({ status }) => {
    const statusStyles = {
        scheduled: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const ChangePasswordForm = ({ user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const toggleShowPassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setFormError('New passwords do not match.');
            return;
        }
        setIsSubmitting(true);
        setFormError('');
        setFormSuccess('');
        try {
            await api.put('/auth/change-password', { userId: user._id, currentPassword, newPassword });
            setFormSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setFormError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const PasswordInput = ({ value, onChange, placeholder, field }) => (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2"><LockIcon /></span>
            <input
                type={showPasswords[field] ? 'text' : 'password'}
                placeholder={placeholder}
                className="w-full p-3 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                value={value}
                onChange={onChange}
                required
            />
            <button type="button" onClick={() => toggleShowPassword(field)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500">
                {showPasswords[field] ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" field="current" />
            <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" field="new" />
            <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" field="confirm" />
            
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {formSuccess && <p className="text-green-500 text-sm">{formSuccess}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-teal-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50">
                {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
        </form>
    );
};

// --- Main ProfileTab Component ---
const ProfileTab = ({ user, setUser }) => {
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?._id) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await api.get(`/appointments/student/${user._id}`);
                setAppointments(res.data);
            } catch (err) {
                console.error("Failed to fetch appointments", err);
                setError("Couldn't load appointments.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, [user]);

    const handleUploadComplete = (newPhotoUrl) => {
        setUser(prevUser => ({ ...prevUser, photoUrl: newPhotoUrl }));
    };

    const TabButton = ({ tabName, children }) => (
        <button 
            onClick={() => setActiveTab(tabName)}
            className={`py-3 px-6 font-semibold transition-colors duration-200 -mb-px border-b-2 ${activeTab === tabName ? 'text-teal-500 border-teal-500' : 'text-gray-500 border-transparent hover:border-gray-300'}`}>
            {children}
        </button>
    );

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
            {/* --- Profile Header --- */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Cover Photo */}
                <div className="h-48 bg-gradient-to-r from-teal-400 to-blue-500 relative">
                     {/* Profile Picture & Upload */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <div className="relative w-36 h-36 group">
                            <img 
                                src={user.photoUrl || 'https://via.placeholder.com/150'} 
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FileUpload userId={user._id} onUploadComplete={handleUploadComplete} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info & Tabs */}
                <div className="pt-20 pb-2 px-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    </div>
                    <div className="mt-4 flex justify-center border-b border-gray-200">
                        <TabButton tabName="appointments">My Appointments</TabButton>
                        <TabButton tabName="security">Security</TabButton>
                    </div>
                </div>
            </div>

            {/* --- Tab Content --- */}
            <div className="mt-8">
                {isLoading && <div className="text-center p-8">Loading...</div>}
                {error && <div className="text-center p-8 text-red-500">{error}</div>}
                
                {!isLoading && !error && (
                    <div className="animate-fade-in">
                        {activeTab === 'appointments' && (
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Appointments</h3>
                                {appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {appointments.map(appt => (
                                            <div key={appt._id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all hover:bg-gray-50">
                                                <div>
                                                    <p className="font-semibold text-gray-800">Session with {appt.counselor.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}
                                                    </p>
                                                </div>
                                                <StatusBadge status={appt.status} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">You have no scheduled appointments. Use the "Book a Session" tab to get started.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Security Settings</h3>
                                <ChangePasswordForm user={user} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileTab;
