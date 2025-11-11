          
import React, { useState, useEffect } from 'react';
import { default as api } from '../../services/api';
import FileUpload from '../FileUpload'; // Import the new component

// --- SVG Icons ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .996-3.184 3.3-5.757 6.1-6.918M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 4.407A9.953 9.953 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7a9.953 9.953 0 01-2.093-.21L4.407 4.407m13.186 0L4.407 17.593" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

// --- Helper: Status Badge ---
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

// --- Password Change Form Component ---
const ChangePasswordForm = ({ user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setFormError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setFormError('Password must be at least 6 characters long.');
            return;
        }

        setIsSubmitting(true);
        setFormError('');
        setFormSuccess('');

        try {
            // Note: This API endpoint is a placeholder for demonstration.
            await api.put('/auth/change-password', {
                userId: user._id,
                currentPassword,
                newPassword,
            });
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><LockIcon /></span>
                <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Current Password"
                    className="w-full p-3 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500">
                    {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
             {/* New Password */}
            <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2"><LockIcon /></span>
                <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    className="w-full p-3 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500">
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
             {/* Confirm New Password */}
            <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2"><LockIcon /></span>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    className="w-full p-3 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500">
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            
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

    if (isLoading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in p-4 sm:p-6 space-y-8">
            {/* --- Profile Section --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
                    {/* Profile Picture */}
                    <div className="relative w-32 h-32 flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                            src={user.photoUrl || 'https://via.placeholder.com/150'} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                        />
                         <FileUpload userId={user._id} onUploadComplete={handleUploadComplete} />
                    </div>
                    {/* User Info */}
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                        <p className="mt-4 text-xs bg-gray-100 text-gray-600 rounded-full px-4 py-1 inline-block">Student</p>
                    </div>
                </div>
            </div>

            {/* --- Security Section --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Security Settings</h3>
                <ChangePasswordForm user={user} />
            </div>

            {/* --- Appointments Section --- */}
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
        </div>
    );
};

export default ProfileTab;
