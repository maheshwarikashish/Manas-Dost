import React, { useState, useEffect } from 'react';
import { default as api } from '../../services/api';
import FileUpload from '../FileUpload'; // Handles profile picture uploads

// --- SVG Icons ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;


// --- Main ProfileTab Component ---
const ProfileTab = ({ user, setUser, handleLogout }) => {
    const [view, setView] = useState('main'); // 'main' or 'edit'
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, [user]);

    const handleUploadComplete = (newPhotoUrl) => {
        setUser(prevUser => ({ ...prevUser, photoUrl: newPhotoUrl }));
    };
    
    const MainProfileView = () => (
        <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center p-4">
                <div className="w-6"></div> {/* Spacer */}
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <button className="text-gray-500"><SettingsIcon /></button>
            </div>

            <div className="p-4 text-center">
                <div className="relative w-28 h-28 mx-auto mb-2">
                    <img 
                        src={user.photoUrl || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="absolute bottom-0 right-0">
                        <FileUpload userId={user._id} onUploadComplete={handleUploadComplete} simpleIcon={true} />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-base text-gray-500">{user.email}</p>
                <button 
                    onClick={() => setView('edit')}
                    className="mt-4 bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-orange-600 transition-colors"
                >
                    Edit Profile
                </button>
            </div>

            <div className="my-6">
                <AppointmentsList appointments={appointments} isLoading={isLoading} />
            </div>

            <div className="p-4">
                <button onClick={handleLogout} className="w-full flex items-center justify-center p-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <LogoutIcon />
                    Log Out
                </button>
            </div>
        </div>
    );

    if (view === 'edit') {
        return <EditProfileView user={user} setUser={setUser} goBack={() => setView('main')} />;
    }

    return <MainProfileView />;
};

// --- Edit Profile View Component ---
const EditProfileView = ({ user, setUser, goBack }) => {
    const [name, setName] = useState(user.name);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Separate states for password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.put(`/auth/user/${user._id}`, { name });
            setUser(res.data); // Update user state in parent
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
        setIsSaving(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        setIsChangingPassword(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/auth/change-password', { userId: user._id, currentPassword, newPassword });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
        }
        setIsChangingPassword(false);
    };

    const FormInput = ({ label, value, onChange, type = 'text', placeholder, required = true }) => (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <input 
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
        </div>
    );

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="flex items-center mb-6">
                <button onClick={goBack} className="mr-4 text-gray-600">
                    <BackIcon />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
            </div>

            {message.text && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={handleProfileUpdate} className="space-y-4 p-6 bg-white rounded-lg shadow-sm border">
                    <h2 class="text-xl font-bold text-gray-700">Personal Information</h2>
                    <FormInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                    <FormInput label="Email" value={user.email} onChange={() => {}} type="email" placeholder="Your email" required={false} />
                    <button type="submit" disabled={isSaving} className="w-full bg-orange-500 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-orange-600 disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>

                <form onSubmit={handlePasswordChange} className="space-y-4 p-6 bg-white rounded-lg shadow-sm border">
                    <h2 class="text-xl font-bold text-gray-700">Change Password</h2>
                    <FormInput label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="••••••••" />
                    <FormInput label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="••••••••" />
                    <FormInput label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" />
                    <button type="submit" disabled={isChangingPassword} className="w-full bg-gray-700 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-gray-800 disabled:opacity-50">
                        {isChangingPassword ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Appointments List Component ---
const AppointmentsList = ({ appointments, isLoading }) => {
    const StatusBadge = ({ status }) => {
        const statusStyles = {
            scheduled: 'bg-orange-100 text-orange-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
    };

    if (isLoading) return <p className="text-center text-gray-500">Loading appointments...</p>;
    if (appointments.length === 0) return <p className="text-center text-gray-500 p-4">No appointments scheduled.</p>;

    return (
        <div className="space-y-3 px-4">
            <h3 className="text-xl font-bold text-gray-700">My Appointments</h3>
            {appointments.map(appt => (
                <div key={appt._id} className="p-3 bg-white rounded-lg shadow-sm border flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-800">With {appt.counselor.name}</p>
                        <p className="text-sm text-gray-600">
                            {new Date(appt.date).toLocaleDateString()} at {appt.time}
                        </p>
                    </div>
                    <StatusBadge status={appt.status} />
                </div>
            ))}
        </div>
    );
};

export default ProfileTab;
